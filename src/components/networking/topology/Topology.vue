<template>
  <div>
    <va-card :title="title">
      <div class="tools">
        <ul>
          <li v-for="(t,to) in tools" :key="t.tip">
            <va-button small  color="info" @click='setTool(to)' >
              <span  class="fa fa-mouse-pointer" aria-hidden="true"></span>{{ tools[to].tip }}
            </va-button>
          </li>
          <li>
            <va-button color="info" small @click="createNodeModal()" > <i class="fa fa-plus-circle" aria-hidden="true"></i> Create node  </va-button>
            <va-button color="info" small @click="createLinkModal()" > <i class="fa fa-plus-circle" aria-hidden="true"></i> Create link </va-button>
          </li>
        </ul>
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
        <selection
          v-if="showSelection"
          @action="selectionEvent"
          :type="selectedType"
          :data="selectedData"/>
      </div>
    </va-card>

    <div class="modal-mask" v-if="showModalNode" >
      <div class="modal-wrapper">
        <div class="modal-container">
          <section class="form">
            <h3 class="title is-7"> Add node </h3>
            <va-separator />
            <va-notification v-if="required.length">
              {{ $t('Correct the following error(s): ') }}
              <ul>
                <li v-for="(error, index) in required" :key="index">{{ error }}</li>
              </ul>
            </va-notification>
            <div class="row">
              <div class="flex md6 xs12">
                <label class="label">Name:</label>
                <va-input placeholder="e.g., /nist/nms/node1" v-model="nNode.name"/>
              </div>
              <div class="flex md6 xs12">
                <label class="label">Agent:</label>
                <va-input placeholder="e.g., agent-n1" v-model="nNode.agent"/>
              </div>
              <div class="flex  xs12">
                <label class="label">Interfaces:</label>
                <va-input placeholder="e.g., eth0,eth1,eth2" v-model="nNode.itfs"/>
              </div>
            </div>
            <div class="row">
              <div class="flex xs6 md6 offset--md6  ">
                <va-button  small color="danger" @click="cancelModal"> Cancel </va-button>
                <va-button  small  @click="addNode"> Submit </va-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div class="modal-mask" v-if="showModalLink" >
      <div class="modal-wrapper">
        <div class="modal-container">
          <section class="form">
            <h3 class="title is-7"> Add link </h3>
            <va-separator />
            <div class="row">
              <va-notification v-if="alert">
                {{ $t('Source and target must be different') }}
              </va-notification>
              <div class="flex md6 xs12" >
                <label class="label">Source node:</label>
                <va-select
                  :label="$t('Select source node') "
                  style=" color: rgb(64, 183, 229);"
                  v-model="nLink.source"
                  textBy="source"
                  :options="getNodeNames()"
                />
              </div>
              <div class="flex md6 xs12" >
                <label class="label">Target node:</label>
                <va-select
                  :label="$t('Select target node')"
                  style=" color: rgb(64, 183, 229);"
                  v-model="nLink.target"
                  textBy="target"
                  :options="getNodeNames()"
                />
              </div>
            </div>
            <div class="row">
              <div class="flex xs6 md6 offset--md6">
                <va-button small color="danger"  @click="cancelModal"> Cancel </va-button>
                <va-button small  @click="addLink"> Submit </va-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import Selection from './Selection.vue'

