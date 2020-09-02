<template>
  <div>

    <div v-if="ctps.length == 0" class="text-center mt-5">
      <va-chip color="gray">No CTPs to show</va-chip>
    </div>

    <table v-if="ctps.length > 0" class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Label</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ctp, index) in ctps" :key="index" @click="onSelected(ctp.id)" >
          <td>{{ ctp.name }}</td>
          <td>{{ ctp.label }}</td>
          <td>{{ ctp.created }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CtpTable',
  props: ['ctps', 'onSelected'],
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
