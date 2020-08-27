<template>
  <div class="configuration">

    <div class="row row-equal">
      <div class="flex xs12 lg12">
        <va-card title="Nodes">
          <div class="event">
            <va-chip v-if="nodes.length == 0" color="gray">No Nodes to show</va-chip>
            <va-button small outline v-for="(node, index) in nodes" :key="index" :color="colorSelected(node.id)"  @click="getConfigs(node.id)">
              {{ node.name }}
            </va-button>
          </div>
        </va-card>
      </div>
    </div>

    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card title="Candidate configuration">
          <div v-if="cconfig === ''" class="text-center mt-5">
            <va-chip color="gray">No configuration to show</va-chip>
          </div>
          <div v-else class="x">
            <pre>
              {{ cconfig }}
            </pre>
          </div>
        </va-card>
      </div>

      <div class="flex xs12 lg6">
        <va-card title="Running configuration">
          <div v-if="cconfig === ''" class="text-center mt-5">
            <va-chip color="gray">No configuration to show</va-chip>
          </div>
          <div v-else class="x">
            <pre>
              {{ rconfig }}
            </pre>
          </div>
        </va-card>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'configuration',
  components: {
  },
  data () {
    return {
      nodes: [],
      selectedId: 0,
      cconfig: '',
      rconfig: '',
    }
  },
  created () {
    this.getNodes()
  },
  methods: {
    getNodes () {
      const nUri = this.$apiURI + '/topology/nodes'
      axios.get(nUri)
        .then(response => {
          this.nodes = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },

    getConfigs (nodeId) {
      this.selectedId = nodeId
      const ccUri = this.$apiURI + '/configuration/candidate-config/' + nodeId
      axios.get(ccUri)
        .then(response => {
          this.cconfig = response.data
        })
        .catch(e => {
          this.cconfig = ''
        })
      const rcUri = this.$apiURI + '/configuration/running-config/' + nodeId
      axios.get(rcUri)
        .then(response => {
          this.rconfig = response.data
        })
        .catch(e => {
          this.rconfig = ''
        })
    },

    colorSelected (id) {
      if (id === this.selectedId) {
        return 'info'
      } else {
        return 'gray'
      }
    },
  },
}
</script>

<style lang="scss">
</style>
