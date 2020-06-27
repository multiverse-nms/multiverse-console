<template>
  <div class="node-details">
    <div class="row">
      <div class="flex lg4">
        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ node.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ getSubnetName(node.vsubnetId) }}</va-item-label>
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
        <va-tabs grow v-model="tabValue">
          <va-tab>
            LTPs
          </va-tab>
          <va-tab>
            XCs
          </va-tab>
        </va-tabs>

        <div v-if="tabValue == 0" >
          <ltp-table :ltps="node.ltps" :onSelected="getLtp" />
          <va-modal
            v-model="showLtpDetails"
            size="large"
            title="LTP details"
            hideDefaultActions
          >
            <ltp-item :ltp="selectedLtp" :onDelete="deleteLtp" :onEdit="initEditLtp" />
          </va-modal>

          <va-button small color="warning" @click="initAddLtp()"> Add LTP </va-button>
        </div>

        <div v-if="tabValue == 1" >
          <xc-table :xcs="node.xcs" :onDelete="deleteXc" :onEdit="initEditXc" />

          <va-button small color="warning" @click="initAddXc()"> Add XC </va-button>
        </div>
      </div>
    </div>

    <create-ltp @onOk="postLtp" @onCancel="showCreateLtp = false" :show="showCreateLtp" :nodeId="node.id" />
    <create-xc @onOk="postXc" @onCancel="showCreateXc = false" :show="showCreateXc" :nodeId="node.id" />
  </div>
</template>

<script>
import LtpTable from '../Ltp/LtpTable.vue'
import LtpItem from '../Ltp/LtpItem.vue'
import CreateLtp from '../Ltp/CreateLtp.vue'
import XcTable from '../Xc/XcTable.vue'
import CreateXc from '../Xc/CreateXc.vue'

export default {
  name: 'NodeItem',
  props: ['node', 'onEdit', 'onDelete'],
  components: {
    LtpTable,
    LtpItem,
    CreateLtp,
    XcTable,
    CreateXc,
  },
  data: function () {
    return {
      tabValue: 0,
      showLtpDetails: false,
      selectedLtp: {},
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
      console.log('LtP created: ', ltp.name)
      this.showCreateLtp = false
      this.$emit('refresh', 'node.ltp.add')
    },
    getLtp (id) {
      console.log('get LTP:', id)
      this.selectedLtp = {
        id: 1,
        name: 'A:ltp0',
        status: 'UP',
        created: '1246879',
        updated: '1246879',
        ctps: [
          {
            id: 1,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 3,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
        ],
      }
      this.showLtpDetails = true
    },
    initEditLtp (ltp) {
      console.log('init edit LTP:', ltp.name)
    },
    patchLtp (ltp) {},
    deleteLtp (id) {
      console.log('delete LTP:', id)
      this.$emit('refresh', 'ltp.delete')
    },

    // CRUD XC
    initAddXc () {
      console.log('init add XC for nodeId:', this.node.id)
      this.showCreateXc = true
    },
    postXc (xc) {
      this.showCreateXc = false
      console.log('Xc created: ', xc.name)
      this.$emit('refresh', 'node.xc.add')
    },
    getXc (id) {
      console.log('get XC not used')
      /* console.log('get XC:', id)
      this.xc = {
        id: 1,
        name: 'A:xc0',
        status: 'UP',
        created: '1246879',
        updated: '1246879',
      }
      this.showXcDetails = true */
    },
    initEditXc (xc) {
      console.log('init edit XC:', xc.name)
    },
    patchXc (xc) {},
    deleteXc (id) {
      console.log('delete XC:', id)
      this.$emit('refresh', 'xc.delete')
    },

    // other
    getSubnetName (id) {
      return 'nist-subnet'
    },
    refresh (type) {
      console.log('node refresh ', type)
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
