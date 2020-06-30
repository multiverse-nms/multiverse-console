<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new xc"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-xc">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">NodeId</label>
          <va-input disabled v-model="nXc.vnodeId"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Trail</label>
          <va-select
            v-model="trailName"
            textBy="source"
            :options="Array.from(trailsNameToId.keys())"
          />
        </div>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input v-model="nXc.name"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Label</label>
          <va-input v-model="nXc.label"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Description</label>
          <va-input v-model="nXc.description"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Type</label>
          <va-input v-model="nXc.type"/>
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
          <label class="label">Drop CTP</label>
          <va-select
            v-model="dropVctpName"
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
          <va-button small color="danger" @click="cancel"> Cancel </va-button>
          <va-button small @click="submit"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateXc',
  props: ['show', 'nodeId', 'nodeName'],

  data: function () {
    return {
      showModal: false,
      error: '',
      infoStr: '{}',
      nXc: {
        vnodeId: this.nodeId,
        vtrailId: 0,
        name: this.nodeName + '#',
        label: '',
        description: '',
        info: {},
        type: '',
        srcVctpId: 0,
        destVctpId: 0,
        dropVctpId: 0,
      },
      trailName: '',
      srcVctpName: '',
      destVctpName: '',
      dropVctpName: '',
      ctpsNameToId: new Map(),
      trailsNameToId: new Map(),
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initModal()
        }
      },
      deep: true,
    },
    /* 'srcVctpName': function (newVal, oldVal) {
      this.nLc.name = newVal + '#' + this.destVctpName
    },
    'destVctpName': function (newVal, oldVal) {
      this.nLc.name = this.srcVctpName + '#' + newVal
    }, */
  },
  methods: {
    initModal () {
      this.getCtpsByNode()
      this.getTrails()
      console.log('init create ctp modal')
      this.nXc = {
        vnodeId: this.nodeId,
        vtrailId: 0,
        name: this.nodeName + 'x',
        label: '',
        description: '',
        info: {},
        type: '',
        srcVctpId: 0,
        destVctpId: 0,
        dropVctpId: 0,
      }
      this.error = ''
      this.showModal = true
    },
    getCtpsByNode () {
      const ctpsApi = 'https://localhost:8787/api/topology/node/' + this.nodeId.toString() + '/ctps'
      axios.get(ctpsApi)
        .then(response => {
          this.ctpsNameToId = new Map()
          response.data.forEach(ctp => {
            this.ctpsNameToId.set(ctp.name, ctp.id)
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    getTrails () {
      const trailsApi = 'https://localhost:8787/api/topology/trails'
      axios.get(trailsApi)
        .then(response => {
          this.trailsNameToId = new Map()
          response.data.forEach(tr => {
            this.trailsNameToId.set(tr.name, tr.id)
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    submit () {
      const info = document.getElementsByClassName('info')[0]
      this.nXc.info = JSON.parse(info.textContent)
      this.nXc.srcVctpId = this.ctpsNameToId.get(this.srcVctpName)
      this.nXc.destVctpId = this.ctpsNameToId.get(this.destVctpName)
      this.nXc.dropVctpId = this.ctpsNameToId.get(this.dropVctpName)
      this.nXc.vtrailId = this.trailsNameToId.get(this.trailName)
      console.log('nXc: ', JSON.stringify(this.nXc))
      if (this.nXc.name === '') {
        this.error = 'Name is required'
        return
      }
      this.$emit('onOk', this.nXc)
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
.modal-create-xc {
  width: 500px;
  max-width: 500px;
}
</style>
