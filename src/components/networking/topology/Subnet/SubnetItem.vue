<template>
  <div>
    <div class="row row-equal">
      <div class="flex lg9">
        <va-card :title="tTopology">
          <div class="row mt-1">
            <va-button small color="danger" @click="onDelete(subnet.id)"> Delete </va-button>
            <va-button small color="info" @click="onEdit(subnet)"> Edit </va-button>
          </div>
          <div class="row mt-1">
            <va-button-toggle
              small
              outline
              v-model="kind"
              :options="kindOptions"
              color="dark"
            />
          </div>
          <div class="row">
            <div class="topology flex xs12">
              <d3-network
                ref='net'
                :net-nodes="graphNodes"
                :net-links="graphLinks"
                :options="options"
                @node-click="nodeClick"
                @link-click="linkClick"
              />
            </div>
          </div>

          <div class="row">
            <div class="subnet-options">
              <ul>
                <li>
                  <va-button color="warning" small @click="initCreateNode" >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Create node
                  </va-button>
                  <va-button color="warning" small @click="initCreateLink" >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Create {{ kind }}
                  </va-button>
                </li>
              </ul>
            </div>
          </div>
        </va-card>
      </div>
      <!-- /div -->

      <!-- div class="row row-equal" -->
      <div class="flex lg3">
        <va-card :title="tTrails">
          <div class="row mt-1">
            <va-button small color="warning" @click="initCreateTrail">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create trail
            </va-button>
          </div>
          <div class="row">
            <trail-table :trails="trails" :onEdit="initEditTrail" :onDelete="deleteTrail"/>
          </div>
        </va-card>
      </div>
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      title="Details"
      hideDefaultActions
    >
      <node-item v-if="type === 1" :node="selectedNode" :onEdit="initEditNode" :onDelete="deleteNode" @refresh="refresh" />
      <link-item v-if="type === 2" :link="selectedLink" :onEdit="initEditLink" :onDelete="deleteLink" @refresh="refresh"/>
      <link-conn-item v-if="type === 3" :linkConn="selectedLc" :onEdit="initEditLc" :onDelete="deleteLc" @refresh="refresh" />
    </va-modal>

    <create-node @onOk="postNode" @onCancel="showCreateNode = false" :show="showCreateNode" />
    <create-link @onOk="postLink" @onCancel="showCreateLink = false" :show="showCreateLink"/>
    <create-link-conn @onOk="postLc" @onCancel="showCreateLc = false" :show="showCreateLc"/>
    <create-trail @onOk="postTrail" @onCancel="showCreateTrail = false" :show="showCreateTrail" />

  </div>
</template>

<script>
// import axios from 'axios'
// import icons from '../../../assets/icons/graph-icons.json'

import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import LinkItem from '../Link/LinkItem'
import CreateLink from '../Link/CreateLink.vue'
import LinkConnItem from '../LinkConn/LinkConnItem.vue'
import CreateLinkConn from '../LinkConn/CreateLinkConn.vue'
import NodeItem from '../Node/NodeItem.vue'
import CreateNode from '../Node/CreateNode.vue'
import TrailTable from '../Trail/TrailTable.vue'
import CreateTrail from '../Trail/CreateTrail.vue'

