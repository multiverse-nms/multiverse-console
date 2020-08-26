
<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Result stream-live"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div>
      <va-badge v-if="receipt.schema" color="info">
        ID: {{ receipt.schema }}
      </va-badge>
      <va-badge v-if="receipt.agentId" color="warning">
        Agent: {{ receipt.agentId }}
      </va-badge>
      <va-badge v-if="receipt.name" color="danger">
        Type: {{ receipt.name }}
      </va-badge>
      <va-badge v-if="receipt.timestamp" color="dark">
        Timestamp: {{ receipt.timestamp }}
      </va-badge>
    </div>

    <div class="row row-equal">
      <div class="flex xs12">
        <ResultsTable :results="opResults" :graphOnly="true" />
      </div>
    </div>

    <div class="d-flex justify--center mt-3">
      <va-button small color="danger" @click="close">Close</va-button>
    </div>

  </va-modal>
</template>

<script>
import axios from 'axios'
import ResultsTable from './ResultsTable'

export default {
  name: 'live-results',
  props: ['receipt'],
  components: {
    ResultsTable,
  },
  data () {
    return {
      opResults: [],
      showModal: false,
      results: [],
      timerId: 0,
    }
  },
  computed: {
  },
  created () {
  },
  watch: {
    receipt: {
      handler: function () {
        if (this.receipt.schema) {
          this.startLive()
        }
      },
      deep: true,
    },
  },
  methods: {
    startLive () {
      if (this.timerId !== 0) {
        clearInterval(this.timerId)
      }
      const context = this
      this.timerId = setInterval(function () {
        context.getResultsByOp(context.receipt.schema)
      }, 5000)
      this.showModal = true
    },

    getResultsByOp (id) {
      const uri = 'https://localhost:8787/api/telemetry/operation/' + id + '/results'
      axios.get(uri)
        .then(response => {
          this.opResults = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },

    close () {
      if (this.timerId !== 0) {
        clearInterval(this.timerId)
      }
      this.results = []
      this.showModal = false
    },
  },
  /* eventbus: {
    lifecycleHooks: {
      created (context, eventbus) {
        eventbus.registerHandler('nms.info.dss', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const infoMsg = msg.body
          if (infoMsg.service === 'nms.dss') {
            const result = infoMsg.content
            if (result.schema === context.receipt.schema) {
              const resultLabel = (result.results[context.trackedResultIndex]).split('.')

              if (resultLabel[1]) {
                context.chart = 1
                const label = resultLabel[0]
                const unit = resultLabel[1]
                context.labels.push(result.timestamp.split('.')[0])
                context.data.push(Number(result.resultValues[0][context.trackedResultIndex]))
                context.label = label + ' ' + context.getUnitLabel(unit)
              } else {
                context.chart = 2
                context.label = resultLabel[0] + ': ' + result.resultValues[0][context.trackedResultIndex]
              }
            }
          }
        })
      },
    },
  }, */
}
</script>
<style scoped lang="scss">
</style>
