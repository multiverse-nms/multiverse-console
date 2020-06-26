<template class="trail">
  <div class="row">
    <div class="flex xs12">
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
              <va-button small color="danger" @click="deleteTrail(trail.id)"> Delete </va-button>
              <va-button small color="info" @click="initEditTrail(trail.id)"> Edit </va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'TrailContent',
  props: ['subnetId'],
  components: {
  },
  data: function () {
    return {
      title: 'Trails',
      trails: [],
    }
  },

  created () {
    this.getTrails()
  },
  watch: {
    subnetId: {
      handler: function () {
        this.getTrails()
      },
      deep: true,
    },
    /* 'nPrefix.node': function (newVal, oldVal) {
      this.nPrefix.interface = ''
      this.getInterfaces(newVal)
    }, */
  },
  methods: {
    getTrails () {
      console.log('get trails for subnetId:', this.subnetId)
      this.trails = [
        {
          id: 1,
          name: 'T1',
          status: 'UP',
        },
        {
          id: 2,
          name: 'T2',
          status: 'DOWN',
        },
      ]
    },
    deleteTrail (id) {
      console.log('delete trailId: ', id)
      this.$emit('refresh', 'trail.delete')
    },

    initEditTrail (id) {
      console.log('init edit trailId: ', id)
    },

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
