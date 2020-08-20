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
      <form>
        <va-input
          readonly
          v-model="nLtp.name"
          type="text"
          label="Name"
        />
        <va-input
          removable
          v-model="nLtp.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nLtp.description"
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
  name: 'CreateLtp',
  props: ['show', 'nodeId', 'name'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],
      nLtp: {
        vnodeId: this.nodeId,
        name: '',
        label: '',
        description: '',
        info: {},
        busy: false,
      },
      error: '',
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
          this.initCreateLtp()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
  },
  methods: {
    initCreateLtp () {
      this.nLtp = {
        vnodeId: this.nodeId,
        name: this.name,
        label: '',
        description: '',
        info: {},
        busy: false,
      }
      this.infoArray = [['port', '']]

      this.error = ''
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
      const macRegex = new RegExp('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
      const portValue = this.infoArray.find(x => x[0] === 'port')[1]
      if (!macRegex.test(portValue)) {
        this.error = 'MAC address format port is required'
        return
      }
      for (var i = 0, len = this.infoArray.length; i < len; i++) {
        const item = this.infoArray[i]
        if (item[0] !== '' && item[1] !== '') {
          // TODO: support boolean
          if (isNaN(item[1])) {
            this.nLtp.info[item[0]] = item[1]
          } else {
            this.nLtp.info[item[0]] = Number(item[1])
          }
        }
      }
      this.$emit('onOk', this.nLtp)
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
