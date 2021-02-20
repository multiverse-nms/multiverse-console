<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create connection"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-conn">
      <form>
        <va-select v-if="!type"
          v-model="connType"
          label="Type"
          textBy="link"
          :options="Array.from(connTypes)"
        />
        <va-input
          v-model="nConn.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
        />
        <va-input
          removable
          v-model="nConn.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nConn.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />
        <va-select
          label="Source CTP"
          v-model="srcVctpName"
          textBy="source"
          :options="Array.from(ctpsNameToId.keys())"
          :error="!!ctpErrors.length"
          :error-messages="ctpErrors"
        />
        <va-select
          label="Destination CTP"
          v-model="destVctpName"
          textBy="destination"
          :options="Array.from(ctpsNameToId.keys())"
          :error="!!ctpErrors.length"
          :error-messages="ctpErrors"
        />
        <div class="d-flex justify--center mt-3">
          <va-button small color="danger" @click="cancel">Cancel</va-button>
          <va-button small color="primary" @click="submit">Submit</va-button>
        </div>
      </form>
    </div>
  </va-modal>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateConn',
  props: ['show', 'type'],

  data: function () {
    return {
      showModal: false,

      infoArray: [['', '']],

      connType: '',
      connTypes: ['NDN', 'IPv4'],

      nConn: {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
        status: 'DOWN',
      },

      nameErrors: [],
      labelErrors: [],
      descErrors: [],
      ctpErrors: [],

      srcVctpName: '',
      destVctpName: '',
      ctpsNameToId: new Map(),
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateConn()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
    srcVctpName: function (newVal, oldVal) {
      this.nConn.name = newVal.split(' ')[0] + '#' + this.destVctpName.split(' ')[0]
    },
    destVctpName: function (newVal, oldVal) {
      this.nConn.name = this.srcVctpName.split(' ')[0] + '#' + newVal.split(' ')[0]
    },
    connType: function (newVal, oldVal) {
      this.getCtps(newVal)
    },
  },
  methods: {
    initCreateConn () {
      this.nameErrors = []
      this.labelErrors = []
      this.descErrors = []

      this.nConn = {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
        status: 'DOWN',
      }

      this.infoArray = [['', '']]
      this.srcVctpName = ''
      this.destVctpName = ''
      this.ctpErrors = []

      if (this.type) {
        console.log('type given: ' + this.type)
        this.getCtps(this.type)
      }

      this.showModal = true
    },
    getCtps (type) {
      console.log('get CTPs: ' + type)
      const ctpsApi = this.$apiURI + '/topology/ctp/type/' + type
      axios.get(ctpsApi)
        .then(response => {
          this.ctpsNameToId = new Map()
          response.data.forEach(ctp => {
            this.ctpsNameToId.set(ctp.name + ' [' + ctp.vnodeId + ']', ctp.id, ctp.id)
          })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    addInfoItem () {
      const lastItem = this.infoArray[this.infoArray.length - 1]
      if ((lastItem[0] !== '') && (lastItem[1] !== '')) {
        this.infoArray.push(['', ''])
      }
    },
    submit () {
      /* const srcNode = this.srcVctpName.split(':')[1]
      const destNode = this.destVctpName.split(':')[1]
      if (srcNode === destNode) {
        this.error = 'Source and destination nodes must be different'
        return
      } */
      if (this.nConn.name === '') {
        this.error = 'Name is required'
        return
      }
      this.nConn.srcVctpId = this.ctpsNameToId.get(this.srcVctpName)
      this.nConn.destVctpId = this.ctpsNameToId.get(this.destVctpName)

      for (var i = 0, len = this.infoArray.length; i < len; i++) {
        const item = this.infoArray[i]
        if (item[0] !== '' && item[1] !== '') {
          // TODO: support boolean
          if (isNaN(item[1])) {
            this.nConn.info[item[0]] = item[1]
          } else {
            this.nConn.info[item[0]] = Number(item[1])
          }
        }
      }
      this.$emit('onOk', this.nConn)
    },
    cancel () {
      this.$emit('onCancel')
      // this.showModal = false
    },
  },
}
</script>

<style lang="scss">
.modal-create-conn {
  width: 500px;
  max-width: 500px;
}
</style>
