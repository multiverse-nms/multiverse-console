<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Actions</th>

        <th>Name</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(xc, index) in xcs" :key="index">
        <td>{{ xc.name }}</td>
        <td>
          <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
        </td>
        <td>
          <va-button small color="danger" @click="onDelete(xc.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(xc)"> Edit </va-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'XcTable',
  props: ['xcs', 'onEdit', 'onDelete'],
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
