<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Created</th>
        <th>Info</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ctp, index) in ctps" :key="index" @click="onSelected(ctp.id)" >
        <td>{{ ctp.name }}</td>
        <td>{{ ctp.created }}</td>
        <td>{{ ctp.info }}</td>
        <td>
          <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
        </td>
        <!-- td>
          <va-button small color="danger" @click="onDelete(ctp.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(ctp)"> Edit </va-button>
        </td -->
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'CtpTable',
  props: ['ctps', 'onSelected'],
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
