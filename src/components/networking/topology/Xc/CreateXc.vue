<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new xc"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-xc">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">nodeID</label>
          <va-input placeholder="e.g., ..." v-model="nXc.vnodeId"/>
        </div>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nXc.name"/>
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
  name: 'CreateXc',
  props: ['show', 'nodeId'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nXc: {
        vnodeId: 0,
        name: '',
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
      this.nXc = {
        vnodeId: this.nodeId,
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    submit () {
      if (this.nXc.name === '') {
        this.error = 'Xc name not specified'
        return
      }
      this.$emit('onOk', this.nXc)
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
.modal-create-xc {
  width: 500px;
  max-width: 500px;
}
</style>
