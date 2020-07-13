<template>
  <div>

    <div v-if="routes.length == 0" class="text-center mt-5">
      <va-chip color="gray">No Routes to show</va-chip>
    </div>

    <table v-if="routes.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Node</th>
          <th>Prefix</th>
          <th>NextHop</th>
          <th>Face</th>
          <th>Cost</th>
          <th>Origin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(route, index) in routes" :key="index" >
          <td>{{ route.nodeId }}</td>
          <td>{{ route.prefix }}</td>
          <td>{{ route.nextHopId }}</td>
          <td>{{ route.faceId }}</td>
          <td>{{ route.cost }}</td>
          <td>{{ route.origin }}</td>
          <td>
            <va-button small color="danger" @click="onDelete(route.id)"> Delete </va-button>
          <!-- va-button small color="info" @click="onEdit(route)"> Edit </va-button -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RouteTable',
  props: ['routes', 'onDelete'],
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
  },
  computed: {},
}
</script>

<style lang="scss">
</style>
