<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new linkConn"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-link">
      <form>
        <va-select v-if="selectLink"
          v-model="selectedLinkName"
          label="Link"
          textBy="link"
          :options="Array.from(linksNameToId.keys())"
        />
        <va-input
          v-model="nLc.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
        />
        <va-input
          removable
          v-model="nLc.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nLc.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />
        <div v-if="ctpsNameToId.size > 1">
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
        </div>
        <p v-else> Not enough CTPs to create a Link-connection </p>
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
  name: 'CreateLinkConn',
  props: ['show', 'linkId'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],
      nLc: {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
        vlinkId: 0,
        status: 'DOWN',
      },
      selectedLinkName: '',
      selectLink: false,
      linksNameToId: new Map(),

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
          this.initCreateLc()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
    selectedLinkName: function (newVal, oldVal) {
      this.nLc.vlinkId = this.linksNameToId.get(newVal)
      this.getCtps()
    },
  },
  methods: {
    initCreateLc () {
      this.nameErrors = []
      this.labelErrors = []
      this.descErrors = []

      this.nLc = {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
        vlinkId: this.linkId,
        status: 'DOWN',
      }
      this.infoArray = [['', '']]
      this.srcVctpName = ''
      this.destVctpName = ''
      this.ctpErrors = []

      if (this.linkId > 0) {
        this.getCtps()
        this.selectLink = false
      } else {
        this.getLinks()
        this.selectLink = true
      }

      this.showModal = true
    },
    addInfoItem () {
      const lastItem = this.infoArray[this.infoArray.length - 1]
      if ((lastItem[0] !== '') && (lastItem[1] !== '')) {
        this.infoArray.push(['', ''])
      }
    },
    setNextLcName () {
      /* const lcsApi = this.$apiURI + '/topology/link/' + linkId + '/lcs'
      axios.get(lcsApi)
        .then(response => {
          const lcs = response.data
          if (lcs.length > 0) {
            const maxLcNo = lcs[lcs.length - 1].name.split('|')[1].substring(1)
            this.nLc.name = linkName + '|c' + (parseInt(maxLcNo, 10) + 1)
            this.nameErrors = ['Only ONE linkConnection is supported per link']
          } else {
            this.nLc.name = linkName + '|c0'
          }
        })
        .catch(e => {
          this.nLc.name = 'undefined'
          // console.log(e)
        }) */
      this.nLc.name = ''
    },
    getLinks () {
      const linksApi = this.$apiURI + '/topology/link'
      axios.get(linksApi)
        .then(response => {
          this.linksNameToId = new Map()
          response.data.forEach(link => {
            this.linksNameToId.set(link.name, link.id)
          })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    getCtps () {
      const linkApi = this.$apiURI + '/topology/link/' + this.nLc.vlinkId
      const ctpsApi = this.$apiURI + '/topology/ctp/type/Ether'
      axios.get(linkApi)
        .then(response => {
          const link = response.data
          this.nLc.name = link.name + '#'
          axios.get(ctpsApi)
            .then(response => {
              this.ctpsNameToId = new Map()
              response.data.forEach(ctp => {
                if (ctp.parentId === link.srcVltpId || ctp.parentId === link.destVltpId) {
                  this.ctpsNameToId.set(ctp.name + ' [' + ctp.vnodeId + ']', ctp.id, ctp.id)
                }
              })
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    submit () {
      if (this.nameErrors.length) {
        return
      }
      if (this.ctpsNameToId.size < 2 || this.nLc.vlinkId === 0) {
        return
      }
      this.nLc.srcVctpId = this.ctpsNameToId.get(this.srcVctpName)
      this.nLc.destVctpId = this.ctpsNameToId.get(this.destVctpName)

      /* for (var i = 0, len = this.infoArray.length; i < len; i++) {
        const item = this.infoArray[i]
        if (item[0] !== '' && item[1] !== '') {
          // TODO: support boolean
          if (isNaN(item[1])) {
            this.nLc.info[item[0]] = item[1]
          } else {
            this.nLc.info[item[0]] = Number(item[1])
          }
        }
      } */
      this.$emit('onOk', this.nLc)
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
