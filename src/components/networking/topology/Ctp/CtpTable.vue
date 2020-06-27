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
      <tr v-for="(ctp, index) in ctps" :key="index">
        <td>{{ ctp.name }}</td>
        <td>
          <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
        </td>
        <td>
          <va-button small color="danger" @click="onDelete(ctp.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(ctp)"> Edit </va-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'CtpTable',
  props: ['ctps', 'onDelete', 'onEdit'],
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
