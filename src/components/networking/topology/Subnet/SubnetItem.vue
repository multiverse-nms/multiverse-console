<template>
  <div>
    <div class="row row-equal">
      <div class="flex lg9">
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
          <div class="topology">
            <d3-network
              ref='net'
              :net-nodes="graphNodes"
              :net-links="graphLinks"
              :options="options"
              @node-click="nodeClick"
              @link-click="linkClick"
            />
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

      <div class="flex lg3">
        <va-card :title="tTrails">
          <trail-table :trails="trails" :onSelected="getTrail" />
          <div v-if="subnet.id != 0" class="text-center mt-5">
            <va-button small color="warning" @click="initCreateTrail">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create trail
            </va-button>
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

    <create-node @onOk="postNode" @onCancel="showCreateNode = false" :show="showCreateNode" :subnetId="subnet.id" :name="nextNodeName" />
    <create-link @onOk="postLink" @onCancel="showCreateLink = false" :show="showCreateLink"/>
    <create-link-conn @onOk="postLc" @onCancel="showCreateLc = false" :show="showCreateLc" :linkId="0"/>
    <create-trail @onOk="postTrail" @onCancel="showCreateTrail = false" :show="showCreateTrail" />

  </div>
</template>

<script>
import axios from 'axios'
// import icons from '../../../../assets/icons/graph-icons.json'

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

      nextNodeName: '',
    }
  },
  created () {
    this.getSubnetContent()
  },
  computed: {
    options () {
      return {
        force: 3000,
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
      let nodesApi = 'https://localhost:8787/api/topology/'
      let linksApi = 'https://localhost:8787/api/topology/'
      if (this.subnet.id === 0) {
        nodesApi = nodesApi + 'nodes'
        linksApi = linksApi + this.kind + 's'
      } else {
        nodesApi = nodesApi + 'subnet/' + this.subnet.id.toString() + '/nodes'
        linksApi = linksApi + 'subnet/' + this.subnet.id.toString() + '/' + this.kind + 's'
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
              this.setPrefixes()
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
        const newNode = { id: node.id, name: node.name }
        /* if (node.type === 'fwd') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } else if (node.type === 'switch') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } */
        newNode._color = this.getStatusColor(node.status)
        this.graphNodes.push(newNode)
      })
      this.links.forEach(link => {
        if (this.kind === 'linkConn' || this.subnet.id === 0 || link.type === 'IN') {
          const newLink = {
            id: link.id,
            sid: link.srcVnodeId,
            tid: link.destVnodeId,
          }
          newLink._color = this.getStatusColor(link.status)
          this.graphLinks.push(newLink)
        }
      })
    },

    // CRUD Node
    getNode (id) {
      this.showItem = false
      console.log('get nodeId:', id)

      const nodeApi = 'https://localhost:8787/api/topology/node/' + id.toString()
      const xcsApi = 'https://localhost:8787/api/topology/node/' + id.toString() + '/xcs'

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
      this.getNextNodeName()
      this.showCreateNode = true
    },
    postNode (node) {
      // check if name already exists...
      for (var i = 0, len = this.nodes.length; i < len; i++) {
        if (this.nodes[i].name === node.name) {
          this.showToast('Name ' + node.name + ' already exists', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
          return
        }
      }

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
      for (var i = 0, len = this.links.length; i < len; i++) {
        if (this.links[i].name === link.name) {
          this.showToast('Name ' + link.name + ' already exists', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
          return
        }
      }

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
    deleteLink (link) {
      console.log('delete linkId:', link.id)
      axios.delete('https://localhost:8787/api/topology/link/' + link.id.toString())
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
      // check if name already exists...
      for (var i = 0, len = this.links.length; i < len; i++) {
        if (this.links[i].name === lc.name) {
          this.showToast('Name ' + lc.name + ' already exists', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
          return
        }
      }
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
    deleteLc (lc) {
      console.log('delete linkConnId:', lc.id)
      axios.delete('https://localhost:8787/api/topology/linkConn/' + lc.id.toString())
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
      let trailsApi = 'https://localhost:8787/api/topology'
      if (this.subnet.id === 0) {
        trailsApi = trailsApi + '/trails'
      } else {
        trailsApi = trailsApi + '/subnet/' + this.subnet.id.toString() + '/trails'
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
      // check if name already exists...
      for (var i = 0, len = this.trails.length; i < len; i++) {
        if (this.trails[i].name === trail.name) {
          this.showToast('Name ' + trail.name + ' already exists', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
          return
        }
      }

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
          this.showItem = false
        })
        .catch(e => {
          console.log(e)
        })
    },

    refresh (type) {
      console.log('refresh ', type)
      this.getSubnetContent()
      this.getTrails()
    },

    getNextNodeName () {
      // this.nodes.sort(function(a, b){return a.name - b.name})
      if (this.nodes.length > 0) {
        const maxNodeNo = this.nodes[this.nodes.length - 1].name.split(':')[1].substring(1)
        this.nextNodeName = this.subnet.name + ':n' + (parseInt(maxNodeNo, 10) + 1)
      } else {
        this.nextNodeName = this.subnet.name + ':n0'
      }
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

    // Prefixes
    setPrefixes () {
      const prefixesApi = 'https://localhost:8787/api/topology/prefixAnns'
      axios.get(prefixesApi)
        .then(response => {
          // console.log('trails: ' + response.data)
          this.processPrefixes(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    processPrefixes (prefixes) {
      if (this.graphNodes.length === 0) {
        return
      }
      let ids = this.nodes[this.nodes.length - 1].id + 1
      // const prefixesMap = new Map()
      prefixes.forEach(p => {
        // prefixesMap.set(ids, p)
        if (this.nodes.some(n => n.id === p.nodeId)) {
          const newNode = { id: ids, name: p.name }
          newNode._color = 'gray'
          this.graphNodes.push(newNode)
          const newLink = {
            sid: p.nodeId,
            tid: ids,
          }
          newLink._color = 'gray'
          this.graphLinks.push(newLink)
          ids += 1
        }
      })
    },
  },
}

</script>
<style lang="stylus">
.topology {
  height: 500px;
  max-height: 800px;
}

</style>
