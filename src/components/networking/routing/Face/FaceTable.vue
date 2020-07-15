<template>
  <div>

    <div v-if="faces.length == 0" class="text-center mt-5">
      <va-chip color="gray">No Faces to show</va-chip>
    </div>

    <table v-if="faces.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Id</th>
          <th>Local</th>
          <th>Remote</th>
          <th>Scheme</th>
          <th>CTP</th>
          <th>LC</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(face, index) in faces" :key="index" >
          <td>{{ face.id }}</td>
          <td>{{ face.local }}</td>
          <td>{{ face.remote }}</td>
          <td>{{ face.scheme }}</td>
          <td>{{ face.vctpId }}</td>
          <td>{{ face.vlinkConnId }}</td>
          <td>{{ new Date(face.updated).toLocaleString() }}</td>
          <td>
            <va-button flat color="danger" icon="fa fa-trash-o" @click="onDelete(face.id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'FaceTable',
  props: ['faces', 'onDelete'],
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
