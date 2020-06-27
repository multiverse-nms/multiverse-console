<template>
  <div class="lc-details">
    <div class="row">
      <div class="flex lg12">
        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ linkConn.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ linkConn.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ linkConn.srcVnodeId }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            <va-icon name="fa fa-google" color="red" />
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ linkConn.destVnodeId }}</va-item-label>
          </va-item-section>
        </va-item>

        <div class="row mt-5">
          <div class="flex xs12">
            <va-button small color="danger" @click="onDelete(linkConn.id)"> Delete </va-button>
            <va-button small color="info" @click="onEdit(linkConn)"> Edit </va-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkConnItem',
  props: ['linkConn', 'onEdit', 'onDelete'],

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
.lc-details {
  width: 500px;
  max-width: 500px;
}
</style>
