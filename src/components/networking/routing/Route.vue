<template class="route">
  <div>
    <va-card :title="title">
      <div class="row">
        <div class="flex xs8 md3">
          <va-button small color="info" style="max-width: 100%;" @click="initAddRouteModal">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            Add route
          </va-button>
        </div>
        <div class="flex xs12 lg12">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>Prefix</th>
                <th>Source node</th>
                <th>From node</th>
                <th>Path</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(route, index) in routes" :key="index">
                <td>{{ prefixIdNameMap.get(route.prefix) }}</td>
                <td>{{ nodeIdNameMap.get(route.targetNode) }}</td>
                <td>{{ nodeIdNameMap.get(route.fromNode) }}</td>
                <td>
                  <span>{{ displayPath(route.path) }}</span>
                </td>
                <td>
                  <va-badge small :color="getStatusColor(route.status)">{{ route.status }}</va-badge>
                </td>
                <td>
                  <va-button small color="danger" @click="deleteRoute(route._id)"> Delete </va-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </va-card>

    <va-modal
      v-model="showModal"
      size="large"
      title="Create route"
      hideDefaultActions
    >
      <div class="modal-route">
        <div class="row my-1" v-if="error === '' && nRoute.path.length > 0">
          <va-chip color="info">
            Route from [{{ nRoute.fromNode }}] to [{{ correspNode }}]
          </va-chip>
          <va-chip color="warning">
            Current path: {{ displayPath(nRoute.path) }}
          </va-chip>
        </div>

        <div class="row my-1">
          <va-notification v-if="error != ''" color="danger">
            {{ error }}
          </va-notification>
        </div>

        <div class="row px-1">
          <div class="flex xs12">
            <d3-network
              ref='net'
              :net-nodes="topology.nodes"
              :net-links="topology.links"
              :options="options"
            />
          </div>
        </div>

        <div v-if="!showNextHop && !prefixReached" class="row mt-2">
          <div class="flex xs6 px-1">
            <label class="label"> To prefix </label>
            <va-select
              :label="$t('Select prefix')"
              v-model="nRoute.prefix"
              textBy="description"
              :options="Array.from(prefixNameIdMap.keys())"
            />
          </div>
          <div class="flex xs6 px-1">
            <label class="label"> From node </label>
            <va-select
              :label="$t('Select a node')"
              v-model="nRoute.fromNode"
              textBy="description"
              :options="Array.from(nodeNameIdMap.keys())"
            />
          </div>
        </div>

        <div v-if="!showNextHop && !prefixReached" class="row">
          <div class="flex xs6 px-1">
            <va-chip color="info">
              Source node: {{ correspNode }}
            </va-chip>
          </div>
        </div>

        <div class="row my-1">
          <div class="flex xs6 offset--xs3" v-if="showNextHop">
            <label class="label"> Next hop </label>
            <va-select
              :label="$t('Select node')"
              v-model="selectedNext"
              textBy="description"
              :options="Array.from(nextNodesMap.keys())"
            />
          </div>
        </div>

        <div class="row my-1">
          <va-notification color="success" v-if="prefixReached">
            {{ $t('Prefix reached.') }}
          </va-notification>
        </div>

        <div class="row mt-5">
          <div class="flex xs8 offset--xs4">
            <va-button small color="danger" @click="cancelModal"> Cancel </va-button>
            <va-button disabled small color="info" @click="autoPath" v-if="nRoute.path.length == 0"> Automatic path </va-button>
            <va-button small color="warning" @click="setPath" v-if="nRoute.path.length == 0"> Manual path </va-button>
            <va-button small color="info" @click="nextHop" v-if="showNextHop"> Next hop</va-button>
            <va-button small color="success" @click="createRoute(false)" v-if="prefixReached">   Submit </va-button>
          </div>
        </div>
      </div>
    </va-modal>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'

