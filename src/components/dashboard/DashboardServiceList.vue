<template>
  <va-list fit>
    <va-list-label>
      {{ $t('dashboard.serviceStatus') }}
    </va-list-label>

    <va-item>
      <va-item-section side>
        <va-icon name="fa fa-google" color="red" />
      </va-item-section>

      <va-item-section>
        <va-item-label>Data Streaming</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-badge color="primary">Running</va-badge>
      </va-item-section>
    </va-item>

    <va-item>
      <va-item-section side>
        <va-icon name="fa fa-map" color="red" />
      </va-item-section>

      <va-item-section>
        <va-item-label>Topology</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-badge color="primary">Running</va-badge>
      </va-item-section>
    </va-item>

    <va-item>
      <va-item-section side>
        <va-icon name="fa fa-map-marker" color="red" />
      </va-item-section>

      <va-item-section>
        <va-item-label>Routing</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-badge color="primary">Running</va-badge>
      </va-item-section>
    </va-item>

    <va-item>
      <va-item-section side>
        <va-icon name="fa fa-map-marker" color="red" />
      </va-item-section>

      <va-item-section>
        <va-item-label>Storage</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-badge color="primary">Running</va-badge>
      </va-item-section>
    </va-item>

    <va-item>
      <va-item-section side>
        <va-icon name="fa fa-map-marker" color="red" />
      </va-item-section>

      <va-item-section>
        <va-item-label>REST API</va-item-label>
      </va-item-section>

      <va-item-section>
        <va-badge color="primary">Running</va-badge>
      </va-item-section>
    </va-item>
  </va-list>
</template>

<script>

export default {
  name: 'DashboardServiceList',
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
