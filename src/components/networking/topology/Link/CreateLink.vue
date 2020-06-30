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
          <va-input v-model="nLink.name"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Label</label>
          <va-input v-model="nLink.label"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Description</label>
          <va-input v-model="nLink.description"/>
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Source LTP</label>
          <va-select
            v-model="srcVltpName"
            textBy="source"
            :options="Array.from(ltpsNameToId.keys())"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex xs12">
          <label class="label">Destination LTP</label>
          <va-select
            v-model="destVltpName"
            textBy="source"
            :options="Array.from(ltpsNameToId.keys())"
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
          <va-button  small @click="submit"> Submit </va-button>
        </div>
      </div>
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
      error: '',
      infoStr: '{}',
      nLink: {
        name: '',
        label: '',
        description: '',
        info: {},
        srcVltpId: 0,
        destVltpId: 0,
        type: 'IN',
      },
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
        type: 'IN',
      }
      this.srcVltpName = ''
      this.destVltpName = ''
      this.error = ''
      this.showModal = true
    },
    getLtps () {
      const ltpsApi = 'https://localhost:8787/api/topology/ltps'
      axios.get(ltpsApi)
        .then(response => {
          // this.ltps = response.data
          this.ltpsNameToId = new Map()
          response.data.forEach(ltp => {
            if (!ltp.busy) {
              this.ltpsNameToId.set(ltp.name, ltp.id)
            }
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    submit () {
      const srcNode = this.srcVltpName.split(':')[0]
      const destNode = this.destVltpName.split(':')[0]
      if (srcNode === destNode) {
        this.error = 'Source and destination nodes must be different'
        return
      }
      if (this.nLink.name === '') {
        this.error = 'Name is required'
        return
      }
      const info = document.getElementsByClassName('info')[0]
      this.nLink.info = JSON.parse(info.textContent)
      this.nLink.srcVltpId = this.ltpsNameToId.get(this.srcVltpName)
      this.nLink.destVltpId = this.ltpsNameToId.get(this.destVltpName)

      console.log('nLink: ', JSON.stringify(this.nLink))
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
