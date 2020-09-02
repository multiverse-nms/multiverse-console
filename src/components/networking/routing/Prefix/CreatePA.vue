<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Announce new prefix"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-pa">
      <form>
        <va-select v-if="selectOrigin"
          label="Origin"
          v-model="originName"
          textBy="origin"
          :options="Array.from(nodesNameToId.keys())"
          :error="!!originErrors.length"
          :error-messages="originErrors"
        />
        <va-input
          removable
          v-model="nPA.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
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
import { Encoder } from '@ndn/tlv'
import { Name } from '@ndn/packet'

export default {
  name: 'CreatePA',
  props: ['show', 'subnetId', 'originId'],

  data: function () {
    return {
      showModal: false,
      nPA: {
        name: '/',
        originId: 0,
        available: true,
      },
      nodesNameToId: new Map(),
      originName: '',
      selectOrigin: false,

      nameErrors: [],
      originErrors: [],
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initModal()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
  },
  methods: {
    initModal () {
      if (this.originId > 0) {
        this.nPA.originId = this.originId
        this.selectOrigin = false
      } else {
        this.getNodes()
        this.nPA.originId = 0
        this.selectOrigin = true
      }
      this.nPA.name = '/'
      this.originName = ''

      this.nameErrors = []
      this.originErrors = []

      this.showModal = true
    },
    submit () {
      if (this.nPA.name === '' || this.nPA.name === '/') {
        this.nameErrors = ['Name is required']
        return
      }
      const encoder = new Encoder()
      encoder.encode(new Name(this.nPA.name))
      const b64 = btoa(String.fromCharCode.apply(null, encoder.output))
      this.nPA.name = b64

      if (this.nPA.originId === 0) {
        if (this.originName === '') {
          this.originErrors = ['Origin is required']
          return
        }
        this.nPA.originId = this.nodesNameToId.get(this.originName)
      }
      this.$emit('onOk', this.nPA)
    },
    cancel () {
      this.$emit('onCancel')
      // this.showModal = false
    },
    getNodes () {
      let nodesApi = this.$apiURI + '/topology'
      if (this.subnetId !== 0) {
        nodesApi += '/subnet/' + this.subnetId.toString()
      }
      nodesApi += '/nodes'
      axios.get(nodesApi)
        .then(response => {
          this.nodesNameToId = new Map()
          response.data.forEach(node => {
            this.nodesNameToId.set(node.name.split(':')[1], node.id)
          })
        })
        .catch(e => {
          // console.log(e)
        })
    },
  },
}
</script>

<style lang="scss">
.modal-create-pa {
  width: 500px;
  max-width: 500px;
}
</style>
