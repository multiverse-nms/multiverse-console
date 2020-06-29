<template>
  <div>

    <div v-if="lcs.length == 0" class="text-center mt-5">
      <va-chip color="gray">No LinkConns to show</va-chip>
    </div>

    <table v-if="lcs.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Label</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lc, index) in lcs" :key="index" @click="onSelected(lc.id)">
          <td>{{ lc.name }}</td>
          <td>{{ lc.label }}</td>
          <td>
            <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
          </td>
        <!--  td>
          <va-button small color="danger" @click="onDelete(lc.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(lc)"> Edit </va-button>
        </td -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LinkConnTable',
  props: ['lcs', 'onSelected'],
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
