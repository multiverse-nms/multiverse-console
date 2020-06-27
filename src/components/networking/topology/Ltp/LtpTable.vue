<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Actions</th>

        <th>Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ltp, index) in ltps" :key="index" @click="onSelected(ltp.id)">
        <td>{{ ltp.name }}</td>
        <td>
          <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
        </td>
        <td>
          <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'LtpTable',
  props: ['ltps', 'onSelected'],
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