export default {
  name: 'topology',
  props: ['topology'],
  components: {
    D3Network,
    Selection,
  },
  data: function () {
    return {
      title: 'Network topology',

      graphNodes: [],
      graphLinks: [],
      nodeToIdMap: null,

      selectedType: '',
      selectedData: {},
      showSelection: false,

      // to add node
      showModalNode: false,
      nNode: {
        name: '',
        agent: '',
        itfs: '',
        status: '',
      },

      // to add link
      showModalLink: false,
      nLink: {
        source: '',
        target: '',
        status: '',
      },

      required: [],
      alert: false,
      nodeSize: 35,
      linkWidth: 3,
      canvas: false,
      tools: {
        pointer: {
          tip: 'Select',
        },
      },
    }
  },
  created () {
    this.reset()
  },

  computed: {
    options () {
      return {
        force: 5000,
        size: { w: 1000, h: 400 },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        linkLabels: false,
        canvas: this.canvas,
        linkWidth: this.linkWidth,
        fontSize: 11,
      }
    },
  },
  watch: {
    topology: {
      handler: function () {
        this.processGraph()
      },
      deep: true,
    },
  },
  methods: {
    // 1: we draw the graph
    processGraph () {
      this.nodeToIdMap = new Map()
      this.graphNodes = []
      this.graphLinks = []
      this.topology.nodes.forEach(node => {
        const newNode = { id: node._id, name: node.name }
        this.nodeToIdMap.set(node.name, node._id)
        /* if ( node.agent != '' ) {
          newNode = Object.assign(node, { svgSym: icon.nodeIcon5, svgIcon: null, svgObj: null })
        } else {
          newNode = Object.assign(node, {svgSym: icon.nodeIcon4, svgIcon: null, svgObj: null })
        } */
        if (node.status === 'operational') {
          newNode._color = 'green'
        } else if (node.status === 'pending') {
          newNode._color = '#ff5349'
        } else {
          newNode._color = 'yellow'
        }
        this.graphNodes.push(newNode)
      })

      this.topology.links.forEach(link => {
        const newLink = {
          id: link._id,
          sid: link.source,
          tid: link.target,
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

    // 2: we can select nodes/links
    nodeClick (event, node) {
      this.selectedType = 'node'
      this.setNodeDetails(node.id)
    },
    linkClick (event, link) {
      this.selectedType = 'link'
      this.setLinkDetails(link.id)
    },

    // get detailsfrom local topology object
    // TODO: get details from topology service
    setNodeDetails (id) {
      this.topology.nodes.forEach(node => {
        if (node._id === id) {
          this.selectedData = node
          this.showSelection = true
        }
      })
    },
    setLinkDetails (id) {
      this.topology.links.forEach(link => {
        if (link._id === id) {
          this.selectedData = link
          this.showSelection = true
        }
      })
    },

    // 3: handle child component: selection
    selectionEvent (action, args) {
      switch (action) {
        case 'close':
          this.selected = {}
          this.showSelection = false
          break
        case 'delete-node':
          this.selected = {}
          this.showSelection = false
          this.removeNode(args[0])
          break
        case 'delete-link':
          this.selected = {}
          this.showSelection = false
          this.removeLink(args[0])
          break
        default:
          break
      }
    },

    // 4: Nodes
    createNodeModal () {
      this.nNode = {
        name: '',
        agent: '',
        itfs: '',
        status: '',
      }
      this.showModalNode = true
    },
    addNode () {
      const itfsArray = this.nNode.itfs.split(',')
      this.nNode.itfs = itfsArray
      const message = {
        action: 'add_node',
        params: this.nNode,
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
          context.showToast('Failed: cannot reach topology service', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed: node not created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node successfuly created', {
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
          console.log('Error in sending message', err)
          context.showToast('Failed: cannot reach topology service', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed: node not deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node successfuly deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    // 5: Links
    createLinkModal () {
      this.showModalLink = true
    },
    addLink () {
      if (this.nLink.source === this.nLink.target) {
        this.alert = true
      } else {
        const message = {
          action: 'add_link',
          params: {
            source: this.nodeToIdMap.get(this.nLink.source),
            target: this.nodeToIdMap.get(this.nLink.target),
          },
        }
        const context = this
        this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
          if (err) {
            console.log('Error in sending message', err)
            context.showToast('Failed: cannot reach topology service', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            const repBody = reply.body
            if (repBody.error) {
              console.error(repBody.error)
              context.showToast('Failed: link not created', {
                icon: 'fa-check',
                position: 'top-right',
                duration: 10000,
              })
            } else {
              context.showToast('Link successfuly created', {
                icon: 'fa-check',
                position: 'top-right',
                duration: 10000,
              })
            }
          }
        })
        this.showModalLink = false
      }
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
          console.log('Error in sending message', err)
          context.showToast('Failed: cannot reach topology service', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed: link not deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Link successfuly deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    cancelModal () {
      this.showModalNode = false
      this.showModalLink = false
      this.required.length = 0
    },

    setTool (tool) {
    },

    // util methods
    getNodeNames () {
      const nodeArray = []
      this.graphNodes.forEach(node => {
        nodeArray.push(node.name)
      })
      return nodeArray
    },
    reset () {
      this.selected = { type: 'none' }
    },
  },
}

</script>
<style lang="stylus">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 650px;
  margin: 0 auto;
  padding: 20px 50px;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-default-button {
  float: left;
  position: absolute;
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
