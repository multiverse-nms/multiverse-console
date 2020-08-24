<template>
  <div class="notifications">
    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card title="Events">
          <div v-if="events.length === 0" class="text-center mt-5">
            <va-chip color="gray">No Events to show</va-chip>
          </div>
          <table v-if="events.length > 0" class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Origin</th>
                <th>Code</th>
                <th>Timestamp</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, index) in events" :key="index">
                <td>
                  <va-icon name="fa fa-exclamation-circle" :color="getEventColor(event.severity)" size="30px"></va-icon>
                </td>
                <td>{{ findNodeName(event.origin) }}</td>
                <td>{{ event.code }}</td>
                <td>{{ event.timestamp }}</td>
                <td>{{ event.msg }}</td>
                <td>
                  <va-button small @click="deleteEvent(event.id)" color="warning" > Ignore </va-button>
                </td>
              </tr>
            </tbody>
          </table>
        </va-card>
      </div>

      <div class="flex xs12 lg6">
        <va-card title="Faults">
          <div v-if="faults.length === 0" class="text-center mt-5">
            <va-chip color="gray">No Events to show</va-chip>
          </div>
          <table v-if="faults.length > 0" class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Origin</th>
                <th>Code</th>
                <th>Timestamp</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fault, index) in faults" :key="index">
                <td>
                  <va-icon name="fa fa-exclamation-circle" color="danger" size="30px"></va-icon>
                </td>
                <td>{{ findNodeName(fault.origin) }}</td>
                <td>{{ fault.code }}</td>
                <td>{{ fault.timestamp }}</td>
                <td>{{ fault.msg }}</td>
                <td>
                  <va-button small @click="deleteFault(fault.id)" color="warning" > Ignore </va-button>
                  <va-button small @click="deleteFault(fault.id)" color="info" > Acknowledge </va-button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- va-notification v-for="(fault, index) in faults" :key="index" color="danger" closeable @input="deleteFault(fault.id)">
            <va-badge color="danger">
              {{ findNodeName(fault.origin) }}
            </va-badge>
            <p>{{ fault.timestamp }} | [{{ fault.code }}] | {{ fault.msg }}</p>
          </va-notification -->
        </va-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'notification',
  components: {
  },
  data () {
    return {
      events: [],
      faults: [],
    }
  },
  created () {
    this.getNodeNames()
    this.getEvents()
    this.getFaults()
  },
  methods: {
    getEvents () {
      const eUri = 'https://localhost:8787/api/notification/event/all'
      axios.get(eUri)
        .then(response => {
          this.events = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    getFaults () {
      const fUri = 'https://localhost:8787/api/notification/fault/all'
      axios.get(fUri)
        .then(response => {
          this.faults = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    deleteEvent (id) {
      axios.delete('https://localhost:8787/api/notification/event/' + id, {
        headers: {},
      })
        .then(response => {
          this.getEvents()
        })
        .catch(e => {
          console.log(e)
        })
    },
    deleteFault (id) {
      axios.delete('https://localhost:8787/api/notification/fault/' + id, {
        headers: {},
      })
        .then(response => {
          this.getFaults()
        })
        .catch(e => {
          console.log(e)
        })
    },
    getNodeNames () {
      const nUri = 'https://localhost:8787/api/topology/nodes'
      axios.get(nUri)
        .then(response => {
          this.nodes = response.data.map((o) => ({ id: o.id, name: o.name }))
        })
        .catch(e => {
          console.log(e)
        })
    },
    findNodeName (id) {
      return this.nodes.find(x => x.id === id).name
    },

    getEventColor (status) {
      if (status === 'LOW') {
        return 'gray'
      } else if (status === 'MEDIUM') {
        return 'info'
      } else if (status === 'HIGH') {
        return 'warning'
      }
      return 'dark'
    },
  },
}
</script>

<style lang="scss">
.event {
  width: 49%;
  display: inline-block;
  margin-right: 5px;
}
</style>
