<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new link"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-link">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nLink.name"/>
        </div>
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small @click="submit"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateLink',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nLink: {
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
          this.initCreateLink()
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
    initCreateLink () {
      console.log('init create link modal')
      this.nLink = {
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    submit () {
      if (this.nLink.name === '') {
        this.error = 'Link name not specified'
        return
      }
      this.$emit('onOk', this.nLink)
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
.modal-create-link {
  width: 500px;
  max-width: 500px;
}
</style>
