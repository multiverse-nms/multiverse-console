<template>
  <div>
    <div class="row row-equal">
      <div class="flex lg8">
        <va-card :title="tTopology">
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

          <div v-if="subnet.id != 0" class="row">
            <div class="md4">
              <va-button small color="danger" @click="onDelete(subnet.id)"> Delete </va-button>
              <va-button small color="info" @click="onEdit(subnet)"> Edit </va-button>
            </div>

            <div v-if="subnet.id != 0" class="md4 offset--md4">
              <va-button color="warning" small @click="initCreateNode" >
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                Create node
              </va-button>
              <va-button color="warning" small @click="initCreateLink" >
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                Create {{ kind }}
              </va-button>
            </div>
          </div>
        </va-card>
      </div>

      <div class="flex lg4">
        <va-card :title="tTrails">
          <div class="row mt-1">
            <va-button small color="warning" @click="initCreateTrail">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create trail
            </va-button>
          </div>
          <div class="row">
            <trail-table :trails="trails" :onSelected="getTrail" />
          </div>
        </va-card>
      </div>
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      hideDefaultActions
    >
      <node-item v-if="type === 1" :node="selectedNode" :onEdit="initEditNode" :onDelete="deleteNode" @refresh="refresh" />
      <link-item v-if="type === 2" :link="selectedLink" :onEdit="initEditLink" :onDelete="deleteLink" @refresh="refresh"/>
      <link-conn-item v-if="type === 3" :linkConn="selectedLc" :onEdit="initEditLc" :onDelete="deleteLc" @refresh="refresh" />
      <trail-item v-if="type === 4" :trail="selectedTrail" :onEdit="initEditTrail" :onDelete="deleteTrail" @refresh="refresh" />
    </va-modal>

    <create-node @onOk="postNode" @onCancel="showCreateNode = false" :show="showCreateNode" :subnetId="subnet.id" />
    <create-link @onOk="postLink" @onCancel="showCreateLink = false" :show="showCreateLink"/>
    <create-link-conn @onOk="postLc" @onCancel="showCreateLc = false" :show="showCreateLc"/>
    <create-trail @onOk="postTrail" @onCancel="showCreateTrail = false" :show="showCreateTrail" />

  </div>
</template>

<script>
import axios from 'axios'
import icons from '../../../../assets/icons/graph-icons.json'

