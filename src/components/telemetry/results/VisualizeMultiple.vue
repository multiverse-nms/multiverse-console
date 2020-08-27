<template>
  <div>

    <div v-if="graphs.length == 0" class="text-center mt-5">
      <va-chip color="gray">No results to show</va-chip>
    </div>

    <div v-else v-for="(graph, index) in graphs" :key="index" class="chart-lines">
      <div>
        <span class="display-6"> [{{ operationInfo[index].name }}] from {{operationInfo[index].agent}} </span>
        <va-button small color="danger" v-on:click="unpin(index)" >
          Unpin
        </va-button>
      </div>
      <va-chart :data="graph" type="line" class="chartt"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'visualize-multiple',
  components: {
  },
  data () {
    return {
      graphs: [],
      operationInfo: [],
      colors: ['primary', 'secondary', 'danger', 'warning', 'dark'],
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    addResult (nResult) {
      const operationData = []
      const operationLabels = []
      let plottable = false

      for (var i = 0; i < nResult.length; i++) {
        operationLabels.push(nResult[i].timestamp.split('.')[0])
      }
      for (i = 0; i < nResult[0].results.length; i++) {
        const resultLabel = (nResult[0].results[i]).split('.')
        if (resultLabel[1]) {
          plottable = true
          const oneResultData = []
          const oneResultLabel = resultLabel[0] + ' ' + this.getUnitLabel(resultLabel[1])
          for (var j = 0; j < nResult.length; j++) {
            oneResultData.push(Number(nResult[j].resultValues[0][i]))
          }
          const oneResultPlot = {
            label: oneResultLabel,
            backgroundColor: 'transparent',
            borderColor: this.colors[i],
            data: oneResultData,
          }
          operationData.push(oneResultPlot)
        }
      }
      if (plottable) {
        const operationGraph = {
          labels: operationLabels,
          datasets: operationData,
        }
        this.operationInfo.push({ id: nResult[0].schema, name: nResult[0].name, agent: nResult[0].agentId })
        this.graphs.push(operationGraph)
      }
    },
    removeResult (id) {
      let index = -1
      for (var i = 0; i < this.operationInfo.length; i++) {
        if (this.operationInfo[i].id === id) {
          index = i
          break
        }
      }
      if (i >= 0) {
        this.graphs.splice(index, 1)
        this.operationInfo.splice(index, 1)
      }
    },
    unpin (index) {
      this.graphs.splice(index, 1)
      this.operationInfo.splice(index, 1)
    },
    getUnitLabel (unit) {
      switch (unit) {
        case 'n':
          return '(#)'
        case 'pc':
          return '(%)'
        case 'b':
          return '(Bytes)'
        default:
          return ''
      }
    },
  },
}
</script>

<style lang="scss">
.chartt {
  padding: 1px;
}

.chartt > canvas {
  position: relative;
}

.chart-lines {
  display: inline-block;
  width: 100%;
  height: 300px;
}

.chart-gird {
  display: inline-block;
  width: 58%;
  height: 300px;
}

.grid {
  &__container {
    min-height: 3rem;
    color: $white;
    border-radius: 0.5rem;
  }
}
</style>
