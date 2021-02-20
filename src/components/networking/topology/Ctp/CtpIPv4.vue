<template>
  <div class="ctp-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">IPv4 CTP Information</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Address:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.address }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Netmask:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.netmask }}</va-item-label>
            </va-item-section>
          </va-item>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CtpIPv4',
  props: ['ctp'],
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
