<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Actions</th>

        <th>Name</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(lc, index) in lcs" :key="index">
        <td>{{ lc.name }}</td>
        <td>
          <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
        </td>
        <td>
          <va-button small color="danger" @click="onDelete(lc.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(lc)"> Edit </va-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'LinkConnTable',
  props: ['lcs', 'onDelete', 'onEdit'],
  components: {
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
