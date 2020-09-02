<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new node"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-node">
      <form>
        <va-input
          readonly
          v-model="nNode.name"
          type="text"
          label="Name"
        />
        <va-input
          removable
          v-model="nNode.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nNode.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />
        <va-input
          readonly
          v-model="nNode.type"
          type="text"
          label="Type"
        />
        <va-input
          v-model="nNode.location"
          type="text"
          label="Location"
          :error="!!locationErrors.length"
          :error-messages="locationErrors"
        />
        <div>
          <div v-for="(info, index) in infoArray" :key="index" class="row">
            <div class="flex xs5 offset--xs1">
              <va-input
                v-model="info[0]"
                type="text"
                label="Info key"
              />
            </div>
            <div class="flex xs5 ml-1">
              <va-input
                v-model="info[1]"
                type="text"
                label="Info value"
              />
            </div>
          </div>
          <div class="text-center">
            <va-button color="gray" @click="addInfoItem">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </va-button>
          </div>
        </div>
        <div class="d-flex justify--center mt-3">
          <va-button small color="danger" @click="cancel">Cancel</va-button>
          <va-button small color="primary" @click="submit">Submit</va-button>
        </div>
      </form>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateNode',
  props: ['show', 'subnetId', 'name'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],
      nNode: {
        vsubnetId: this.subnetId,
        name: '',
        label: '',
        description: '',
        info: {},
        type: '',
        posx: 0,
        posy: 0,
        location: '',
      },
      labelErrors: [],
      descErrors: [],
      locationErrors: [],
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateNode()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
  },
  methods: {
    initCreateNode () {
      this.nNode = {
        vsubnetId: this.subnetId,
        name: this.name,
        label: '',
        description: '',
        info: {},
        type: 'fwd',
        posx: Math.floor(Math.random() * Math.floor(800)),
        posy: Math.floor(Math.random() * Math.floor(500)),
        location: '',
      }
      this.infoArray = [['', '']]

      this.labelErrors = []
      this.descErrors = []
      this.locationErrors = []

      this.showModal = true
    },
    addInfoItem () {
      const lastItem = this.infoArray[this.infoArray.length - 1]
      if ((lastItem[0] !== '') && (lastItem[1] !== '')) {
        this.infoArray.push(['', ''])
      }
    },
    submit () {
      for (var i = 0, len = this.infoArray.length; i < len; i++) {
        const item = this.infoArray[i]
        if (item[0] !== '' && item[1] !== '') {
          // TODO: support boolean
          if (isNaN(item[1])) {
            this.nNode.info[item[0]] = item[1]
          } else {
            this.nNode.info[item[0]] = Number(item[1])
          }
        }
      }
      this.$emit('onOk', this.nNode)
    },
    cancel () {
      this.$emit('onCancel')
      // this.showModal = false
    },
  },
}
</script>

<style lang="scss">
.modal-create-node {
  width: 500px;
  max-width: 500px;
}
</style>
