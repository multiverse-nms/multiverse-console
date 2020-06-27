<template>
  <div class="ctp-details">
    <div class="row">
      <div class="flex lg12">
        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ctp.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ctp.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ctp.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ctp.updated }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-5">
          <div class="flex xs12">
            <va-button small color="danger" @click="deleteCtp()"> Delete </va-button>
            <va-button small color="info" @click="initEditCtp()"> Edit </va-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CtpItem',
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
    // edit one ltp
    initEditCtp (ctp) {
      console.log('init edit CTP:', ctp.name)
      this.$emit('refresh', 'ctp.edite')
    },
    deleteCtp (id) {
      console.log('delete CTP:', id)
      this.$emit('refresh', 'ctp.delete')
    },

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
