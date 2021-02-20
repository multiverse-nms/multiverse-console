<template>
  <div class="ctp-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">NDN CTP Information</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Local:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.local }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Remote:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.remote }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Scheme:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.scheme }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Vlan:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.vlan }}</va-item-label>
            </va-item-section>
          </va-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CtpNdn',
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
