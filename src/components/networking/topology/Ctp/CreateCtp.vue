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
          <va-input placeholder="e.g., ..." v-model="nCtp.vltpId"/>
        </div>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nCtp.name"/>
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
  props: ['show', 'ltpId'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nCtp: {
        vltpId: 0,
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
      this.nCtp = {
        vltpId: this.ltpId,
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    submit () {
      if (this.nCtp.name === '') {
        this.error = 'Ctp name not specified'
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
