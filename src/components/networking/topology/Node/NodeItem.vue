<template>
  <div class="node-details">
    <div class="row">
      <div class="flex lg4">
        <div class="text-center">
          Node Details
        </div>

        <va-item>
          <va-item-section side>
            Name:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Label:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.label }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Description:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.description }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Type:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.type }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Location:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.location }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Position:
          </va-item-section>
          <va-item-section>
            <va-item-label>[ {{ node.posx }} , {{ node.posy }} ]</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Status:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Info:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.info }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Created:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Updated:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-5">
          <div class="flex xs12">
            <va-button small color="danger" @click="onDelete(node.id)"> Delete </va-button>
            <va-button small color="info" @click="onEdit(node)"> Edit </va-button>
          </div>
        </div>
      </div>

      <div class="flex lg8">
        <div class="text-center">
          <va-tabs grow v-model="tabValue">
            <va-tab>
              LTPs
            </va-tab>
            <va-tab>
              XCs
            </va-tab>
          </va-tabs>

          <div v-if="tabValue == 0">
            <ltp-table :ltps="node.vltps" :onSelected="getLtp" />
            <va-button small color="warning" @click="initAddLtp()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Add LTP </va-button>
          </div>
          <div v-if="tabValue == 1">
            <xc-table :xcs="node.vxcs" :onSelected="getXc" />
            <va-button small color="warning" @click="initAddXc()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Add XC </va-button>
          </div>
        </div>
      </div>
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      hideDefaultActions
    >
      <ltp-item v-if="type === 1" :ltp="selectedLtp" :onDelete="deleteLtp" :onEdit="initEditLtp" />
      <xc-item v-if="type === 2" :xc="selectedXc" :onDelete="deleteXc" :onEdit="initEditXc" />
    </va-modal>

    <create-ltp @onOk="postLtp" @onCancel="showCreateLtp = false" :show="showCreateLtp" :nodeId="node.id" :nodeName="node.name" />
    <create-xc @onOk="postXc" @onCancel="showCreateXc = false" :show="showCreateXc" :nodeId="node.id" :nodeName="node.name" />
  </div>
</template>

<script>
import axios from 'axios'
import LtpTable from '../Ltp/LtpTable.vue'
import LtpItem from '../Ltp/LtpItem.vue'
import CreateLtp from '../Ltp/CreateLtp.vue'
import XcTable from '../Xc/XcTable.vue'
import XcItem from '../Xc/XcItem.vue'
import CreateXc from '../Xc/CreateXc.vue'

export default {
  name: 'NodeItem',
  props: ['node', 'onEdit', 'onDelete'],
  components: {
    LtpTable,
    LtpItem,
    CreateLtp,
    XcTable,
    XcItem,
    CreateXc,
  },
  data: function () {
    return {
      tabValue: 0,
      showItem: false,
      type: 0,
      selectedLtp: {},
      selectedXc: {},
      showCreateLtp: false,
      showCreateXc: false,
    }
  },

  created () {
  },
  watch: {
  },
  methods: {
    // CRUD LTP
    initAddLtp () {
      console.log('init add LTP for nodeId:', this.node.id)
      this.showCreateLtp = true
    },
    postLtp (ltp) {
      axios.post('https://localhost:8787/api/topology/ltp', ltp, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('LTP ' + ltp.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          // this.$emit('refresh', 'node.ltp.add')
          this.getLtpsByNode()
        })
        .catch(e => {
          console.log(e)
          this.showToast('LTP creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateLtp = false
    },
    getLtp (id) {
      this.showItem = false
      console.log('get ltpId:', id)
      const ltpApi = 'https://localhost:8787/api/topology/ltp/' + id.toString()
      axios.get(ltpApi)
        .then(response => {
          this.selectedLtp = response.data
          this.showItem = true
          this.type = 1
        })
        .catch(e => {
          console.log(e)
        })
    },
    initEditLtp (ltp) {
      console.log('init edit LTP:', ltp.name)
    },
    patchLtp (ltp) {},
    deleteLtp (id) {
      console.log('delete LTP:', id)
      axios.delete('https://localhost:8787/api/topology/ltp/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.$emit('refresh', 'ltp.delete')
          this.showItem = false
          this.getLtpsByNode()
        })
        .catch(e => {
          console.log(e)
        })
    },

    // CRUD XC
    initAddXc () {
      console.log('init add XC for nodeId:', this.node.id)
      this.showCreateXc = true
    },
    postXc (xc) {
      axios.post('https://localhost:8787/api/topology/xc', xc, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('XC ' + xc.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          // this.$emit('refresh', 'node.xc.add')
          this.getXcsByNode()
        })
        .catch(e => {
          console.log(e)
          this.showToast('XC creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateXc = false
    },
    getXc (id) {
      this.showItem = false
      console.log('get xcId:', id)
      const xcApi = 'https://localhost:8787/api/topology/xc/' + id.toString()
      axios.get(xcApi)
        .then(response => {
          this.selectedXc = response.data
          this.showItem = true
          this.type = 2
        })
        .catch(e => {
          console.log(e)
        })
    },
    initEditXc (xc) {
      console.log('init edit XC:', xc.name)
    },
    patchXc (xc) {},
    deleteXc (id) {
      console.log('delete XC:', id)
      axios.delete('https://localhost:8787/api/topology/xc/' + id.toString())
        .then(response => {
          console.log(response.data)
          // this.$emit('refresh', 'xc.delete')
          this.showItem = false
          this.getLtpsByNode()
        })
        .catch(e => {
          console.log(e)
        })
    },

    // other
    getLtpsByNode () {
      const ltpsApi = 'https://localhost:8787/api/topology/ltps/node/' + this.node.id.toString()
      axios.get(ltpsApi)
        .then(response => {
          this.node.vltps = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    getXcsByNode () {
      const xcsApi = 'https://localhost:8787/api/topology/xcs/node/' + this.node.id.toString()
      axios.get(xcsApi)
        .then(response => {
          this.node.vxcs = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },

    /* createCtpOnLtp(ltpId, ctpName) {
      const ctp = {
        vltpId: ltpId,
        name: ctpName,
        label: 'auto_ctp',
        description: 'automatically generated CTP',
        info: {},
        busy: false,
      }
      axios.post('https://localhost:8787/api/topology/ctp', ctp)
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    }, */

    refresh (type) {
      console.log('node refresh ', type)
      if (type === 'ltp.ctp.delete') {
        // notify subnet:
        this.$emit('refresh', type)
      }
    },
    getStatusColor (status) {
      if (status === 'DOWN') {
        return 'danger'
      }
      return 'success'
    },

  },

  computed: {},
}
</script>

<style lang="scss">
.node-details {
  width: 800px;
  max-width: 800px;
}
</style>
