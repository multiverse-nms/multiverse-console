<template>
  <div>
    <div class="row row-equal">
      <div class="flex lg12">
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
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      hideDefaultActions
    >
      <node-item v-if="type === 1" :node="selectedNode" :onEdit="initEditNode" :onDelete="deleteNode" @refresh="refresh" />
      <link-item v-if="type === 2" :link="selectedLink" :onEdit="initEditLink" :onDelete="deleteLink" @refresh="refresh"/>
      <link-conn-item v-if="type === 3" :linkConn="selectedLc" :onEdit="initEditLc" :onDelete="deleteLc" @refresh="refresh" />
      <conn-item v-if="type === 4" :conn="selectedConn" :onEdit="initEditConn" :onDelete="deleteConn" @refresh="refresh" />
    </va-modal>

    <create-node @onOk="postNode" @onCancel="showCreateNode = false" :show="showCreateNode" :subnetId="subnet.id" />
    <create-link @onOk="postLink" @onCancel="showCreateLink = false" :show="showCreateLink"/>
    <create-link-conn @onOk="postLc" @onCancel="showCreateLc = false" :show="showCreateLc" :linkId="0"/>
    <create-conn @onOk="postConn" @onCancel="showCreateConn = false" :show="showCreateConn" :type="kind" />

  </div>
</template>

<script>
import axios from 'axios'
import { getStatusColor } from '../../../../assets/icons/colors.js'
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import LinkItem from '../Link/LinkItem'
import CreateLink from '../Link/CreateLink.vue'
import LinkConnItem from '../LinkConn/LinkConnItem.vue'
import CreateLinkConn from '../LinkConn/CreateLinkConn.vue'
import NodeItem from '../Node/NodeItem.vue'
import CreateNode from '../Node/CreateNode.vue'
import ConnItem from '../Conn/ConnItem.vue'
import CreateConn from '../Conn/CreateConn.vue'

