<template>
  <div class="trail-details">
    <div class="row">
      <div class="flex md4">

        <va-item>
          <va-item-section side>
            Name:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Label:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.label }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Description:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.description }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Busy:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.busy }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Status:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Info:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.info }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Created:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Updated:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ trail.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-3">
          <va-button small color="danger" @click="onDelete(trail.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(trail)"> Edit </va-button>

          <!-- va-button small color="warning" @click="initAddXc()"> Add XC </va-button -->
        </div>
      </div>

      <div class="flex md8">
        <xc-table :xcs="trail.vxcs" :onSelected="getXc" />
      </div>
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      title="Details"
      hideDefaultActions
    >
      <xc-item :xc="selectedXc" :onDelete="deleteXc" :onEdit="initEditXc" />
    </va-modal>

    <create-xc @onOk="postXc" @onCancel="showCreateXc = false" :show="showCreateXc" :trailId="trail.id" />
  </div>
</template>

<script>
import axios from 'axios'
import XcTable from '../Xc/XcTable.vue'
import XcItem from '../Xc/XcItem.vue'
import CreateXc from '../Xc/CreateXc.vue'

export default {
  name: 'TrailItem',
  props: ['trail', 'onDelete', 'onEdit'],
  components: {
    XcTable,
    XcItem,
    CreateXc,
  },
  data: function () {
    return {
      showItem: false,
      showCreateXc: false,
      selectedXc: {},
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // CRUD XC
    getXc (id) {
      this.showItem = false
      console.log('get xcId:', id)
      const xcApi = 'https://localhost:8787/api/topology/xc/' + id.toString()
      axios.get(xcApi)
        .then(response => {
          this.selectedXc = response.data
          this.showItem = true
        })
        .catch(e => {
          console.log(e)
        })
    },
    initAddXc () {
      console.log('init add XC on ltpId:', this.trail.id)
      this.showCreateXc = true
    },
    postXc (xc) {
      console.log('XC created: ', xc.name)
      this.showCreateXc = false
      this.$emit('refresh', 'trail.xc.add')
    },

    initEditXc (xc) {
      console.log('init edit XC:', xc.name)
    },
    patchXc (xc) {},

    deleteXc (id) {
      console.log('delete XC:', id)
      this.$emit('refresh', 'trail.xc.delete')
    },

    // other
    getStatusColor (status) {
      if (status === 'DOWN') {
        return 'danger'
      }
      return 'success'
    },
  },
  computed: {},
}
</script>

<style lang="scss">
</style>
