<template>
  <div>

    <div v-if="ltps.length == 0" class="text-center mt-5">
      <va-chip color="gray">No LTPs to show</va-chip>
    </div>

    <table v-if="ltps.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Label</th>
          <th>Busy</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ltp, index) in ltps" :key="index" @click="onSelected(ltp.id)">
          <td>{{ ltp.name }}</td>
          <td>{{ ltp.label }}</td>
          <td>
            <va-badge small color="gray" >{{ ltp.busy }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
