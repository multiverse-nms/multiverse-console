<template>
  <div>

    <div v-if="ctps.length == 0" class="text-center mt-5">
      <va-chip color="gray">No CTPs to show</va-chip>
    </div>

    <table v-if="ctps.length > 0" class="va-table va-table--hoverable table-max">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Parent</th>
          <th>Node</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ctp, index) in ctps" :key="index" @click="onSelected(ctp.id)" :class="getStatusClass(ctp.status)">
          <td>{{ ctp.name }}</td>
          <td>{{ ctp.connType }}</td>
          <td>{{ ctp.parentId }}</td>
          <td>{{ ctp.vnodeId }}</td>
          <td>{{ ctp.label }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getStatusClass } from '../../../../assets/icons/colors.js'
export default {
  name: 'CtpTable',
  props: ['ctps', 'onSelected'],
  components: {
  },
  data: function () {
    return {
      getStatusClass,
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
