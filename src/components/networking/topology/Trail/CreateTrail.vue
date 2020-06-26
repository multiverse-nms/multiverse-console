<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new trail"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-trail">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nTrail.name"/>
        </div>
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small  @click="postTrail"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateTrail',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nTrail: {
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
          this.initCreateTrail()
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
    initCreateTrail () {
      console.log('init create trail modal')
      this.nTrail = {
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    postTrail () {
      if (this.nTrail.name === '') {
        this.error = 'Trail name not specified'
        return
      }
      this.$emit('onOk', this.nTrail)
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
.modal-create-trail {
  width: 500px;
  max-width: 500px;
}
</style>
