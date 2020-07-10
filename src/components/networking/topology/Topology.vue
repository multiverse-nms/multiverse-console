<template>
  <div>
    <div class="row">
      <div class="flex xs12">
        <va-card :title="title">

          <va-button v-if="subnets.length > 0" small outline :color="colorSelected(subnetAll.id)" @click="selectAllSubnets()"> {{ subnetAll.name }} </va-button>
          <va-chip v-if="subnets.length == 0" color="gray">No Subnets to show</va-chip>

          <va-popover v-for="(subnet, index) in subnets" :key="index"
            :message="subnet.description"
            placement="right"
          >
            <va-button small outline :color="colorSelected(subnet.id)"  @click="getSubnetIndex(index)">
              {{ subnet.name }}
            </va-button>
          </va-popover>

          <va-button class="x" small color="warning" @click="initCreateSubnet">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            Create subnet
          </va-button>
        </va-card>
      </div>
    </div>

    <div class="row">
      <div class="flex xs12">
        <subnet-item :subnet="selectedSn" :onEdit="initEditSubnet" :onDelete="deleteSubnet" @refresh="refresh" />
      </div>
    </div>

    <create-subnet @onOk="postSubnet" @onCancel="showCreateSubnet = false" :show="showCreateSubnet" :name="nextSnName" />
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
      nextSnName: 'sn-0',
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
      axios.get('https://localhost:8787/api/topology/subnets')
        .then(response => {
          this.subnets = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    initCreateSubnet () {
      this.getNextSnName()
      this.showCreateSubnet = true
    },
    postSubnet (subnet) {
      // check if name already exists...
      for (var i = 0, len = this.subnets.length; i < len; i++) {
        if (this.subnets[i].name === subnet.name) {
          this.showToast('Name ' + subnet.name + ' already exists', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
          return
        }
      }

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

    getNextSnName () {
      // this.nodes.sort(function(a, b){return a.name - b.name})
      if (this.subnets.length > 0) {
        const maxSnNo = this.subnets[this.subnets.length - 1].name.split('-')[1]
        this.nextSnName = 'sn-' + (parseInt(maxSnNo, 10) + 1)
      }
    },
  },
}

</script>
<style lang="stylus">
</style>
