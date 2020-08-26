<template>
  <div>

    <div v-if="capabilities.length == 0" class="text-center mt-5">
      <va-chip color="gray">No capabilities to show</va-chip>
    </div>

    <table v-if="capabilities.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th v-for="(col, index) in headers" :key="index">{{ col }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(capability, index) in capabilities" :key="index">
          <td>
            <va-badge :color="getTypeColor(capability.content.capability)">
              {{ capability.content.capability }}
            </va-badge>
            <va-badge color="primary">
              {{ capability.content.name }}
            </va-badge>
          </td>
          <td>
            <p>
              {{ capability.content.endpoint+'/'+capability.content.schema.slice(0,10) }}
            </p>

          </td>

          <td> {{ capability.content.label }}
            <br/>
            <va-badge v-for="(res, index) in capability.content.results" :key="index" color="gray">
              {{ res.split(".")[0] }}
            </va-badge>
          </td>

          <td>
            <va-badge :color="getStatusColor(capability.status)">
              {{capability.status}}
            </va-badge>
          </td>

          <td>
            <va-button small color="info" @click="onSendSpec(capability.content)">
              Send specification
            </va-button>
          </td>

        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>

export default {
  name: 'capability',
  props: ['capabilities', 'onSendSpec'],
  components: {
  },
  data () {
    return {
      headers: ['Capability', 'Name', 'Available results', 'Status', 'Action'],
      showModal: false,
    }
  },
  created () {
  },
  methods: {
    getStatusColor (name) {
      if (name === 'active') {
        return 'success'
      }
      return 'danger'
    },
    getTypeColor (t) {
      if (t === 'measure') {
        return 'info'
      }
      return 'warning'
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
