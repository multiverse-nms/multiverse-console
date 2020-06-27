<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(trail, index) in trails" :key="index">
        <td>{{ trail.name }}</td>
        <td>
          <va-badge small :color="getStatusColor(trail.status)" >{{ trail.status }}</va-badge>
        </td>
        <td>
          <va-button small color="danger" @click="onDelete(trail.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(trail)"> Edit </va-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>

export default {
  name: 'TrailTable',
  props: ['trails', 'onEdit', 'onDelete'],
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
