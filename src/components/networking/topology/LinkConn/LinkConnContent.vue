<template>
  <va-modal
    v-model="show"
    size="large"
    title="LinkConn details"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="link-details">
      <div class="row">
        <div class="flex lg6">
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
              <va-button small color="danger" @click="deleteLc(linkConn.id)"> Delete </va-button>
              <va-button small color="info" @click="initEditLc()"> Edit </va-button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <va-separator/>
    <va-button small color="gray" @click="close()"> OK </va-button>
  </va-modal>
</template>

<script>
export default {
  name: 'LinkConnContent',
  props: ['linkConnId'],

  data: function () {
    return {
      show: false,
      linkConn: {},
    }
  },

  created () {
  },
  watch: {
    linkConnId: {
      handler: function () {
        if (this.linkConnId > 0) {
          this.getLinkConn()
        }
      },
      deep: true,
    },
    /* 'nPrefix.node': function (newVal, oldVal) {
      this.nPrefix.interface = ''
      this.getInterfaces(newVal)
    }, */
  },
  methods: {
    getLinkConn () {
      console.log('get linkConnId:', this.linkConnId)
      this.linkConn = {
        id: 1,
        name: 'A-B',
        srcVnodeId: 1,
        destVnodeId: 2,
        status: 'UP',
      }
      this.show = true
    },
    initEditLc () {
      console.log('init edit linkConn:', this.linkConn)
    },
    deleteLc (id) {
      console.log('delete linkConnId:', id)
    },

    close () {
      this.$emit('onClose')
      this.show = false
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
.link-details {
  width: 500px;
  max-width: 500px;
}
</style>
