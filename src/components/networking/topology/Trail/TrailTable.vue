<template>
  <div>

    <div v-if="trails.length === 0" class="text-center mt-5">
      <va-chip color="gray">No Trails to show</va-chip>
    </div>

    <table v-if="trails.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Label</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(trail, index) in trails" :key="index" @click="onSelected(trail.id)">
          <td>{{ trail.name }}</td>
          <td>{{ trail.label }}</td>
          <td>
            <va-badge small :color="getStatusColor(trail.status)" >{{ trail.status }}</va-badge>
          </td>
        <!-- td>
          <va-button small color="danger" @click="onDelete(trail.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(trail)"> Edit </va-button>
        </td -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

export default {
  name: 'TrailTable',
  props: ['trails', 'onSelected'],
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
