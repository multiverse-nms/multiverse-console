<template>
  <div class="link-details">
    <div class="row">
      <div class="flex lg4">
        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.srcVnodeId }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ link.destVnodeId }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ getSubnetName(link.vsubnetId) }}</va-item-label>
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
        <link-conn-table :lcs="link.vlcs" :onDelete="deleteLc" :onEdit="initEditLc" />
      </div>
    </div>
  </div>
</template>

<script>
import LinkConnTable from '../LinkConn/LinkConnTable.vue'

export default {
  name: 'LinkItem',
  props: ['link', 'onEdit', 'onDelete'],
  components: {
    LinkConnTable,
  },
  data: function () {
    return {
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // CRUD LinkConn (edit/delete only)
    initEditLc (lc) {
      console.log('init edit lc:', lc.id)
    },
    patchLc (lc) {},
    deleteLc (id) {
      console.log('delete lcId:', id)
      this.$emit('refresh', 'lc.deleted')
    },

    // other
    getSubnetName (id) {
      return 'nist-subnet'
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
