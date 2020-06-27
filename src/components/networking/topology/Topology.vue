<template>
  <div>
    <div class="row">
      <div class="flex xs12">
        <va-card :title="title">
          <div class="row mt-1">
            <va-button small outline :color="colorSelected(subnet.id)" v-for="(subnet, index) in subnets" :key="index" @click="getSubnetIndex(index)"> {{ subnet.name }} </va-button>

            <va-button class="x" small color="warning" @click="initCreateSubnet"> Create subnet </va-button>
          </div>
        </va-card>
      </div>
    </div>

    <div class="row">
      <div class="flex xs12">
        <subnet-item :subnet="selectedSn" :onEdit="initEditSubnet" :onDelete="deleteSubnet" @refresh="refresh" />
      </div>
    </div>

    <create-subnet @onOk="postSubnet" @onCancel="showCreateSubnet = false" :show="showCreateSubnet" />
  </div>
</template>

<script>
// import axios from 'axios'
import SubnetItem from './Subnet/SubnetItem.vue'
import CreateSubnet from './Subnet/CreateSubnet.vue'

export default {
  name: 'topology',
  // props: [],
  components: {
    SubnetItem,
    CreateSubnet,
  },
  data: function () {
    return {
      title: 'Subnets',
      subnets: [],
      selectedSn: {},
      showCreateSubnet: false,
    }
  },
  created () {
    this.getAllSubnets()
    this.getSubnetIndex(0)
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getSubnetIndex (index) {
      this.selectedSn = this.subnets[index]
    },
    // CRUD Subnet
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
      this.subnets = [
        {
          id: 0,
          name: 'all subnets',
        },
        {
          id: 1,
          name: 'subnet-nist',
          status: 'UP',
        },
        {
          id: 2,
          name: 'subnet-antd',
          status: 'UP',
        },
      ]
    },
    initCreateSubnet () {
      this.showCreateSubnet = true
    },
    postSubnet (subnet) {
      console.log('subnet created: ', subnet.name)
      this.showCreateSubnet = false
    },
    initEditSubnet (subnet) {
      console.log('init edit subnet: ', subnet.id)
    },
    patchSubnet (subnet) {},
    deleteSubnet (id) {
      console.log('delete subnetId: ', id)
    },

    refresh (type) {
      console.log('refresh ', type)
    },

    colorSelected (id) {
      if (id === this.selectedSn.id) {
        return 'info'
      } else {
        return 'gray'
      }
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
