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
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input v-model="nLc.name"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Label</label>
          <va-input v-model="nLc.label"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Description</label>
          <va-input v-model="nLc.description"/>
        </div>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Source CTP</label>
          <va-select
            v-model="srcVctpName"
            textBy="source"
            :options="Array.from(ctpsNameToId.keys())"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Destination CTP</label>
          <va-select
            v-model="destVctpName"
            textBy="source"
            :options="Array.from(ctpsNameToId.keys())"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Info (JSON)</label>
          <va-medium-editor>
            <pre class="info">{{ infoStr.trim() }}</pre>
          </va-medium-editor>
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
import axios from 'axios'

export default {
  name: 'CreateLinkConn',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      error: '',
      infoStr: '{}',
      nLc: {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
      },
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
        }
      },
      deep: true,
    },
    srcVctpName: function (newVal, oldVal) {
      this.nLc.name = newVal + '=' + this.destVctpName
    },
    destVctpName: function (newVal, oldVal) {
      this.nLc.name = this.srcVctpName + '=' + newVal
    },
  },
  methods: {
    initCreateLc () {
      this.getCtps()
      console.log('init create linkConn modal')
      this.nLc = {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVctpId: 0,
        destVctpId: 0,
      }
      this.srcVctpName = ''
      this.destVctpName = ''
      this.error = ''
      this.showModal = true
    },
    getCtps () {
      const ctpsApi = 'https://localhost:8787/api/topology/ctps'
      axios.get(ctpsApi)
        .then(response => {
          // this.ltps = response.data
          this.ctpsNameToId = new Map()
          response.data.forEach(ctp => {
            if (!ctp.busy) {
              this.ctpsNameToId.set(ctp.name, ctp.id)
            }
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    submit () {
      const srcNode = this.srcVctpName.split(':')[0]
      const destNode = this.destVctpName.split(':')[0]
      if (srcNode === destNode) {
        this.error = 'Source and destination nodes must be different'
        return
      }
      if (this.nLc.name === '') {
        this.error = 'Name is required'
        return
      }
      const info = document.getElementsByClassName('info')[0]
      this.nLc.info = JSON.parse(info.textContent)
      this.nLc.srcVctpId = this.ctpsNameToId.get(this.srcVctpName)
      this.nLc.destVctpId = this.ctpsNameToId.get(this.destVctpName)

      console.log('nLc: ', JSON.stringify(this.nLc))
      this.$emit('onOk', this.nLc)
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
