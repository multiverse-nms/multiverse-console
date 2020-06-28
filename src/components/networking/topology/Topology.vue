<template>
  <div>
    <div class="row">
      <div class="flex xs12">
        <va-card :title="title">
          <div class="row mt-1">
            <va-button small outline :color="colorSelected(subnetAll.id)" @click="selectAllSubnets()"> {{ subnetAll.name }} </va-button>

            <va-popover v-for="(subnet, index) in subnets" :key="index"
              :message="subnet.description"
              placement="right"
            >
              <va-button small outline :color="colorSelected(subnet.id)"  @click="getSubnetIndex(index)">
                {{ subnet.name }}
              </va-button>
            </va-popover>

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
import axios from 'axios'
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
      subnetAll: {
        id: 0,
        name: 'all subnets',
      },
      subnets: [],
      selectedSn: {},
      showCreateSubnet: false,
    }
  },
  created () {
    this.getAllSubnets()
    this.selectAllSubnets()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    selectAllSubnets () {
      this.selectedSn = this.subnetAll
    },
    getSubnetIndex (index) {
      this.selectedSn = this.subnets[index]
    },
    // CRUD Subnet
    getAllSubnets () {
      axios.get('https://localhost:8787/api/topology/subnets/all')
        .then(response => {
          this.subnets = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    initCreateSubnet () {
      this.showCreateSubnet = true
    },
    postSubnet (subnet) {
      axios.post('https://localhost:8787/api/topology/subnet', subnet, {
        headers: {},
      })
        .then(response => {
          // console.log(response.data)
          this.showToast('Subnet ' + subnet.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.getAllSubnets()
        })
        .catch(e => {
          console.log(e.response)
          this.showToast('Subnet creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateSubnet = false
    },
    initEditSubnet (subnet) {
      console.log('init edit subnet: ', subnet.id)
    },
    patchSubnet (subnet) {},
    deleteSubnet (id) {
      console.log('delete subnetId: ', id)
      axios.delete('https://localhost:8787/api/topology/subnet/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getAllSubnets()
          this.selectAllSubnets()
        })
        .catch(e => {
          console.log(e)
        })
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
