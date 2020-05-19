<template>
  <va-modal
    v-model="show"
    size="large"
    title="Link details"
    hideDefaultActions
  >
    <div class="modal-link">
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
// import icons from '../../../assets/icons/graph-icons.json'
import D3Network from 'vue-d3-network/src/vue-d3-network.vue'

export default {
  name: 'link-details',
  props: ['link'],
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
    link: {
      handler: function () {
        if (this.link._id !== 'undefined') {
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
    deleteLink (id) {
      console.log('delete link: ', id)
      this.$emit('action', 'delete-link', [id])
    },
    processGraph () {
      console.log(this.link)
      this.graphNodes = []
      this.graphLinks = []

      const sourceNode = { id: this.link.sourceNode, name: this.link.sourceNode }
      const sourceLtp = { id: this.link.sourceLtp, name: this.link.sourceLtp }
      const destNode = { id: this.link.destNode, name: this.link.destNode }
      const destLtp = { id: this.link.destLtp, name: this.link.destLtp }

      this.graphNodes.push(sourceNode)
      this.graphNodes.push(sourceLtp)
      this.graphNodes.push(destNode)
      this.graphNodes.push(destLtp)

      const nodesLink = { sid: this.link.sourceNode, tid: this.link.destNode }
      const sourceLtpLink = { sid: this.link.sourceLtp, tid: this.link.sourceNode }
      const destLtpLink = { sid: this.link.destLtp, tid: this.link.destNode }
      this.graphLinks.push(nodesLink)
      this.graphLinks.push(sourceLtpLink)
      this.graphLinks.push(destLtpLink)

      console.log(this.link.sourceCtp)
      if (this.link.sourceCtp) {
        const sourceCtp = { id: this.link.sourceCtp, name: this.link.sourceCtp }
        const destCtp = { id: this.link.destCtp, name: this.link.destCtp }
        this.graphNodes.push(sourceCtp)
        this.graphNodes.push(destCtp)
        const sourceCtpLink = { sid: this.link.sourceCtp, tid: this.link.sourceLtp }
        const destCtpLink = { sid: destCtp.id, tid: destLtp.id }
        this.graphLinks.push(sourceCtpLink)
        this.graphLinks.push(destCtpLink)
      }
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
