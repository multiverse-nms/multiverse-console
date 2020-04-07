<template>
  <va-list fit>
    <va-list-label>
      {{ $t('dashboard.serviceLogs') }}
    </va-list-label>

    <va-item :to="{ name: 'google-maps' }">
      <va-item-section>
        <va-item-label>07/04/20 3:30:32 pm</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Topology</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Node created [/nist/n1]</va-item-label>
      </va-item-section>
    </va-item>

    <va-item :to="{ name: 'google-maps' }">
      <va-item-section>
        <va-item-label>07/04/20 3:30:32 pm</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Routing</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Route created [...]</va-item-label>
      </va-item-section>
    </va-item>

    <va-item :to="{ name: 'google-maps' }">
      <va-item-section>
        <va-item-label>07/04/20 3:30:32 pm</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Routing</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-item-label>Prefix created [...]</va-item-label>
      </va-item-section>
    </va-item>
  </va-list>
</template>

<script>

export default {
  name: 'DashboardServiceLogs',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
.dashboard-contributors-list {
  flex-direction: column;

  .inner-loading {
    height: 100%;
  }
}
</style>
