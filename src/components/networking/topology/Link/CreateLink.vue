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
      <form>
        <va-input
          v-model="nLink.name"
          type="text"
          label="Name"
        />
        <va-input
          removable
          v-model="nLink.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nLink.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />
        <va-select
          label="Source LTP"
          v-model="srcVltpName"
          textBy="source"
          :options="Array.from(ltpsNameToId.keys())"
          :error="!!ltpErrors.length"
          :error-messages="ltpErrors"
        />
        <va-select
          label="Destination LTP"
          v-model="destVltpName"
          textBy="destination"
          :options="Array.from(ltpsNameToId.keys())"
          :error="!!ltpErrors.length"
          :error-messages="ltpErrors"
        />
        <!-- div>
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
        </div -->
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
  name: 'CreateLink',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],
      nLink: {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVltpId: 0,
        destVltpId: 0,
      },

      labelErrors: [],
      descErrors: [],
      ltpErrors: [],

      srcVltpName: '',
      destVltpName: '',
      ltpsNameToId: new Map(),
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateLink()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
    srcVltpName: function (newVal, oldVal) {
      this.nLink.name = newVal + '=' + this.destVltpName
    },
    destVltpName: function (newVal, oldVal) {
      this.nLink.name = this.srcVltpName + '=' + newVal
    },
  },
  methods: {
    initCreateLink () {
      this.getLtps()
      this.nLink = {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVltpId: 0,
        destVltpId: 0,
      }
      this.infoArray = [['', '']]
      this.srcVltpName = ''
      this.destVltpName = ''

      this.labelErrors = []
      this.descErrors = []
      this.ltpErrors = []

      this.showModal = true
    },
    getLtps () {
      const ltpsApi = this.$apiURI + '/topology/ltp'
      axios.get(ltpsApi)
        .then(response => {
          this.ltpsNameToId = new Map()
          response.data.forEach(ltp => {
            if (!ltp.busy) {
              this.ltpsNameToId.set(ltp.name, ltp.id)
            }
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
      /* const srcNode = this.srcVltpName.split(':')[1]
      const destNode = this.destVltpName.split(':')[1]
      if (srcNode === destNode) {
        this.ltpErrors = ['Source and destination nodes must be different']
        return
      } */
      this.nLink.srcVltpId = this.ltpsNameToId.get(this.srcVltpName)
      this.nLink.destVltpId = this.ltpsNameToId.get(this.destVltpName)
      for (var i = 0, len = this.infoArray.length; i < len; i++) {
        const item = this.infoArray[i]
        if (item[0] !== '' && item[1] !== '') {
          // TODO: support boolean
          if (isNaN(item[1])) {
            this.nLink.info[item[0]] = item[1]
          } else {
            this.nLink.info[item[0]] = Number(item[1])
          }
        }
      }
      this.$emit('onOk', this.nLink)
    },
    cancel () {
      this.$emit('onCancel')
      // this.showModal = false
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
