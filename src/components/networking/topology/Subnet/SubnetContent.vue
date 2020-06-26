<template>
  <div>
    <div class="row">
      <div class="flex xs12">
        <va-card :title="title">
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
                  <va-button color="warning" small @click="initCreateNode()" >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Create node
                  </va-button>
                  <va-button color="warning" small @click="initCreateLink()" >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Create {{ kind }}
                  </va-button>
                </li>
              </ul>
            </div>
          </div>
        </va-card>
      </div>
    </div>

    <div class="row">
      <div class="flex xs12">
        <va-card :title="title">
          <div class="row mt-1">
            <va-button small color="warning" @click="initCreateTrail">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create trail
            </va-button>
          </div>
          <div class="row">
            <trail-content :subnetId="subnetId" @refresh="refresh"/>
          </div>
        </va-card>
      </div>
    </div>

    <node-content :nodeId="selectedNodeId" @onClose="close" @refresh="refresh" />
    <link-content :linkId="selectedLinkId" @onClose="close" @refresh="refresh"/>
    <link-conn-content :linkConnId="selectedLcId" @onClose="close" @refresh="refresh" />

    <create-node @onOk="nodeCreated" @onCancel="showCreateNode = false" :show="showCreateNode" />
    <create-link @onOk="linkCreated" @onCancel="showCreateLink = false" :show="showCreateLink"/>
    <create-link-conn @onOk="linkConnCreated" @onCancel="showCreateLc = false" :show="showCreateLc"/>
    <create-trail @onOk="trailCreated" @onCancel="showCreateTrail = false" :show="showCreateTrail" />

  </div>
</template>

<script>
// import axios from 'axios'
// import icons from '../../../assets/icons/graph-icons.json'

import D3Network from 'vue-d3-network/src/vue-d3-network.vue'
import LinkContent from '../Link/LinkContent'
import CreateLink from '../Link/CreateLink.vue'
import LinkConnContent from '../LinkConn/LinkConnContent.vue'
import CreateLinkConn from '../LinkConn/CreateLinkConn.vue'
import NodeContent from '../Node/NodeContent.vue'
import CreateNode from '../Node/CreateNode.vue'
import TrailContent from '../Trail/TrailContent.vue'
import CreateTrail from '../Trail/CreateTrail.vue'

export default {
  name: 'subnet-content',
  props: ['subnetId'],
  components: {
    D3Network,
    LinkContent,
    LinkConnContent,
    NodeContent,
    TrailContent,
    CreateTrail,
    CreateNode,
    CreateLink,
    CreateLinkConn,
  },
  data: function () {
    return {
      title: 'Topology',

      kind: 'link',
      kindOptions: [
        { label: 'Physical', value: 'link' },
        { label: 'Logical', value: 'linkConn' },
      ],

      nodes: [],
      links: [],

      graphNodes: [],
      graphLinks: [],

      selectedNodeId: 0,
      selectedLinkId: 0,
      selectedLcId: 0,

      showCreateNode: false,
      showCreateLink: false,
      showCreateLc: false,
      showCreateTrail: false,
    }
  },
  created () {
    this.getSubnet()
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
    subnetId: {
      handler: function () {
        this.getSubnet()
      },
      deep: true,
    },
    kind: {
      handler: function () {
        this.getSubnet()
      },
    },
  },
  methods: {
    getSubnet () {
      console.log(this.kind)
      /* this.response = {}
      axios.get('https://localhost:8787/api/topology/nodes/all')
        .then(response => {
          this.response = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        }) */
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
    initCreateNode () {
      this.showCreateNode = true
    },
    nodeCreated (node) {
      this.showCreateNode = false
      console.log('node created: ' + node.name)
      this.$emit('refresh', 'node.add')
    },

    initCreateLink () {
      if (this.kind === 'link') {
        this.showCreateLink = true
      } else {
        this.showCreateLc = true
      }
    },
    linkCreated (link) {
      this.showCreateLink = false
      console.log('link created: ' + link.name)
      this.$emit('refresh', 'link.add')
    },
    linkConnCreated (linkConn) {
      this.showCreateLc = false
      console.log('linkConn created: ' + linkConn.name)
      this.$emit('refresh', 'lc.add')
    },

    nodeClick (event, node) {
      this.selectedNodeId = node.id
    },
    linkClick (event, link) {
      if (this.kind === 'link') {
        this.selectedLinkId = link.id
      } else {
        this.selectedLcId = link.id
      }
    },

    initCreateTrail () {
      this.showCreateTrail = true
    },
    trailCreated (trail) {
      this.showCreateTrail = false
      console.log('trail created: ', trail.name)
    },

    close () {
      this.selectedNodeId = 0
      this.selectedLinkId = 0
      this.selectedLcId = 0
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
