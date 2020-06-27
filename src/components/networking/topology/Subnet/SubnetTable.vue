<template class="subnet">
  <div class="row">
    <div class="flex xs12">
      <table class="va-table va-table--striped va-table--hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <!-- th>Action</th -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subnet, index) in subnets" :key="index" @click="onSelected(index)">
            <td>{{ subnet.name }}</td>
            <td>
              <va-badge small :color="getStatusColor(subnet.status)" >{{ subnet.status }}</va-badge>
            </td>
            <!-- <td>
              <va-button small color="danger" @click="onDelete(subnet.id)"> Delete </va-button>
              <va-button small color="info" @click="onEdit(subnet)"> Edit </va-button>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SubnetTable',
  props: ['subnets', 'onSelected'],
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
