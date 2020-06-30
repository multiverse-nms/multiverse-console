<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new ctp"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-ctp">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">LtpId</label>
          <va-input disabled v-model="nCtp.vltpId"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input v-model="nCtp.name"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Label</label>
          <va-input v-model="nCtp.label"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Description</label>
          <va-input v-model="nCtp.description"/>
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
  name: 'CreateCtp',
  props: ['show', 'ltpId', 'ltpName'],

  data: function () {
    return {
      showModal: false,
      error: '',
      infoStr: '{}',
      nCtp: {
        vltpId: this.ltpId,
        name: this.ltpName + ':',
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
          this.initModal()
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
    initModal () {
      console.log('init create ctp modal')
      this.nCtp = {
        vltpId: this.ltpId,
        name: this.ltpName + ':',
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
      this.nCtp.info = JSON.parse(info.textContent)
      console.log('nCtp: ', JSON.stringify(this.nCtp))
      if (this.nCtp.name === '') {
        this.error = 'Name is required'
        return
      }
      this.$emit('onOk', this.nCtp)
      this.showModal = false
    },
    cancel () {
      this.$emit('onCancel')
      this.showModal = false
    },
  },
}
</script>

<style lang="scss">
.modal-create-ctp {
  width: 500px;
  max-width: 500px;
}
</style>
