<template>
  <div class="link-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">Link Details</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Name:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.name }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Label:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.label }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Description:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.description }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Source LTP:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.srcVltpId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Destination LTP:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.destVltpId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Status:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.status }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Info:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.info }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Created:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.created }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Updated:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.updated }}</va-item-label>
            </va-item-section>
          </va-item>
        </div>

        <div class="text-center mt-3">
          <va-button small color="danger" @click="onDelete(link.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(link)"> Edit </va-button>
        </div>
      </div>

      <div class="lg8">
        <div class="text-center">
          <p class="display-5">Link Connections</p>
          <div class="mt-3">
            <link-conn-table :lcs="link.vlinkConns" :onSelected="getLc" />
          </div>
        </div>
      </div>

    </div>

    <va-modal
      v-model="showItem"
      size="large"
      hideDefaultActions
    >
      <link-conn-item :linkConn="selectedLc" :onDelete="deleteLc" :onEdit="initEditLc" />
    </va-modal>

  </div>
</template>

<script>
import axios from 'axios'
import LinkConnTable from '../LinkConn/LinkConnTable.vue'
import LinkConnItem from '../LinkConn/LinkConnItem.vue'

export default {
  name: 'LinkItem',
  props: ['link', 'onEdit', 'onDelete'],
  components: {
    LinkConnTable,
    LinkConnItem,
  },
  data: function () {
    return {
      showItem: false,
      selectedLc: {},
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // CRUD LinkConn (get/edit/delete only)
    getLc (id) {
      this.showItem = false
      console.log('get lcId:', id)
      const lcApi = 'https://localhost:8787/api/topology/linkConn/' + id.toString()
      axios.get(lcApi)
        .then(response => {
          this.selectedLc = response.data
          this.showItem = true
        })
        .catch(e => {
          console.log(e)
        })
    },
    initEditLc (lc) {
      console.log('init edit lc:', lc.id)
    },
    patchLc (lc) {},
    deleteLc (id) {
      console.log('delete lcId:', id)
      axios.delete('https://localhost:8787/api/topology/linkConn/' + id.toString())
        .then(response => {
          console.log(response.data)
          // notify subnet:
          this.$emit('refresh', 'lc.deleted')
          this.showItem = false
          this.getLcsByLink()
        })
        .catch(e => {
          console.log(e)
        })
    },

    getLcsByLink () {
      const lcsApi = 'https://localhost:8787/api/topology/link/' + this.link.id.toString() + '/linkConns'
      axios.get(lcsApi)
        .then(response => {
          this.link.vlinkConns = response.data
        })
        .catch(e => {
          console.log(e)
        })
    },

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
.link-details {
  width: 800px;
  max-width: 800px;
}
</style>
