<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new ltp"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-ltp">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input disabled v-model="nLtp.name"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Label</label>
          <va-input v-model="nLtp.label"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Description</label>
          <va-input v-model="nLtp.description"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Info (JSON)</label>
          <va-medium-editor>
            <pre class="info">{{ infoStr.trim() }}</pre>
          </va-medium-editor>
        </div>
      </div>

      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small  @click="submit"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateLtp',
  props: ['show', 'nodeId', 'name'],

  data: function () {
    return {
      showModal: false,
      error: '',
      infoStr: '{}',
      nLtp: {
        vnodeId: this.nodeId,
        name: '',
        label: '',
        description: '',
        info: {},
        busy: false,
      },
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateLtp()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
    /* 'nPrefix.node': function (newVal, oldVal) {
      this.nPrefix.interface = ''
      this.getInterfaces(newVal)
    }, */
  },
  methods: {
    initCreateLtp () {
      console.log('init create ltp modal')
      this.nLtp = {
        vnodeId: this.nodeId,
        name: this.name,
        label: '',
        description: '',
        info: {},
        busy: false,
      }
      this.error = ''
      this.showModal = true
    },
    submit () {
      const info = document.getElementsByClassName('info')[0]
      this.nLtp.info = JSON.parse(info.textContent)
      console.log('nLtp: ', JSON.stringify(this.nLtp))
      if (this.nLtp.name === '') {
        this.error = 'Name is required'
        return
      }
      this.$emit('onOk', this.nLtp)
      // this.showModal = false
    },
    cancel () {
      this.$emit('onCancel')
      this.showModal = false
    },
  },
}
</script>

<style lang="scss">
.modal-create-ltp {
  width: 500px;
  max-width: 500px;
}
</style>
