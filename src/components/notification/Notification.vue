<template>
  <div class="notifications">
    <div class="row row-equal">
      <div class="flex xs12 lg8">
        <va-card title="Events">
          <div v-for="(event, index) in events" :key="index" class="event">
            <va-notification :color="getEventColor(event.severity)" closeable @input="deleteEvent(event.id)">
              <va-badge :color="getEventColor(event.severity)">
                {{ findNodeName(event.origin) }}
              </va-badge>
              <p>{{ event.timestamp }} | [{{ event.code }}] | {{ event.msg }}</p>
            </va-notification>
          </div>
        </va-card>
      </div>

      <div class="flex xs12 lg4">
        <va-card title="Faults">
          <va-notification v-for="(fault, index) in faults" :key="index" color="danger" closeable @input="deleteFault(fault.id)">
            <va-badge color="danger">
              {{ findNodeName(fault.origin) }}
            </va-badge>
            <p>{{ fault.timestamp }} | [{{ fault.code }}] | {{ fault.msg }}</p>
          </va-notification>
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
      return this.nodes.find(x => x.id === id).name.split(':')[1]
    },

    getEventColor (status) {
      if (status === 'low') {
        return 'gray'
      } else if (status === 'medium') {
        return 'info'
      } else if (status === 'high') {
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
