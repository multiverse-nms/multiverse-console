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
          <label class="label">NodeId</label>
          <va-input placeholder="e.g., ..." v-model="nLtp.vnodeId"/>
        </div>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nLtp.name"/>
        </div>
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small  @click="postLtp"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateLtp',
  props: ['show', 'nodeId'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nLtp: {
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
          this.initCreateLtp()
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
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    postLtp () {
      if (this.nLtp.name === '') {
        this.error = 'Ltp name not specified'
        return
      }
      this.$emit('onOk', this.nLtp)
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
.modal-create-ltp {
  width: 500px;
  max-width: 500px;
}
</style>