import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import LinkItem from '../Link/LinkItem'
import CreateLink from '../Link/CreateLink.vue'
import LinkConnItem from '../LinkConn/LinkConnItem.vue'
import CreateLinkConn from '../LinkConn/CreateLinkConn.vue'
import NodeItem from '../Node/NodeItem.vue'
import CreateNode from '../Node/CreateNode.vue'
import TrailTable from '../Trail/TrailTable.vue'
import TrailItem from '../Trail/TrailItem.vue'
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
    TrailItem,
    CreateTrail,
    CreateNode,
    CreateLink,
    CreateLinkConn,
  },
  data: function () {
    return {
      tTopology: 'Topology',
      tTrails: 'Trails',

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
      selectedTrail: {},

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
        force: 4000,
        size: { w: 800, h: 400 },
        nodeSize: 40,
        nodeLabels: true,
        linkLabels: true,
        canvas: false,
        linkWidth: 3,
        fontSize: 16,
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
      let nodesApi = 'https://localhost:8787/api/topology/nodes'
      let linksApi = 'https://localhost:8787/api/topology/' + this.kind + 's'
      if (this.subnet.id === 0) {
        nodesApi = nodesApi + '/all'
        linksApi = linksApi + '/all'
      } else {
        nodesApi = nodesApi + '/subnet/' + this.subnet.id.toString()
        linksApi = linksApi + '/subnet/' + this.subnet.id.toString()
      }
      axios.get(nodesApi)
        .then(response => {
          // console.log('nodes: ' + response.data)
          this.nodes = response.data
          axios.get(linksApi)
            .then(response => {
              // console.log('links: ' + response.data)
              this.links = response.data
              this.processGraph()
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(e => {
          console.log(e)
        })
      this.getTrails()
    },
    processGraph () {
      this.graphNodes = []
      this.graphLinks = []
      this.nodes.forEach(node => {
        let newNode = { id: node.id, name: node.name }
        if (node.type === 'fwd') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } else if (node.type === 'switch') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        }
        newNode._color = this.getStatusColor(node.status)
        this.graphNodes.push(newNode)
      })
      this.links.forEach(link => {
        const newLink = {
          id: link.id,
          sid: link.srcVnodeId,
          tid: link.destVnodeId,
        }
        newLink._color = this.getStatusColor(link.status)
        this.graphLinks.push(newLink)
      })
    },

    // CRUD Node
    getNode (id) {
      this.showItem = false
      console.log('get nodeId:', id)

      const nodeApi = 'https://localhost:8787/api/topology/node/' + id.toString()
      const xcsApi = 'https://localhost:8787/api/topology/xcs/node/' + id.toString()

      axios.get(nodeApi)
        .then(response => {
          // console.log('nodes: ' + response.data)
          this.selectedNode = response.data
          axios.get(xcsApi)
            .then(response => {
              // console.log('links: ' + response.data)
              this.selectedNode.vxcs = response.data
              this.showItem = true
              this.type = 1
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(e => {
          console.log(e)
        })
    },
    initCreateNode () {
      this.showCreateNode = true
    },
    postNode (node) {
      axios.post('https://localhost:8787/api/topology/node', node, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('Node ' + node.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.getSubnetContent()
        })
        .catch(e => {
          console.log(e)
          this.showToast('Node creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateNode = false
    },
    initEditNode (node) {
      console.log('init edit node:', node.id)
    },
    patchNode (node) {},
    deleteNode (id) {
      console.log('delete nodeId:', id)
      axios.delete('https://localhost:8787/api/topology/node/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getSubnetContent()
          this.showItem = false
        })
        .catch(e => {
          console.log(e)
        })
    },

    // CRUD Link
    getLink (id) {
      this.showItem = false
      console.log('get linkId:', id)
      const linkApi = 'https://localhost:8787/api/topology/link/' + id.toString()
      axios.get(linkApi)
        .then(response => {
          this.selectedLink = response.data
          this.showItem = true
          this.type = 2
        })
        .catch(e => {
          console.log(e)
        })
    },
    postLink (link) {
      axios.post('https://localhost:8787/api/topology/link', link, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('Link ' + link.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.setLtpToBusy(link.srcVltpId)
          this.setLtpToBusy(link.destVltpId)
          this.getSubnetContent()
        })
        .catch(e => {
          console.log(e)
          this.showToast('Link creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateLink = false
    },
    initEditLink (link) {
      console.log('init edit link:', link.id)
    },
    patchLink (link) {},
    deleteLink (id) {
      console.log('delete linkId:', id)
      axios.delete('https://localhost:8787/api/topology/link/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getSubnetContent()
          this.showItem = false
        })
        .catch(e => {
          console.log(e)
        })
    },

    // CRUD LinkConn
    getLc (id) {
      this.showItem = false
      console.log('get linkConnId:', id)
      const lcApi = 'https://localhost:8787/api/topology/linkConn/' + id.toString()
      axios.get(lcApi)
        .then(response => {
          this.selectedLc = response.data
          this.showItem = true
          this.type = 3
        })
        .catch(e => {
          console.log(e)
        })
    },
    postLc (lc) {
      axios.post('https://localhost:8787/api/topology/linkConn', lc, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('LinkConn ' + lc.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.setCtpToBusy(lc.srcVctpId)
          this.setCtpToBusy(lc.destVctpId)
          this.getSubnetContent()
        })
        .catch(e => {
          console.log(e)
          this.showToast('LinkConn creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateLc = false
    },
    initEditLc (lc) {
      console.log('init edit linkConn:', lc.id)
    },
    deleteLc (id) {
      console.log('delete linkConnId:', id)
      axios.delete('https://localhost:8787/api/topology/linkConn/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getSubnetContent()
          this.showItem = false
        })
        .catch(e => {
          console.log(e)
        })
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
      let trailsApi = 'https://localhost:8787/api/topology/trails'
      if (this.subnet.id === 0) {
        trailsApi = trailsApi + '/all'
      } else {
        trailsApi = trailsApi + '/subnet/' + this.subnet.id.toString()
      }
      axios.get(trailsApi)
        .then(response => {
          // console.log('trails: ' + response.data)
          this.trails = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },

    getTrail (id) {
      this.showItem = false
      console.log('get trailId:', id)
      const trailApi = 'https://localhost:8787/api/topology/trail/' + id.toString()
      axios.get(trailApi)
        .then(response => {
          this.selectedTrail = response.data
          this.showItem = true
          this.type = 4
        })
        .catch(e => {
          console.log(e)
        })
    },
    initCreateTrail () {
      this.showCreateTrail = true
    },
    postTrail (trail) {
      axios.post('https://localhost:8787/api/topology/trail', trail, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('Trail ' + trail.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.getTrails()
        })
        .catch(e => {
          console.log(e)
          this.showToast('Trail creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateTrail = false
    },
    initEditTrail (trail) {
      console.log('init edit trail: ', trail.id)
    },
    patchTrail (trail) {},
    deleteTrail (id) {
      console.log('delete trailId: ', id)
      axios.delete('https://localhost:8787/api/topology/trail/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getTrails()
        })
        .catch(e => {
          console.log(e)
        })
    },

    setLtpToBusy (ltpId) {
      const ltp = {
        id: ltpId,
        busy: true,
      }
      axios.patch('https://localhost:8787/api/topology/ltp', ltp, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    setCtpToBusy (ctpId) {
      const ctp = {
        id: ctpId,
        busy: true,
      }
      axios.patch('https://localhost:8787/api/topology/ctp', ctp, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    /* createLtpOnNode(nodeId, ltpName) {
      const ltp = {
        vnodeId: nodeId,
        name: ltpName,
        label: 'auto_ltp',
        description: 'automatically generated LTP',
        info: {},
        busy: false,
      }
      axios.post('https://localhost:8787/api/topology/ltp', ltp)
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    }, */

    refresh (type) {
      console.log('refresh ', type)
      this.getSubnetContent()
      this.getTrails()
    },

    getStatusColor (status) {
      if (status === 'UP') {
        return 'green'
      } else if (status === 'DOWN') {
        return '#ff5349'
      } else {
        return 'yellow'
      }
    },
  },
}

</script>
<style lang="stylus">
.topology {
  max-height: 500px;
}

</style>
