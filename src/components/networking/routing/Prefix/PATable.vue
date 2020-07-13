<template>
  <div>

    <div v-if="pas.length == 0" class="text-center mt-5">
      <va-chip color="gray">No Prefix Annoucements to show</va-chip>
    </div>

    <table v-if="pas.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Origin</th>
          <th>Advertized</th>
          <th>Expiration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pa, index) in pas" :key="index" >
          <td>{{ pa.name }}</td>
          <td>{{ pa.originId }}</td>
          <td>{{ new Date(pa.created).toLocaleString() }}</td>
          <td>{{ new Date(pa.expiration).toLocaleString() }}</td>
          <td>
            <va-button small color="danger" @click="onDelete(pa.id)"> Withdraw </va-button>
            <va-button small color="warning" @click="onGenRoutes(pa.name)"> Gen. Routes </va-button>
          <!-- va-button small color="info" @click="onEdit(pa)"> Edit </va-button -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PATable',
  props: ['pas', 'onDelete', 'onGenRoutes'],
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
