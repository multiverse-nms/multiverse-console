<template>
  <div>

    <div v-if="operations.length == 0" class="text-center mt-5">
      <va-chip color="gray">No operations to show</va-chip>
    </div>

    <table v-if="operations.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th v-for="(col, index) in headers" :key="index">{{ col }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(op, index) in operations" :key="index">
          <td>
            <va-badge color="info">
              {{ op.name }}
            </va-badge>
          </td>
          <td> {{ op.endpoint }} </td>
          <td> {{ op.begins }} </td>
          <td> {{ op.ends }} </td>
          <td> {{ op.total }} </td>
          <td>
            <va-button small color="info" @click="expandOp(op._id)" >
              Expand
            </va-button>
            <va-button small color="warning" @click="pinOp(op._id)" >
              Pin
            </va-button>
            <va-button small color="danger" @click="deleteOp(op._id)" >
              Delete
            </va-button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'operations-table',
  props: ['operations'],
  data () {
    return {
      headers: ['Name', 'Endpoint', 'Begins at', 'Ends at', 'Total results', 'Actions'],
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    expandOp (id) {
      this.$emit('onExpand', id)
    },
    pinOp (id) {
      this.$emit('onPin', id)
    },
    deleteOp (id) {
      this.$emit('onDelete', id)
    },
  },
}
</script>

<style lang="scss">
  .markup-tables {
    .va-table {
      width: 100%;
    }

    .va-card {
      max-width: 1200px;
    }
  }
</style>
