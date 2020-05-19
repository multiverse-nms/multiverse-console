<template>
  <va-modal
    v-model="show"
    size="large"
    title="Node details"
    hideDefaultActions
  >
    <div class="modal-node">
      <div class="row">
        <d3-network
          ref='net'
          :net-nodes="graphNodes"
          :net-links="graphLinks"
          :options="options"
        />
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button small color="danger"  @click="cancelModal()"> Close </va-button>
          <va-button small  @click="deleteNode()"> Delete </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
import icons from '../../../assets/icons/graph-icons.json'
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'

export default {
  name: 'node-details',
  props: ['node'],
  components: {
    D3Network,
  },
  data () {
    return {
      graphNodes: [],
      graphLinks: [],
      show: false,
    }
  },
  created () {
  },
  computed: {
    options () {
      return {
        force: 5000,
        size: { w: 500, h: 500 },
        nodeSize: 40,
        nodeLabels: true,
        linkLabels: false,
        canvas: false,
        linkWidth: 3,
        fontSize: 18,
      }
    },
  },
  watch: {
    node: {
      handler: function () {
        if (this.node._id !== 'undefined') {
          this.show = this.processGraph()
        }
      },
    },
  },
  methods: {
    cancelModal () {
      console.log('cancel modal')
      this.show = false
    },
    deleteNode (id) {
      console.log('delete node: ', id)
      this.$emit('action', 'delete-node', [id])
    },
    processGraph () {
      this.graphNodes = []
      this.graphLinks = []

      let newNode = { id: this.node._id, name: this.node._id }
      if (this.node.type === 'fwd') {
        newNode = Object.assign(newNode, { svgSym: icons.routerIcon, svgIcon: null, svgObj: null })
      } else if (this.node.type === 'switch') {
        newNode = Object.assign(newNode, { svgSym: icons.switchIcon, svgIcon: null, svgObj: null })
      }
      this.graphNodes.push(newNode)

      this.node.ltps.forEach(ltp => {
        let newNode = { id: ltp._id, name: ltp._id }
        newNode = Object.assign(newNode, { svgSym: icons.ltpIcon, svgIcon: null, svgObj: null })
        this.graphNodes.push(newNode)
        const newLink = {
          sid: this.node._id,
          tid: ltp._id,
        }
        this.graphLinks.push(newLink)

        ltp.ctps.forEach(ctp => {
          let newNode = { id: ctp._id, name: ctp._id }
          newNode = Object.assign(newNode, { svgSym: icons.ctpIcon, svgIcon: null, svgObj: null })
          this.graphNodes.push(newNode)
          const newLink = {
            sid: ltp._id,
            tid: ctp._id,
          }
          this.graphLinks.push(newLink)
        })
      })
      return true
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
<style lang="stylus">
</style>
