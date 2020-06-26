<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new subnet"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-subnet">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nSubnet.name"/>
        </div>
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small  @click="postSubnet"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateSubnet',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nSubnet: {
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
          this.initCreateModal()
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
    initCreateModal () {
      console.log('init create subnet modal')
      this.nSubnet = {
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    postSubnet () {
      if (this.nSubnet.name === '') {
        this.error = 'Node name not specified'
        return
      }
      this.$emit('onOk', this.nSubnet)
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
.modal-create-subnet {
  width: 500px;
  max-width: 500px;
}
</style>
