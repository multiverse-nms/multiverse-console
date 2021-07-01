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
      <form>
        <va-input
          v-model="nSubnet.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
        />
        <va-input
          removable
          v-model="nSubnet.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nSubnet.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
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
  name: 'CreateSubnet',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],
      nSubnet: {
        name: '',
        label: '',
        description: '',
        info: {},
      },
      nameErrors: [],
      labelErrors: [],
      descErrors: [],
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateModal()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
  },
  methods: {
    initCreateModal () {
      this.nSubnet = {
        name: '',
        label: '',
        description: '',
        info: {},
      }
      this.infoArray = [['', '']]

      this.nameErrors = []
      this.labelErrors = []
      this.descErrors = []

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
            this.nSubnet.info[item[0]] = item[1]
          } else {
            this.nSubnet.info[item[0]] = Number(item[1])
          }
        }
      }
      this.$emit('onOk', this.nSubnet)
    },
    cancel () {
      this.$emit('onCancel')
      // this.showModal = false
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
