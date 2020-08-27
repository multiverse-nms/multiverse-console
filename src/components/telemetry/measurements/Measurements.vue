<template>
  <div class="console">
    <div class="row">
      <div class="flex md12 column">
        <va-card title="Available Capabilities">
          <CapabilityTable :capabilities="capabilities" :onSendSpec="initCreateSpecification" />
        </va-card>
      </div>
    </div>

    <div class="row">
      <div class="flex md12 column">
        <va-card title="Active measurements">
          <ReceiptTable :receipts="receipts" :onStop="sendInterrupt" :onStreamLive="streamLive" />
        </va-card>
      </div>
    </div>

    <LiveResults :receipt="liveSpec" />

    <CreateSpecification @onOk="postSpecification" @onCancel="showCreateSpec = false" :show="showCreateSpec" :capability="selectedCap" />

  </div>
</template>

<script>
import axios from 'axios'
import CapabilityTable from './CapabilityTable'
import CreateSpecification from './CreateSpecification'
import ReceiptTable from './ReceiptTable'
import LiveResults from '../results/LiveResults'

export default {
  name: 'measurements',
  components: {
    CapabilityTable,
    CreateSpecification,
    ReceiptTable,
    LiveResults,
  },
  data () {
    return {
      capabilities: [],
      receipts: [],

      selectedCap: {},
      showCreateSpec: false,

      liveSpec: {},
    }
  },
  created () {
    this.refreshAll()
  },
  methods: {
    refreshAll () {
      this.getReceipts()
        .then(r => this.getCapabilities())
    },
    getCapabilities () {
      const context = this
      return new Promise(function (resolve, reject) {
        const uri = context.$apiURI + '/telemetry/capabilities'
        axios.get(uri)
          .then(response => {
            const caps = response.data
            const capabilities = []
            for (var i = 0, len = caps.length; i < len; i++) {
              let lStatus = 'inactive'
              if (context.receipts.find(x => x.schema === caps[i].schema)) {
                lStatus = 'active'
              }
              const capability = { content: caps[i], status: lStatus }
              capabilities.push(capability)
            }
            context.capabilities = capabilities
            resolve()
          })
          .catch(e => {
            // console.log(e)
            reject(e)
          })
      })
    },
    getReceipts () {
      const context = this
      return new Promise(function (resolve, reject) {
        const uri = context.$apiURI + '/telemetry/receipts'
        axios.get(uri)
          .then(response => {
            context.receipts = response.data
            resolve()
          })
          .catch(e => {
            // console.log(e)
            reject(e)
          })
      })
    },

    initCreateSpecification (cap) {
      this.selectedCap = cap
      this.showCreateSpec = true
    },
    postSpecification (specification) {
      axios.post(this.$apiURI + '/telemetry/specification', specification, {
        headers: {},
      })
        .then(response => {
          this.showToast('Specification published', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.refreshAll()
        })
        .catch(e => {
          // console.log(e)
          if (e.response.status === 400) {
            this.showToast('Failed: ' + e.response.data.message, {
              icon: 'fa-close',
              position: 'top-right',
              duration: 3000,
            })
          }
        })
      this.selectedCap = {}
      this.showCreateSpec = false
    },

    sendInterrupt (receipt) {
      const interrupt = receipt
      interrupt.interrupt = receipt.receipt
      delete interrupt.receipt
      axios.post(this.$apiURI + '/telemetry/interrupt', interrupt, {
        headers: {},
      })
        .then(response => {
          this.showToast('Measurement stopped', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.refreshAll()
        })
        .catch(e => {
          // console.log(e)
        })
    },

    streamLive (rct) {
      this.liveSpec = rct
    },
  },
  eventbus: {
    lifecycleHooks: {
      created (context, eventbus) {
        // subscribe to topology service info
        eventbus.registerHandler('nms.to.ui', function (err, msg) {
          if (err) {
            // console.log('VertxEventBus error: ', err)
            return
          }
          if (msg.body.service === 'service.telemetry') {
            context.refreshAll()
          }
        })
      },
    },
  },
}
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }

  .console {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
