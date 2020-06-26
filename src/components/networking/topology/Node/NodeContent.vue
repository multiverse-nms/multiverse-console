<template>
  <va-modal
    v-model="show"
    size="large"
    title="Node details"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
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
              <va-button small color="danger" @click="deleteNode()"> Delete </va-button>
              <va-button small color="info" @click="initEditNode()"> Edit </va-button>
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
            <ltp-content :ltps="node.ltps" @refresh="refresh" />
            <va-button small color="warning" @click="initAddLtp()"> Add LTP </va-button>
          </div>

          <div v-if="tabValue == 1" >
            <xc-content :xcs="node.xcs" @refresh="refresh" />
            <va-button small color="warning" @click="initAddXc()"> Add XC </va-button>
          </div>
        </div>
      </div>
    </div>
    <va-separator/>
    <va-button small color="gray" @click="close()"> OK </va-button>

    <create-ltp @onOk="ltpCreated" @onCancel="showCreateLtp = false" :show="showCreateLtp" :nodeId="nodeId" />
    <create-xc @onOk="xcCreated" @onCancel="showCreateXc = false" :show="showCreateXc" :nodeId="nodeId" />
  </va-modal>
</template>

<script>
import LtpContent from '../Ltp/LtpContent.vue'
import CreateLtp from '../Ltp/CreateLtp.vue'
import XcContent from '../Xc/XcContent.vue'
import CreateXc from '../Xc/CreateXc.vue'

export default {
  name: 'NodeContent',
  props: ['nodeId'],
  components: {
    LtpContent,
    CreateLtp,
    XcContent,
    CreateXc,
  },
  data: function () {
    return {
      tabValue: 0,
      show: false,
      node: {},

      showCreateLtp: false,
      showCreateXc: false,
    }
  },

  created () {
  },
  watch: {
    nodeId: {
      handler: function () {
        if (this.nodeId > 0) {
          this.getNode()
        }
      },
      deep: true,
    },
    /* 'nPrefix.node': function (newVal, oldVal) {
      this.nPrefix.interface = ''
      this.getInterfaces(newVal)
    }, */
  },
  methods: {
    getNode () {
      console.log('get nodeId:', this.nodeId)
      this.node = {
        id: 1,
        name: 'A',
        status: 'UP',
        vsubnetId: 12,
        created: '132355',
        updated: '132355',
        ltps: [
          {
            id: 1,
            name: 'A:ltp0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:ltp0',
            status: 'UP',
          },
          {
            id: 3,
            name: 'A:ltp0',
            status: 'UP',
          },
        ],
        xcs: [
          {
            id: 1,
            name: 'A:xc0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:xc0',
            status: 'UP',
          },
          {
            id: 3,
            name: 'A:xc0',
            status: 'UP',
          },
        ],
      }
      this.show = true
    },
    initEditNode () {
      console.log('init edit node:', this.nodeId)
    },
    deleteNode () {
      console.log('delete nodeId:', this.nodeId)
      this.$emit('refresh', 'node.delete')
    },

    // add ltp
    initAddLtp () {
      console.log('init add LTP for nodeId:', this.nodeId)
      this.showCreateLtp = true
    },
    ltpCreated (ltp) {
      console.log('Ltp created: ', ltp.name)
      this.showCreateLtp = false
      this.$emit('refresh', 'node.ltp.add')
    },

    // add xc
    initAddXc () {
      console.log('init add XC for nodeId:', this.nodeId)
      this.showCreateXc = true
    },
    xcCreated (xc) {
      this.showCreateXc = false
      console.log('Xc created: ', xc.name)
      this.$emit('refresh', 'node.xc.add')
    },

    close () {
      this.$emit('onClose')
      this.show = false
    },

    getSubnetName (id) {
      return 'nist-subnet'
    },

    refresh (type) {
      console.log('refresh ', type)
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