export default {
  name: 'subnet-item',
  props: ['subnet', 'onEdit', 'onDelete'],
  components: {
    D3Network,
    LinkItem,
    LinkConnItem,
    NodeItem,
    TrailTable,
    CreateTrail,
    CreateNode,
    CreateLink,
    CreateLinkConn,
  },
  data: function () {
    return {
      tTopology: 'Topology',
      tTrail: 'Trails',

      kind: 'link',
      kindOptions: [
        { label: 'Physical', value: 'link' },
        { label: 'Logical', value: 'linkConn' },
      ],

      nodes: [],
      links: [],
      trails: [],

      graphNodes: [],
      graphLinks: [],

      type: 0,
      showItem: false,
      selectedNode: {},
      selectedLink: {},
      selectedLc: {},

      showCreateNode: false,
      showCreateLink: false,
      showCreateLc: false,
      showCreateTrail: false,
    }
  },
  created () {
    this.getSubnetContent()
  },
  computed: {
    options () {
      return {
        force: 6000,
        size: { w: 1000, h: 500 },
        nodeSize: 60,
        nodeLabels: true,
        linkLabels: false,
        canvas: false,
        linkWidth: 3,
        fontSize: 18,
      }
    },
  },
  watch: {
    subnet: {
      handler: function () {
        this.getSubnetContent()
      },
    },
    kind: {
      handler: function () {
        this.getSubnetContent()
      },
    },
  },
  methods: {
    getSubnetContent () {
      /* this.response = {}
      axios.get('https://localhost:8787/api/topology/nodes/all')
        .then(response => {
          this.response = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        }) */
      this.getTrails()
      this.nodes = [
        { id: 1, name: 'A', status: 'UP' },
        { id: 2, name: 'B', status: 'UP' },
      ]
      this.links = [
        { id: 1, name: 'A-B', srcVnodeId: 1, destVnodeId: 2, status: 'UP' },
      ]
      this.processGraph()
    },
    processGraph () {
      this.graphNodes = []
      this.graphLinks = []
      this.nodes.forEach(node => {
        const newNode = { id: node.id, name: node.name }
        /* if (node.type === 'fwd') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } else if (node.type === 'switch') {
          newNode = Object.assign(newNode, { svgSym: icons.switchIcon, svgIcon: null, svgObj: null })
        } */
        if (node.status === 'UP') {
          newNode._color = 'green'
        } else if (node.status === 'DOWN') {
          newNode._color = '#ff5349'
        } else {
          newNode._color = 'yellow'
        }
        this.graphNodes.push(newNode)
      })
      this.links.forEach(link => {
        const newLink = {
          id: link.id,
          sid: link.srcVnodeId,
          tid: link.destVnodeId,
        }
        if (link.status === 'UP') {
          newLink._color = 'green'
        } else if (link.status === 'DOWN') {
          newLink._color = '#ff5349'
        } else {
          newLink._color = 'yellow'
        }
        this.graphLinks.push(newLink)
      })
    },

    // CRUD Node
    getNode (id) {
      this.showItem = false
      console.log('get nodeId:', id)
      this.selectedNode = {
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
      this.showItem = true
      this.type = 1
    },
    initCreateNode () {
      this.showCreateNode = true
    },
    postNode (node) {
      this.showCreateNode = false
      console.log('node created: ' + node.name)
    },
    initEditNode (node) {
      console.log('init edit node:', node.id)
    },
    patchNode (node) {},
    deleteNode (id) {
      console.log('delete nodeId:', id)
    },

    // CRUD Link
    getLink (id) {
      this.showItem = false
      console.log('get linkId:', id)
      this.selectedLink = {
        id: 1,
        name: 'A-B',
        vsubnetId: 12,
        srcVnodeId: 1,
        destVnodeId: 2,
        status: 'UP',
        vlcs: [
          {
            id: 1,
            name: 'A:ltp0:ctp0-B:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:ltp0:ctp0-B:ltp0:ctp0',
            status: 'DOWN',
          },
        ],
      }
      this.showItem = true
      this.type = 2
    },
    postLink (link) {
      this.showCreateLink = false
      console.log('link created: ' + link.name)
    },
    initEditLink (link) {
      console.log('init edit link:', link.id)
    },
    patchLink (link) {},
    deleteLink (id) {
      console.log('delete linkId:', id)
    },

    // CRUD LinkConn
    getLc (id) {
      this.showItem = false
      console.log('get linkConnId:', id)
      this.selectedLc = {
        id: 1,
        name: 'A-B',
        srcVnodeId: 1,
        destVnodeId: 2,
        status: 'UP',
      }
      this.showItem = true
      this.type = 3
    },
    postLc (lc) {
      this.showCreateLc = false
      console.log('linkConn created: ' + lc.name)
    },
    initEditLc (lc) {
      console.log('init edit linkConn:', lc.id)
    },
    deleteLc (id) {
      console.log('delete linkConnId:', id)
    },
    // for both link and lc
    initCreateLink () {
      if (this.kind === 'link') {
        this.showCreateLink = true
      } else {
        this.showCreateLc = true
      }
    },

    // call get...
    nodeClick (event, node) {
      this.getNode(node.id)
    },
    linkClick (event, link) {
      if (this.kind === 'link') {
        this.getLink(link.id)
      } else {
        this.getLc(link.id)
      }
    },

    // CRUD Trail
    getTrails () {
      console.log('get trails for subnetId:', this.subnet.id)
      this.trails = [
        {
          id: 1,
          name: 'T1',
          status: 'UP',
        },
        {
          id: 2,
          name: 'T2',
          status: 'DOWN',
        },
      ]
    },
    initCreateTrail () {
      this.showCreateTrail = true
    },
    postTrail (trail) {
      this.showCreateTrail = false
      console.log('trail created: ', trail.name)
    },
    initEditTrail (trail) {
      console.log('init edit trail: ', trail.id)
    },
    patchTrail (trail) {},
    deleteTrail (id) {
      console.log('delete trailId: ', id)
    },

    refresh (type) {
      console.log('refresh ', type)
    },
  },
}

</script>
<style lang="stylus">
.topology {
  max-height: 500px;
}

</style>
