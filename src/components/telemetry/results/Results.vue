<template>
  <div class="results">

    <div class="row row-equal">
      <div class="flex xs12">
        <va-button small color="warning" @click="refresh()" >
          Refresh
        </va-button>
      </div>
    </div>

    <div class="row row-equal">
      <div class="flex xs12">
        <va-card title="Operations">
          <OperationsTable :operations="operations" @onExpand="expandOp" @onPin="pinOp" @onDelete="deleteOp" />
        </va-card>
      </div>
    </div>

    <va-separator/>

    <div class="row row-equal">
      <div class="flex xs12">
        <va-card title="Results">
          <VisualizeMultiple v-if="multiple" ref="visMultiple" />
          <ResultsTable v-else :results="opResults" @onExpand="expandResult" />
        </va-card>
      </div>
    </div>

    <va-modal
      v-model="showResultDetails"
      size="large"
      title="Result details"
      hideDefaultActions
    >
      <pre>
        {{ JSON.stringify(resultDetails, null, 4) }}
      </pre>

      <div class="d-flex justify--center mt-3">
        <va-button small color="danger" @click="showResultDetails = false">Close</va-button>
      </div>
    </va-modal>

  </div>
</template>

<script>
import axios from 'axios'
import OperationsTable from './OperationsTable'
import ResultsTable from './ResultsTable'
import VisualizeMultiple from './VisualizeMultiple'

export default {
  name: 'results',
  components: {
    OperationsTable,
    ResultsTable,
    VisualizeMultiple,
  },
  data () {
    return {
      operations: [],

      opResults: [],
      selectedOp: '',

      multiple: false,

      resultDetails: {},
      showResultDetails: false,
    }
  },
  computed: {
  },
  created () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.showResultDetails = false
      this.getOperations()
      if (this.selectedOp !== '') {
        this.getResultsByOp(this.selectedOp)
      }
    },
    getOperations () {
      this.operations = []
      const uri = this.$apiURI + '/telemetry/operations/measure'
      axios.get(uri)
        .then(response => {
          this.operations = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },
    expandOp (id) {
      this.multiple = false
      this.selectedOp = id
      this.getResultsByOp(id)
    },
    pinOp (id) {
      this.multiple = true
      this.selectedOp = id
      this.getResultsByOp(id)
    },
    deleteOp (id) {
      const uri = this.$apiURI + '/telemetry/operation/' + id
      axios.delete(uri)
        .then(response => {
          this.refresh()
        })
        .catch(e => {
          // console.log(e)
        })
    },

    getResultsByOp (id) {
      this.opResults = []
      const uri = this.$apiURI + '/telemetry/operation/' + id + '/results'
      axios.get(uri)
        .then(response => {
          if (this.multiple) {
            this.$refs.visMultiple.addResult(response.data)
          } else {
            this.opResults = response.data
          }
        })
        .catch(e => {
          // console.log(e)
        })
    },

    expandResult (id) {
      this.resultDetails = {}
      const uri = this.$apiURI + '/telemetry/result/' + id
      axios.get(uri)
        .then(response => {
          this.resultDetails = response.data
          this.showResultDetails = true
        })
        .catch(e => {
          // console.log(e)
        })
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

  .results {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
