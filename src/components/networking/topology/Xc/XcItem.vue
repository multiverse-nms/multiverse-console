<template>
  <div class="xc-details">
    <div class="row">
      <div class="flex md8">

        <va-item>
          <va-item-section side>
            Name:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Label:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.label }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Description:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.description }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Status:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Info:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.info }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Created:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Updated:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ xc.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-3">
          <va-button small color="danger" @click="onDelete(xc.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(xc)"> Edit </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XcItem',
  props: ['xc', 'onDelete', 'onEdit'],
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
