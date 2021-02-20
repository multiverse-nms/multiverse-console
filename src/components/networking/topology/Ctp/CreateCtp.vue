<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new ctp"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-ctp">
      <form>
        <va-input
          v-model="nCtp.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
        />
        <va-input
          removable
          v-model="nCtp.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nCtp.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />

        <div class="d-flex justify--center">
          <va-button-toggle
            class="center"
            small
            outline
            v-model="nCtp.connType"
            :options="ctpTypes"
            color="dark"
          />
        </div>

        <div v-if="nCtp.connType === 'Ether'">
          <va-input
            v-model="etherCtp.address"
            type="text"
            label="Address"
            :error="!!etherErrors.address.length"
            :error-messages="etherErrors.address"
          />
          <va-input
            v-model="etherCtp.vlanId"
            type="number"
            label="VLAN ID"
            :error="!!etherErrors.vlan.length"
            :error-messages="etherErrors.vlan"
          />
        </div>
        <div v-if="nCtp.connType === 'IPv4'">
          <va-input
            v-model="ipv4Ctp.address"
            type="text"
            label="Address"
            :error="!!ipv4Errors.address.length"
            :error-messages="ipv4Errors.address"
          />
          <va-input
            v-model="ipv4Ctp.netmask"
            type="text"
            label="Netmask"
            :error="!!ipv4Errors.netmask.length"
            :error-messages="ipv4Errors.netmask"
          />
        </div>
        <div v-if="nCtp.connType === 'NDN'">
          <va-input
            v-model="ndnCtp.local"
            type="text"
            label="Local"
            :error="!!ndnErrors.local.length"
            :error-messages="ndnErrors.local"
          />
          <va-input
            v-model="ndnCtp.remote"
            type="text"
            label="Remote"
            :error="!!ndnErrors.remote.length"
            :error-messages="ndnErrors.local"
          />
          <va-input
            readonly
            v-model="ndnCtp.scheme"
            type="text"
            label="Scheme"
          />
          <va-input
            v-model="ndnCtp.vlanId"
            type="number"
            label="VLAN ID"
            :error="!!ndnErrors.vlan.length"
            :error-messages="ndnErrors.vlan"
          />
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
  name: 'CreateCtp',
  props: ['show', 'parentId'],

  data: function () {
    return {
      showModal: false,
      infoArray: [['', '']],

      nCtp: {
        parentId: this.parentId,
        name: '',
        label: '',
        description: '',
        info: {},
        connType: 'Ether',
        connInfo: {},
      },
      nameErrors: [],
      labelErrors: [],
      descErrors: [],

      ctpTypes: [
        { label: 'Ethernet', value: 'Ether' },
        { label: 'IPv4', value: 'IPv4' },
        { label: 'NDN', value: 'NDN' },
      ],

      etherCtp: {
        address: '',
        vlanId: 0,
        isNAtive: false,
      },
      etherErrors: {
        address: [],
        vlan: [],
      },

      ipv4Ctp: {
        address: '',
        netmask: '',
      },
      ipv4Errors: {
        address: [],
        netmask: [],
      },

      ndnCtp: {
        local: '',
        remote: '',
        scheme: 'ether',
        vlan: 0,
      },
      ndnErrors: {
        local: [],
        remote: [],
        vlan: [],
      },
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
      this.nCtp = {
        parentId: this.parentId,
        name: '',
        label: '',
        description: '',
        info: {},
        connType: 'Ether',
        connInfo: {},
      }
      this.etherCtp = {
        address: '',
        vlanId: 0,
        isNAtive: false,
      }
      this.ipv4Ctp = {
        address: '',
        netmask: '',
      }
      this.ndnCtp = {
        local: '',
        remote: '',
        scheme: 'ether',
        vlan: 0,
      }
      this.clearErrors()
      this.showModal = true
    },
    addInfoItem () {
      const lastItem = this.infoArray[this.infoArray.length - 1]
      if ((lastItem[0] !== '') && (lastItem[1] !== '')) {
        this.infoArray.push(['', ''])
      }
    },
    submit () {
      this.clearErrors()
      if (this.nCtp.name === '') {
        this.nameErrors.push('Name is required')
        return
      }
      if (this.nCtp.connType === 'Ether') {
        const macRegex = new RegExp('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
        if (!macRegex.test(this.etherCtp.address)) {
          this.etherErrors.address.push('Wrong MAC address format')
          return
        }
        this.nCtp.connInfo = this.etherCtp
      } else if (this.nCtp.connType === 'IPv4') {
        const ipv4Regex = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
        if (!ipv4Regex.test(this.ipv4Ctp.address)) {
          this.ipv4Errors.address.push('Wrong IPv4 address format')
          return
        }
        if (!ipv4Regex.test(this.ipv4Ctp.netmask)) {
          this.ipv4Errors.netmask.push('Wrong IPv4 address format')
          return
        }
        this.nCtp.connInfo = this.ipv4Ctp
      } else if (this.nCtp.connType === 'NDN') {
        const macRegex = new RegExp('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
        if (!macRegex.test(this.ndnCtp.local)) {
          this.ndnErrors.local.push('Wrong MAC address format')
          return
        }
        if (!macRegex.test(this.ndnCtp.remote)) {
          this.ndnErrors.remote.push('Wrong MAC address format')
          return
        }
        this.nCtp.connInfo = this.ndnCtp
      } else {
        return
      }
      this.$emit('onOk', this.nCtp)
    },
    cancel () {
      this.$emit('onCancel')
      this.showModal = false
    },
    clearErrors () {
      this.nameErrors = []
      this.labelErrors = []
      this.descErrors = []
      this.etherErrors = {
        address: [],
        vlan: [],
      }
      this.ipv4Errors = {
        address: [],
        netmask: [],
      }
      this.ndnErrors = {
        local: [],
        remote: [],
        vlan: [],
      }
    },
  },
}
</script>

<style lang="scss">
.modal-create-ctp {
  width: 500px;
  max-width: 500px;
}
</style>
