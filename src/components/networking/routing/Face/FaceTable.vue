<template>
  <div>

    <div v-if="faces.length == 0" class="text-center mt-5">
      <va-chip color="gray">No Faces to show</va-chip>
    </div>

    <table v-if="faces.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Local</th>
          <th>Remote</th>
          <th>Scheme</th>
          <th>CTP</th>
          <th>LC</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(face, index) in faces" :key="index" >
          <td>{{ face.local }}</td>
          <td>{{ face.remote }}</td>
          <td>{{ face.scheme }}</td>
          <td>{{ face.vctpId }}</td>
          <td>{{ face.vlinkConnId }}</td>
          <td>
            <va-button small color="danger" @click="onDelete(face.id)"> Delete </va-button>
          <!-- va-button small color="info" @click="onEdit(face)"> Edit </va-button -->
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
