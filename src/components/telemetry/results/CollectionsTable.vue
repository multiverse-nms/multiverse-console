<template>
  <div>

    <div v-if="results.length == 0" class="text-center mt-5">
      <va-chip color="gray">No results to show</va-chip>
    </div>

    <div v-else>
      <table class="va-table va-table--hoverable table-max">
        <thead>
          <tr>
            <th v-for="(header, index) in table.resultColumns" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(values, index) in table.resultValues" :key="index">
            <td v-for="(rowValue, index) in values" :key="index">
              {{ rowValue }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'collections-table',
  props: ['results'],
  components: {
  },
  data () {
    return {
      colors: ['primary', 'secondary', 'danger', 'warning', 'dark'],

      table: {
        resultColumns: [],
        resultValues: [],
      },
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {
    results: {
      handler: function () {
        if (this.results.length) {
          this.processResults()
        } else {
          this.resetData()
        }
      },
      deep: true,
    },
  },
  methods: {
    processResults () {
      const latest = this.results[this.results.length - 1]
      this.table.resultColumns = latest.results
      this.table.resultValues = latest.resultValues
    },
    resetData () {
      this.table.resultColumns = []
      this.table.resultValues = []
    },
  },
}
</script>

<style lang="scss">
.chartt {
  display: inline-block;
  width: 100%;
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