export default {
  name: 'subnet-item',
  props: ['subnet', 'onEdit', 'onDelete'],
  components: {
    D3Network,
    LinkItem,
    LinkConnItem,
    NodeItem,
    ConnItem,
    CreateNode,
    CreateLink,
    CreateLinkConn,
    CreateConn,
  },
  data: function () {
    return {
      tTopology: 'Topology',

      kind: 'link',
      kindOptions: [
        { label: 'PHY', value: 'link' },
        { label: 'MAC', value: 'lc' },
        { label: 'IP', value: 'IPv4' },
        { label: 'NDN', value: 'NDN' },
        { label: 'UDP', value: 'UDP' },
      ],

      nodes: [],
      links: [],
      pas: [],

      graphNodes: [],
      graphLinks: [],

      type: 0,
      showItem: false,
      selectedNode: {},
      selectedLink: {},
      selectedLc: {},
      selectedConn: {},

      showCreateNode: false,
      showCreateLink: false,
      showCreateLc: false,
      showCreateConn: false,
    }
  },
  created () {
    this.getSubnetContent()
  },
  computed: {
    options () {
      return {
        force: 2000,
        nodeSize: 80,
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
      const api = this.$apiURI + '/topology/'
      const nodesApi = api + 'node'
      let linksApi = ''
      if (this.kind === 'link' || this.kind === 'lc') {
        linksApi = api + this.kind
      } else {
        linksApi = api + 'connection/type/' + this.kind
      }

      axios.get(nodesApi)
        .then(response => {
          this.nodes = response.data
          axios.get(linksApi)
            .then(response => {
              this.links = response.data
              if (this.kind === 'NDN') {
                axios.get(api + 'pa')
                  .then(response => {
                    this.pas = response.data
                    this.processGraph()
                  })
                  .catch(e => {
                    // console.log(e)
                  })
              } else {
                this.pas = []
                this.processGraph()
              }
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    processGraph () {
      this.graphNodes = []
      this.graphLinks = []
      this.nodes.forEach(node => {
        const numPas = this.pas.reduce((n, pa) => n + (pa.originId === node.id), 0)
        let pasLabel = ''
        if (numPas > 0) {
          let p = 'prefix'
          if (numPas > 1) {
            p += 'es'
          }
          pasLabel = '\n[' + numPas + ' ' + p + ']'
        }
        const newNode = {
          id: node.id,
          name: node.name + pasLabel,
          pinned: true,
          fixed: true,
          fx: node.posx,
          fy: node.posy,
        }
        /* if (node.type === 'fwd') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } else if (node.type === 'switch') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } */
        newNode._color = getStatusColor(node.status)
        newNode._labelClass = 'node-label'
        this.graphNodes.push(newNode)
      })
      this.links.forEach(link => {
        const newLink = {
          id: link.id,
          sid: link.srcVnodeId,
          tid: link.destVnodeId,
        }
        newLink._color = getStatusColor(link.status)
        this.graphLinks.push(newLink)
      })
    },

    // CRUD Node
    getNode (id) {
      this.showItem = false
      const nodeApi = this.$apiURI + '/topology/node/' + id.toString()
      const ltpsApi = this.$apiURI + '/topology/node/' + id.toString() + '/ltps'
      const pasApi = this.$apiURI + '/topology/node/' + id.toString() + '/pas'
      axios.get(nodeApi)
        .then(response => {
          this.selectedNode = response.data
          axios.get(ltpsApi)
            .then(response => {
              this.selectedNode.vltps = response.data
              axios.get(pasApi)
                .then(response => {
                  this.selectedNode.pas = response.data
                  this.showItem = true
                  this.type = 1
                })
                .catch(e => {
                  // console.log(e)
                })
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    initCreateNode () {
      this.showCreateNode = true
    },
    postNode (node) {
      axios.post(this.$apiURI + '/topology/node', node, {
        headers: {},
      })
        .then(response => {
          this.showToast('Node ' + node.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getSubnetContent()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Node creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreateNode = false
    },
    initEditNode (node) {},
    updateNode (node) {
      axios.put(this.$apiURI + '/topology/node/' + node.id, node, {
        headers: {},
      })
        .then(response => {
          this.showToast('Node ' + node.name + ' updated', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getSubnetContent()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Failed to update node', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
    },
    deleteNode (id) {
      axios.delete(this.$apiURI + '/topology/node/' + id.toString())
        .then(response => {
          this.getSubnetContent()
          this.$emit('refresh', 'topology.node')
          this.showItem = false
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // CRUD Link
    getLink (id) {
      this.showItem = false
      const linkApi = this.$apiURI + '/topology/link/' + id.toString()
      const lcsApi = this.$apiURI + '/topology/link/' + id.toString() + '/lcs'
      axios.get(linkApi)
        .then(response => {
          this.selectedLink = response.data
          axios.get(lcsApi)
            .then(response => {
              this.selectedLink.vlcs = response.data
              this.showItem = true
              this.type = 2
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    postLink (link) {
      axios.post(this.$apiURI + '/topology/link', link, {
        headers: {},
      })
        .then(response => {
          this.showToast('Link ' + link.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getSubnetContent()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Link creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreateLink = false
    },
    initEditLink (link) {},
    patchLink (link) {},
    deleteLink (link) {
      axios.delete(this.$apiURI + '/topology/link/' + link.id.toString())
        .then(response => {
          this.getSubnetContent()
          this.$emit('refresh', 'topology.link')
          this.showItem = false
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // CRUD LinkConn
    getLc (id) {
      this.showItem = false
      const lcApi = this.$apiURI + '/topology/lc/' + id.toString()
      axios.get(lcApi)
        .then(response => {
          this.selectedLc = response.data
          this.showItem = true
          this.type = 3
        })
        .catch(e => {
          // console.log(e)
        })
    },
    postLc (lc) {
      axios.post(this.$apiURI + '/topology/lc', lc, {
        headers: {},
      })
        .then(response => {
          this.showToast('LinkConn ' + lc.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.$emit('refresh', 'topology.face')
          this.getSubnetContent()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('LinkConn creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreateLc = false
    },
    initEditLc (lc) {},
    deleteLc (lc) {
      axios.delete(this.$apiURI + '/topology/lc/' + lc.id.toString())
        .then(response => {
          this.getSubnetContent()
          this.$emit('refresh', 'topology.lc')
          this.showItem = false
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // CRUD Conn
    getConn (id) {
      this.showItem = false
      const connApi = this.$apiURI + '/topology/connection/' + id.toString()
      axios.get(connApi)
        .then(response => {
          this.selectedConn = response.data
          this.showItem = true
          this.type = 4
        })
        .catch(e => {
          // console.log(e)
        })
    },
    postConn (conn) {
      axios.post(this.$apiURI + '/topology/connection', conn, {
        headers: {},
      })
        .then(response => {
          this.showToast('Connection ' + conn.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.$emit('refresh', 'topology.face')
          this.getSubnetContent()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Connection creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreateConn = false
    },
    initEditConn (conn) {},
    deleteConn (conn) {
      axios.delete(this.$apiURI + '/topology/connection/' + conn.id.toString())
        .then(response => {
          this.getSubnetContent()
          this.$emit('refresh', 'topology.conn')
          this.showItem = false
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // for both link and lc
    initCreateLink () {
      if (this.kind === 'link') {
        this.showCreateLink = true
      } else if (this.kind === 'lc') {
        this.showCreateLc = true
      } else {
        this.showCreateConn = true
      }
    },

    nodeClick (event, node) {
      const sNode = this.nodes.find(x => x.id === node.id)
      const dist = Math.sqrt(Math.pow(sNode.posx - node.fx, 2) + Math.pow(sNode.posy - node.fy, 2))
      if (dist < 10) {
        this.getNode(node.id)
      } else {
        if (confirm('Move node?')) {
          sNode.posx = node.fx
          sNode.posy = node.fy
          this.updateNode(sNode)
        } else {
          this.processGraph()
        }
      }
    },
    linkClick (event, link) {
      if (this.kind === 'link') {
        this.getLink(link.id)
      } else if (this.kind === 'lc') {
        this.getLc(link.id)
      } else {
        this.getConn(link.id)
      }
    },

    refresh (type) {
      this.$emit('refresh', type)
      this.getSubnetContent()
    },

    getNextNodeName () {
      /* if (this.nodes.length > 0) {
        const maxNodeNo = this.nodes[this.nodes.length - 1].name.split(':')[1].substring(1)
        this.nextNodeName = this.subnet.name + ':n' + (parseInt(maxNodeNo, 10) + 1)
      } else {
        this.nextNodeName = this.subnet.name + ':n0'
      } */
    },
  },
}

</script>
<style lang="stylus">
.topology {
  height: 500px;
  max-height: 500px;
}

.net-svg {
  width: 100%;
  height: 100%;
}

.node-label {
  white-space: pre-line;
  margin: 0 0 0 -20px;
}

</style>