export default {
  name: 'route',
  props: ['nodes', 'links', 'prefixes', 'routes'],
  components: {
    D3Network,
  },
  data: function () {
    return {
      title: 'Routes',
      showModal: false,
      showNextHop: false,
      prefixReached: false,

      prefixNameIdMap: new Map(),
      prefixIdNameMap: new Map(),
      nodeNameIdMap: new Map(),
      nodeIdNameMap: new Map(),

      nRoute: {
        fromNode: '',
        fromNodeId: '',
        prefix: '',
        prefixId: '',
        nop: '',
        path: [],
        links: [],
      },

      topology: {
        nodes: [],
        links: [],
      },
      selectedNext: '',
      nextNodesMap: new Map(),
      visited: [],
      error: '',
    }
  },
  computed: {
    correspNode: function () {
      if (this.nRoute.prefix === '') {
        return 'undefined'
      }
      const prefixId = this.prefixNameIdMap.get(this.nRoute.prefix)
      const nopId = this.nodeOfPrefix(prefixId)
      return this.nodeIdNameMap.get(nopId)
    },
    options () {
      return {
        force: 2000,
        size: { w: 500, h: 200 },
        nodeSize: 20,
        nodeLabels: true,
        linkLabels: false,
        canvas: false,
        linkWidth: 3,
        fontSize: 11,
      }
    },
  },
  created () {},
  watch: {
    prefixes: {
      handler: function () {
        this.updatePrefixMap()
      },
      deep: true,
    },
    nodes: {
      handler: function () {
        this.updateNodeMap()
      },
      deep: true,
    },
  },
  methods: {
    processGraph () {
      this.topology.nodes = []
      this.topology.links = []
      this.nodes.forEach(node => {
        const newNode = {
          id: node._id,
          name: node.name,
        }
        this.topology.nodes.push(newNode)
      })
      this.links.forEach(link => {
        const newLink = {
          id: link._id,
          sid: link.source,
          tid: link.target,
        }
        this.topology.links.push(newLink)
      })
    },
    displayPath (path) {
      const arrayPath = []
      path.forEach(n => {
        arrayPath.push(this.nodeIdNameMap.get(n))
      })
      return arrayPath.join(' > ')
    },
    updatePrefixMap () {
      this.prefixNameIdMap.clear()
      this.prefixIdNameMap.clear()
      this.prefixes.forEach(prefix => {
        this.prefixNameIdMap.set(prefix.name, prefix._id)
        this.prefixIdNameMap.set(prefix._id, prefix.name)
      })
    },
    updateNodeMap () {
      this.nodeNameIdMap.clear()
      this.nodeIdNameMap.clear()
      this.nodes.forEach(node => {
        this.nodeNameIdMap.set(node.name, node._id)
        this.nodeIdNameMap.set(node._id, node.name)
      })
    },
    initAddRouteModal () {
      this.nRoute.fromNode = ''
      this.nRoute.fromNodeId = ''
      this.nRoute.prefix = ''
      this.nRoute.prefixId = ''
      this.nRoute.path = []
      this.nRoute.links = []

      this.visited = []
      this.error = ''

      this.showNextHop = false
      this.prefixReached = false

      this.processGraph()
      this.showModal = true
    },
    setPath () {
      this.error = ''
      this.nRoute.fromNodeId = this.nodeNameIdMap.get(this.nRoute.fromNode)
      this.nRoute.prefixId = this.prefixNameIdMap.get(this.nRoute.prefix)
      this.nRoute.nop = this.nodeOfPrefix(this.nRoute.prefixId)

      if (this.nRoute.nop === this.nRoute.fromNodeId) {
        this.error = 'Selected From node is the source node'
        return
      }
      // start path
      this.nRoute.path.push(this.nRoute.fromNodeId)
      this.computeNextNodes(this.nRoute.fromNodeId)

      if (this.nextNodesMap.size === 0) {
        this.showNextHop = false
        this.error = 'Prefix is not reachable from selected node'
        return
      }

      if (Array.from(this.nextNodesMap.values()).includes(this.nRoute.nop)) {
        // add the unique link
        this.nRoute.links.push(this.getLink(this.nRoute.fromNodeId, this.nRoute.nop))

        this.nRoute.path.push(this.nRoute.nop)
        this.prefixReached = true
        this.showNextHop = false
        return
      }
      this.visited.push(this.nRoute.fromNodeId)
      this.selectedNext = ''
      this.showNextHop = true
    },
    nextHop () {
      this.error = ''

      // get last node as source
      const source = this.nRoute.path[this.nRoute.path.length - 1]
      // selectedNodeId is target
      const selectedNodeId = this.nextNodesMap.get(this.selectedNext)
      // get link for (source, selectedNodeId) and add it to links
      this.nRoute.links.push(this.getLink(source, selectedNodeId))

      // push new node
      this.nRoute.path.push(selectedNodeId)
      this.visited.push(selectedNodeId)

      this.computeNextNodes(selectedNodeId)
      if (this.nextNodesMap.size === 0) {
        this.showNextHop = false
        this.error = 'Prefix is not reachable from selected node'
        return
      }

      if (Array.from(this.nextNodesMap.values()).includes(this.nRoute.nop)) {
        // add last link
        this.nRoute.links.push(this.getLink(selectedNodeId, this.nRoute.nop))

        this.nRoute.path.push(this.nRoute.nop)
        this.prefixReached = true
        this.showNextHop = false
        return
      }
      this.selectedNext = ''
    },
    autoPath () {
      this.error = ''
      this.nRoute.fromNodeId = this.nodeNameIdMap.get(this.nRoute.fromNode)
      this.nRoute.prefixId = this.prefixNameIdMap.get(this.nRoute.prefix)
      this.nRoute.nop = this.nodeOfPrefix(this.nRoute.prefixId)

      if (this.nRoute.nop === this.nRoute.fromNodeId) {
        this.error = 'Source node and From node are the same'
        return
      }
      this.createRoute(true)
    },
    createRoute (autoPath) {
      if (this.nRoute.prefixId === '') {
        this.error = 'Prefix not specified'
        return
      }
      if (this.nRoute.fromNode === '') {
        this.error = 'From node not specified'
        return
      }

      const message = {
        action: '',
        params: {
          prefix: this.nRoute.prefixId,
          fromNode: this.nRoute.fromNodeId,
          targetNode: this.nRoute.nop,
        },
      }
      if (autoPath) {
        message.action = 'add_auto_route'
      } else {
        if (this.nRoute.path.length === 0) {
          this.error = 'Path not specified'
          return
        }
        message.action = 'add_route'
        message.params.path = this.nRoute.path
        message.params.links = this.nRoute.links
      }

      const context = this
      this.$eventBus.send('nms.routing', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach routing service', err)
          context.showToast('Failed to reach routing service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to create route', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Route created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModal = false
      this.cancelModal()
    },

    cancelModal () {
      this.error = ''
      this.nextNodesMap.clear()
      this.showModal = false
    },

    deleteRoute (id) {
      const message = {
        action: 'del_route',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.routing', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach routing service', err)
          context.showToast('Failed to reach routing service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to delete route', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Route deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    nodeOfPrefix (id) {
      let node = ''
      this.prefixes.forEach(p => {
        if (p._id === id) {
          node = p.node
          return node
        }
      })
      return node
    },
    computeNextNodes (node) {
      this.nextNodesMap.clear()
      this.links.forEach(link => {
        if (link.source === node) {
          if (!this.visited.includes(link.target)) {
            // nextNodes.push(link.target)
            const nodeName = this.nodeIdNameMap.get(link.target)
            this.nextNodesMap.set(nodeName, link.target)
          }
        } else if (link.target === node) {
          if (!this.visited.includes(link.source)) {
            // nextNodes.push(link.source)
            const nodeName = this.nodeIdNameMap.get(link.source)
            this.nextNodesMap.set(nodeName, link.source)
          }
        }
      })
    },
    getLink (source, target) {
      let linkId = ''
      this.links.forEach(link => {
        if ((link.source === source) && (link.target === target)) {
          linkId = link._id
          return linkId
        } else if ((link.source === target) && (link.target === source)) {
          linkId = link._id
          return linkId
        }
      })
      return linkId
    },

    getStatusColor (status) {
      if (status === 'pending') {
        return 'danger'
      }
      return 'success'
    },
  },

}
</script>
<style lang="scss">
.modal-route {
  width: 600px;
  max-width: 600px;
}
</style>
