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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pa, index) in pas" :key="index" >
          <td>{{ pa.name }}</td>
          <td>{{ pa.originId }}</td>
          <td>{{ new Date(pa.created).toLocaleString() }}</td>
          <td>{{ new Date(pa.expiration).toLocaleString() }}</td>
          <td>

            <va-button flat color="danger" icon="fa fa-trash-o" @click="onDelete(pa.id)" />
            <va-button flat color="info" icon="fa fa-arrows" @click="onGenRoutes(pa.name)" />
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
