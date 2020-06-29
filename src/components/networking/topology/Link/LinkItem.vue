<template>
  <div class="link-details">
    <div class="row">
      <div class="flex lg4">
        <div class="text-center">
          Link Details
        </div>
        <va-item>
          <va-item-section side>
            Name:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Label:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.label }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Description:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.description }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Type:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.type }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Status:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Info:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.info }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Created:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Updated:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-5">
          <div class="flex xs12">
            <va-button small color="danger" @click="onDelete(link.id)"> Delete </va-button>
            <va-button small color="info" @click="onEdit(link)"> Edit </va-button>
          </div>
        </div>
      </div>

      <div class="flex lg8">
        <div class="text-center">
          <span>
            Link Connections
          </span>
          <div>
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
      axios.delete('https://localhost:8787/api/topology/xc/' + id.toString())
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
      const lcsApi = 'https://localhost:8787/api/topology/linkConns/link/' + this.link.id.toString()
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
