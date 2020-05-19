<template>
  <div>
    <va-card :title="title">
      <va-button-toggle
        small
        outline
        v-model="kind"
        :options="kindOptions"
        color="success"
      />
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

      <div class="tools">
        <ul>
          <li>
            <va-button color="info" small @click="setSelectTool()" > <i class="fa fa-mouse-pointer" aria-hidden="true"></i> Select</va-button>
            <va-button color="info" small @click="createNodeModal()" > <i class="fa fa-plus-circle" aria-hidden="true"></i> Create node  </va-button>
            <va-button color="info" small @click="createLinkModal()" > <i class="fa fa-plus-circle" aria-hidden="true"></i> Create link </va-button>
          </li>
        </ul>
      </div>
    </va-card>
    <node-details :node="nodeDetails" />
    <link-details :link="linkDetails" />

    <!-- va-modal
      v-model="showModalNode"
      size="large"
      title="Create node"
      hideDefaultActions
    >
      <div class="modal-node">
        <div class="row">
          <va-notification color="danger" v-if="error != ''">
            {{ error }}
          </va-notification>
        </div>

        <div class="row">
          <div class="flex xs12">
            <label class="label">Node name</label>
            <va-input placeholder="e.g., /nist/nms/node1" v-model="nNode.name"/>
          </div>
        </div>
        <div class="row">
          <div class="flex xs12">
            <label class="label">Agent name</label>
            <va-input placeholder="e.g., agent-n1" v-model="nNode.agent"/>
          </div>
        </div>
        <div class="row">
          <div class="flex xs12">
            <label class="label">Interfaces</label>
            <va-input placeholder="e.g., eth0,eth1,eth2" v-model="nNode.itfs"/>
          </div>
        </div>

        <div class="row mt-5">
          <div class="flex xs6 offset--xs6">
            <va-button  small color="danger" @click="cancelModal"> Cancel </va-button>
            <va-button  small  @click="addNode"> Submit </va-button>
          </div>
        </div>
      </div>
    </va-modal -->

    <!-- va-modal
      v-model="showModalLink"
      size="large"
      title="Create link"
      hideDefaultActions
    >
      <div class="modal-link">
        <div class="row">
          <va-notification v-if="error != ''" color="danger">
            {{ error }}
          </va-notification>
        </div>

        <div class="row">
          <div class="flex xs6 px-1" >
            <div class="row">
              <label class="label">Source node</label>
              <va-select
                :label="$t('Select source node') "
                v-model="nLink.source"
                textBy="source"
                :options="getNodeNames()"
              />
            </div>
            <div class="row" >
              <label class="label">Source interface</label>
              <va-select
                :label="$t('Select source interface') "
                v-model="nLink.sourceItf"
                textBy="sInterface"
                :options="sourceInterfaces"
              />
            </div>
          </div>

          <div class="flex xs6 px-1" >
            <div class="row">
              <label class="label">Target node</label>
              <va-select
                :label="$t('Select target node')"
                v-model="nLink.target"
                textBy="target"
                :options="getNodeNames()"
              />
            </div>
            <div class="row">
              <label class="label">Target interface</label>
              <va-select
                :label="$t('Select target interface')"
                v-model="nLink.targetItf"
                textBy="tInterface"
                :options="targetInterfaces"
              />
            </div>
          </div>
        </div>

        <div class="row mt-5">
          <div class="flex xs6 offset--xs6">
            <va-button small color="danger"  @click="cancelModal"> Cancel </va-button>
            <va-button small  @click="addLink"> Submit </va-button>
          </div>
        </div>
      </div>
    </va-modal -->
  </div>
</template>

<script>
import icons from '../../../assets/icons/graph-icons.json'
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import LinkDetails from './LinkDetails.vue'
import NodeDetails from './NodeDetails.vue'

