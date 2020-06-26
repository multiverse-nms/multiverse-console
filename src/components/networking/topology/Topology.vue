<template>
  <div>
    <div class="row">
      <div class="flex xs6">
        <va-button small color="info" @click="initCreateSubnet"> Create Subnet </va-button>
      </div>
    </div>

    <div class="row">
      <div class="flex xs12">
        <subnet-content :subnetId="selectedSubnetId" @refresh="refresh" />
      </div>
    </div>

    <create-subnet @onOk="subnetCreated" @onCancel="showCreateSubnet = false" :show="showCreateSubnet" />
  </div>
</template>

<script>
// import axios from 'axios'
import SubnetContent from './Subnet/SubnetContent.vue'
import CreateSubnet from './Subnet/CreateSubnet.vue'

export default {
  name: 'topology',
  // props: [],
  components: {
    SubnetContent,
    CreateSubnet,
  },
  data: function () {
    return {
      title: 'Network topology',
      selectedSubnetId: 'all',

      showCreateSubnet: false,
    }
  },
  created () {
    this.getAllSubnets()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getAllSubnets () {
      /* this.response = {}
      axios.get('https://localhost:8787/api/topology/nodes/all')
        .then(response => {
          this.response = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        }) */
    },
    initCreateSubnet () {
      this.showCreateSubnet = true
    },
    subnetCreated (subnet) {
      console.log('subnet created')
      this.showCreateSubnet = false
    },

    refresh (type) {
      console.log('refresh ', type)
    },

    /*
     processPrefixes () {
      if (this.graphNodes.length === 0) {
        return
      }
      const nodesWithPrfx = new Map()
      this.prefixes.forEach(p => {
        if (nodesWithPrfx.has(p.node)) {
          nodesWithPrfx.set(p.node, nodesWithPrfx.get(p.node) + 1)
        } else {
          nodesWithPrfx.set(p.node, 1)
        }
      })

      this.graphNodes.forEach(node => {
        if (nodesWithPrfx.has(node.id)) {
          const n = node.name.split(' ')
          node.name = n[0] + ' ' + '[' + nodesWithPrfx.get(node.id) + ' prefix(es)]'
        }
      })
    }, */
  },
}

</script>
<style lang="stylus">
.title.is-7 {
  font-size: 1.5rem;
  text-align: center;
}

.title {
  font-size: 0.625rem;
  letter-spacing: 0.6px;
  line-height: 1.6;
  font-weight: bold;
  text-transform: uppercase;
}

</style>
