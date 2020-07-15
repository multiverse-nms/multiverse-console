<template>
  <div>
    <div class="row">
      <div class="flex md4 column">
        <va-card :title="tFace">
          <div class="table-card">
            <face-table :faces="faces" :onDelete="deleteFace" ></face-table>
          </div>
          <div class="text-center mt-5">
            <va-button disabled small color="warning">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Create Face
            </va-button>
          </div>
        </va-card>
      </div>

      <div class="flex md4 column">
        <va-card :title="tPa">
          <div class="table-card">
            <p-a-table :pas="pas" :onDelete="deletePrefixAnn" :onGenRoutes="genRoutes"></p-a-table>
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
            <route-table :routes="routes" :onDelete="deleteRoute"></route-table>
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

    <create-p-a @onOk="postPrefixAnn" @onCancel="showCreatePA = false" :show="showCreatePA" :subnetId="subnet.id" />

  </div>
</template>

<script>
import axios from 'axios'
import FaceTable from './Face/FaceTable.vue'
import PATable from './Prefix/PATable.vue'
import RouteTable from './Route/RouteTable.vue'
import CreatePA from './Prefix/CreatePA.vue'

export default {
  name: 'routing',
  props: ['subnet'],
  components: {
    FaceTable,
    PATable,
    RouteTable,
    CreatePA,
  },
  data: function () {
    return {
      title: 'Routing Info',
      showCreatePA: false,
      tFace: 'Faces',
      tPa: 'Prefix Announcements',
      tRoute: 'Routes',
      faces: [],
      pas: [],
      routes: [],
    }
  },
  created () {
    this.getFaces()
    this.getPrefixAnns()
    this.getRoutes()
  },
  computed: {
  },
  watch: {
    subnet: {
      handler: function () {
        this.getFaces()
        this.getPrefixAnns()
        this.getRoutes()
      },
    },
  },
  methods: {
    refreshAll () {
      this.getFaces()
      this.getPrefixAnns()
      this.getRoutes()
    },

    // CRUD Face
    getFaces () {
      let facesApi = 'https://localhost:8787/api/topology'
      if (this.subnet.id !== 0) {
        facesApi += '/subnet/' + this.subnet.id.toString()
      }
      facesApi += '/faces'
      axios.get(facesApi)
        .then(response => {
          this.faces = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    deleteFace (id) {
      axios.delete('https://localhost:8787/api/topology/face/' + id.toString())
        .then(response => {
          this.getFaces()
          this.getRoutes()
        })
        .catch(e => {
          console.log(e)
        })
    },

    // CRUD Route
    getRoutes () {
      let routesApi = 'https://localhost:8787/api/topology'
      if (this.subnet.id !== 0) {
        routesApi += '/subnet/' + this.subnet.id.toString()
      }
      routesApi += '/routes'
      axios.get(routesApi)
        .then(response => {
          this.routes = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    deleteRoute (id) {
      axios.delete('https://localhost:8787/api/topology/route/' + id.toString())
        .then(response => {
          console.log(response.data)
          this.getRoutes()
        })
        .catch(e => {
          console.log(e)
        })
    },
    // Route auto generation
    genRoutes (pref) {
      const body = { prefix: pref }
      axios.post('https://localhost:8787/api/topology/genroutes', body, {
        headers: {},
      })
        .then(response => {
          if (response.data.message === 'routes_created') {
            this.showToast('Routes created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 5000,
            })
            this.getRoutes()
          } else {
            console.log(response.data.message)
            this.showToast('Route creation failed', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 5000,
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.showToast('Route creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
    },

    // CRUD PA
    getPrefixAnns () {
      let paApi = 'https://localhost:8787/api/topology'
      if (this.subnet.id !== 0) {
        paApi += '/subnet/' + this.subnet.id.toString()
      }
      paApi += '/prefixAnns'
      axios.get(paApi)
        .then(response => {
          this.pas = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    initPrefixAnn () {
      this.showCreatePA = true
    },
    postPrefixAnn (pa) {
      axios.post('https://localhost:8787/api/topology/prefixAnn', pa, {
        headers: {},
      })
        .then(response => {
          this.showToast('Prefix advertized', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.getPrefixAnns()
          this.$emit('refresh', 'routing.pa')
        })
        .catch(e => {
          console.log(e.response)
          this.showToast('Prefix announcement failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreatePA = false
    },
    deletePrefixAnn (id) {
      axios.delete('https://localhost:8787/api/topology/prefixAnn/' + id.toString())
        .then(response => {
          this.showToast('Prefix withdrawn', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.getPrefixAnns()
          this.getRoutes()
          this.$emit('refresh', 'routing.pa')
        })
        .catch(e => {
          console.log(e)
        })
    },

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