export default {
  name: 'topology',
  props: ['topology', 'prefixes'],
  components: {
    D3Network,
    LinkDetails,
    NodeDetails,
  },
  data: function () {
    return {
      title: 'Network topology',
      kindOptions: [
        { label: 'Link', value: 'links' },
        { label: 'LinkConn', value: 'linkConns' },
      ],
      kind: 'links',

      graphNodes: [],
      graphLinks: [],

      // graphPrfxNodes: [],
      // graphPrfxLinks: [],

      nodeDetails: {},
      linkDetails: {},

      showModalNode: false,
      nNode: {
        name: '',
        agent: '',
        itfs: '',
        status: '',
      },

      showModalLink: false,
      nLink: {
        source: '',
        target: '',
        sInterface: '',
        tInterface: '',
        status: '',
      },

      error: '',
    }
  },
  created () {
    this.reset()
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
    kind: {
      handler: function () {
        this.processGraph()
      },
    },
    topology: {
      handler: function () {
        this.processGraph()
      },
      deep: true,
    },
    prefixes: {
      handler: function () {
      },
      deep: true,
    },
    /* 'nLink.source': function (newVal, oldVal) {
      const id = this.nodeToIdMap.get(newVal)
      this.sourceInterfaces = this.nodes.get(id)
      this.nLink.sourceItf = ''
    },
    'nLink.target': function (newVal, oldVal) {
      const id = this.nodeToIdMap.get(newVal)
      this.targetInterfaces = this.nodes.get(id)
      this.nLink.targetItf = ''
    }, */
  },
  methods: {
    getNode (id) {
      const message = {
        action: 'get_nodes',
        params: {
          node_ids: [id],
          level: 2,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to get node details', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.nodeDetails = repBody.content.docs[0]
          }
        }
      })
    },
    processGraph () {
      this.graphNodes = []
      this.graphLinks = []
      this.topology.nodes.forEach(node => {
        let newNode = { id: node._id, name: node._id }
        if (node.type === 'fwd') {
          newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
        } else if (node.type === 'switch') {
          newNode = Object.assign(newNode, { svgSym: icons.switchIcon, svgIcon: null, svgObj: null })
        }
        if (node.status === 'operational') {
          newNode._color = 'green'
        } else if (node.status === 'pending') {
          newNode._color = '#ff5349'
        } else {
          newNode._color = 'yellow'
        }
        this.graphNodes.push(newNode)
      })
      this.topology[this.kind].forEach(link => {
        const newLink = {
          id: link._id,
          sid: link.sourceNode,
          tid: link.destNode,
        }
        if (link.status === 'operational') {
          newLink._color = 'green'
        } else if (link.status === 'pending') {
          newLink._color = '#ff5349'
        } else {
          newLink._color = 'yellow'
        }
        this.graphLinks.push(newLink)
      })
    },
    processPrefixes () {
      /* if (this.graphNodes.length === 0) {
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
      }) */
    },
    nodeClick (event, node) {
      this.getNode(node.id)
    },
    linkClick (event, link) {
      this.getLink(link.id)
    },
    getLink (id) {
      let act = 'get_linkconn'
      if (this.kind === 'links') {
        act = 'get_link'
      }
      const message = {
        action: act,
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to get link details', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.linkDetails = repBody.content
          }
        }
      })
    },
    selectionEvent (action, args) {
      switch (action) {
        case 'close':
          this.showSelection = false
          break
        case 'delete-node':
          this.showSelection = false
          this.removeNode(args[0])
          break
        case 'delete-link':
          this.showSelection = false
          this.removeLink(args[0])
          break
        default:
          break
      }
    },

    createNodeModal () {
      this.nNode = {
        name: '',
        agent: '',
        itfs: '',
        status: '',
      }
      this.error = ''
      this.showModalNode = true
    },
    addNode () {
      if (this.nNode.name === '') {
        this.error = 'Node name not specified'
        return
      }
      const itfsArray = this.nNode.itfs.split(',')
      if (itfsArray.length === 0) {
        this.error = 'Interfaces not specified'
        return
      }
      this.nNode.itfs = itfsArray
      const message = {
        action: 'add_node',
        params: { node: this.nNode },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to create node', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModalNode = false
    },
    removeNode (id) {
      const message = {
        action: 'del_node',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to delete node', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    createLinkModal () {
      this.nLink = {
        source: '',
        target: '',
        sourceItf: '',
        targetItf: '',
      }
      this.error = ''
      this.showModalLink = true
    },
    addLink () {
      if ((this.nLink.sourceItf === '') & (this.nLink.targetItf === '')) {
        this.error = 'Interfaces not specified'
        return
      }
      if (this.nLink.source === this.nLink.target) {
        this.error = 'Source and target must be different'
        return
      }
      const sourceId = this.nodeToIdMap.get(this.nLink.source)
      const targetId = this.nodeToIdMap.get(this.nLink.target)
      if (this.findLink(sourceId, targetId)) {
        this.error = 'Link already exists'
        return
      }
      const message = {
        action: 'add_link',
        params: {
          source: sourceId,
          target: targetId,
          sourceItf: this.nLink.sourceItf,
          targetItf: this.nLink.targetItf,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to create link', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Link created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModalLink = false
    },
    findLink (source, target) {
      let result = false
      this.topology.links.forEach(link => {
        if ((link.source === (source || target)) && (link.target === (target || source))) {
          result = true
          return result
        }
      })
      return result
    },
    // remove Link
    removeLink (id) {
      const message = {
        action: 'del_link',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to delete link', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Link deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    cancelModal () {
      this.error = ''
      this.showModalNode = false
      this.showModalLink = false
    },

    setSelectTool () {
    },

    reset () {
    },
  },
}

</script>
<style lang="stylus">
.modal-node {
  width: 500px;
  max-width: 500px;
}

.modal-link {
  width: 500px;
  max-width: 500px;
}

.title.is-7 {
  font-size: 1.5rem;
  text-align: center;
}

.title {
  color: #6699cc;
  font-size: 0.625rem;
  letter-spacing: 0.6px;
  line-height: 1.6;
  font-weight: bold;
  text-transform: uppercase;
}

.va-select__label {
  color: red;
}

.topology {
  max-height: 500px;
}

</style>
