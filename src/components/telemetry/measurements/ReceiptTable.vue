<template>
  <div>

    <div v-if="receipts.length == 0" class="text-center mt-5">
      <va-chip color="gray">No active measurement to show</va-chip>
    </div>

    <table v-if="receipts.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th v-for="(col, index) in headers" :key="index">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rct in receipts" :key="rct.schema">
          <td> {{ rct.schema.slice(0,10) }} </td>
          <td> {{ rct.name }} </td>
          <td> {{ rct.agentId }} </td>
          <td> {{ rct.timestamp }} </td>
          <td>
            <va-badge :color="getStatusColor(rct.when)">
              {{ getStatus(rct.when) }}
            </va-badge>
          </td>
          <td>
            <va-button small v-if="rct.receipt === 'measure' && getStatus(rct.when) === 'in progress'" color="success" @click="onStreamLive(rct)" > Stream live </va-button>
            <va-button small color="danger" @click="onStop(rct)" > Stop </va-button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'receipt-table',
  props: ['receipts', 'onStop', 'onStreamLive'],
  data () {
    return {
      headers: ['Schema', 'Type', 'Agent', 'Start time', 'Status', 'Action'],
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getStatus (when) {
      const range = (when.split(' / ')[0]).split(' ... ')
      const start = range[0]
      const stop = range[1]

      const dtNow = new Date()

      const dtStop = new Date(Number(stop))
      console.log('stop', dtStop)

      if (start === 'now') {
        if (dtNow < dtStop) {
          return 'in progress'
        } else {
          return 'completed'
        }
      }
      const dtStart = new Date(Number(start))
      console.log('start', dtStart)
      if (dtNow < dtStart) {
        return 'scheduled'
      } else if (dtNow < dtStop) {
        return 'in progress'
      } else {
        return 'completed'
      }
    },
    getStatusColor (when) {
      const status = this.getStatus(when)
      if (status === 'in progress') {
        return 'info'
      } else if (status === 'completed') {
        return 'primary'
      }
      return 'gray'
    },
  },
}
</script>

<style lang="scss">
  .markup-tables {
    .va-table {
      width: 100%;
    }

    .va-card {
      max-width: 1200px;
    }
  }
</style>
