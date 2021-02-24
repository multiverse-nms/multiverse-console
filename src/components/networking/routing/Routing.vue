<template>
  <div>
    <div class="row">

      <div class="flex md4 column">
        <va-card :title="tCtp">
          <div class="table-card">
            <ctp-table :ctps="ctps" :onSelected="getCtp"></ctp-table>
          </div>
        </va-card>
      </div>

      <div class="flex md4 column">
        <va-card :title="tPa">
          <div class="table-card">
            <p-a-table :pas="pas" :nodes="nodes" :onDelete="deletePrefixAnn"></p-a-table>
          </div>
          <div class="text-center mt-5">
            <va-button small color="warning" @click="initPrefixAnn">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Announce Prefix
            </va-button>
          </div>
        </va-card>
      </div>

      <div class="flex md4 column">
        <va-card :title="tRoute">
          <div class="table-card">
            <route-table :routes="routes" :nodes="nodes" :onDelete="deleteRoute"></route-table>
          </div>
          <div class="text-center mt-5">
            <va-button disabled small color="warning">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create Route
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
      <ctp-item :ctp="selectedCtp" :onDelete="deleteCtp" :onEdit="initEditCtp" />
    </va-modal>
    <create-p-a @onOk="postPrefixAnn" @onCancel="showCreatePA = false" :show="showCreatePA" :subnetId="subnet.id" />

  </div>
</template>

<script>
import axios from 'axios'
import PATable from './Prefix/PATable.vue'
import RouteTable from './Route/RouteTable.vue'
import CreatePA from './Prefix/CreatePA.vue'
import CtpTable from '../topology/Ctp/CtpTable'
import CtpItem from '../topology/Ctp/CtpItem'

export default {
  name: 'routing',
  props: ['subnet'],
  components: {
    PATable,
    RouteTable,
    CreatePA,
    CtpTable,
    CtpItem,
  },
  data: function () {
    return {
      title: 'Routing Info',
      showCreatePA: false,
      tCtp: 'CTPs',
      tPa: 'Prefix Announcements',
      tRoute: 'Routes',
      pas: [],
      routes: [],
      nodes: [],
      ctps: [],

      showItem: false,
      selectedCtp: {},
    }
  },
  created () {
    this.refreshAll()
  },
  computed: {
  },
  watch: {
    subnet: {
      handler: function () {
        this.refreshAll()
      },
    },
  },
  methods: {
    refreshAll () {
      this.getNodes()
      this.getPrefixAnns()
      this.getRoutes()
      this.getCtps()
    },

    // CRUD Route
    getRoutes () {
      const routesApi = this.$apiURI + '/topology/route'
      axios.get(routesApi)
        .then(response => {
          this.routes = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },
    deleteRoute (id) {
      axios.delete(this.$apiURI + '/topology/route/' + id.toString())
        .then(response => {
          this.getRoutes()
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // CRUD PA
    getPrefixAnns () {
      const paApi = this.$apiURI + '/topology/pa'
      axios.get(paApi)
        .then(response => {
          this.pas = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },
    initPrefixAnn () {
      this.showCreatePA = true
    },
    postPrefixAnn (pa) {
      axios.post(this.$apiURI + '/topology/pa', pa, {
        headers: {},
      })
        .then(response => {
          this.showToast('Prefix advertized', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getPrefixAnns()
          this.getRoutes()
          this.$emit('refresh', 'routing.pa')
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Prefix announcement failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreatePA = false
    },
    deletePrefixAnn (id) {
      axios.delete(this.$apiURI + '/topology/pa/' + id.toString())
        .then(response => {
          this.showToast('Prefix withdrawn', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getPrefixAnns()
          this.getRoutes()
          this.$emit('refresh', 'routing.pa')
        })
        .catch(e => {
          // console.log(e)
        })
    },

    getNodes () {
      const nodesApi = this.$apiURI + '/topology/node'
      axios.get(nodesApi)
        .then(response => {
          this.nodes = response.data.map((o) => ({ id: o.id, name: o.name }))
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // CRUD CTP
    getCtps () {
      const ctpsApi = this.$apiURI + '/topology/ctp'
      axios.get(ctpsApi)
        .then(response => {
          this.ctps = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },
    deleteCtp (id) {
      axios.delete(this.$apiURI + '/topology/ctp/' + id.toString())
        .then(response => {
          this.getCtps()
        })
        .catch(e => {
          // console.log(e)
        })
    },
    getCtp (id) {
      this.showItem = false
      const ctpApi = this.$apiURI + '/topology/ctp/' + id.toString()
      const ctpCtpApi = this.$apiURI + '/topology/ctp/' + id.toString() + '/ctps'
      axios.get(ctpApi)
        .then(response => {
          this.selectedCtp = response.data
          axios.get(ctpCtpApi)
            .then(response => {
              this.selectedCtp.vctps = response.data
              this.showItem = true
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    initEditCtp (ctp) {},
    patchCtp (ctp) {},

    refresh (type) {
      this.$emit('refresh', type)
    },
  },
}

</script>
<style lang="stylus">
.table-card {
  margin-bottom: 0 !important;
  max-height: 400px;
  overflow: scroll;
}

.column &.va-card__body {
  padding-right: 1px;
  padding-left: 1px;
}

</style>
