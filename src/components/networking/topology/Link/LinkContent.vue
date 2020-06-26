<template>
  <va-modal
    v-model="show"
    size="large"
    title="Link details"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="link-details">
      <div class="row">
        <div class="flex lg4">
          <va-item>
            <va-item-section side>
              <va-icon name="fa fa-google" color="red" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.name }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <va-icon name="fa fa-google" color="red" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.status }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <va-icon name="fa fa-google" color="red" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.srcVnodeId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <va-icon name="fa fa-google" color="red" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ link.destVnodeId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <va-icon name="fa fa-google" color="red" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ getSubnetName(link.vsubnetId) }}</va-item-label>
            </va-item-section>
          </va-item>

          <div class="row mt-5">
            <div class="flex xs12">
              <va-button small color="danger" @click="deleteLink()"> Delete </va-button>
              <va-button small color="info" @click="initEditLink()"> Edit </va-button>
            </div>
          </div>
        </div>

        <div class="flex lg8">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lc, index) in link.vlcs" :key="index">
                <td>{{ lc.name }}</td>
                <td>
                  <va-badge small :color="getStatusColor(lc.status)" >{{ lc.status }}</va-badge>
                </td>
                <td>
                  <va-button small color="danger" @click="deleteLc(lc.id)"> Delete </va-button>
                  <va-button small color="info" @click="initEditLc(lc.id)"> Edit </va-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
    <va-separator/>
    <va-button small color="gray" @click="close()"> OK </va-button>
  </va-modal>
</template>

<script>
export default {
  name: 'LinkContent',
  props: ['linkId'],

  data: function () {
    return {
      show: false,
      link: {},
    }
  },

  created () {
  },
  watch: {
    linkId: {
      handler: function () {
        if (this.linkId > 0) {
          this.getLink()
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
    getLink () {
      console.log('get linkId:', this.linkId)
      this.link = {
        id: 1,
        name: 'A-B',
        vsubnetId: 12,
        srcVnodeId: 1,
        destVnodeId: 2,
        status: 'UP',
        vlcs: [
          {
            id: 1,
            name: 'A:ltp0:ctp0-B:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:ltp0:ctp0-B:ltp0:ctp0',
            status: 'DOWN',
          },
        ],
      }
      this.show = true
    },
    initEditLink () {
      console.log('init edit link:', this.link)
    },
    deleteLink () {
      console.log('delete linkId:', this.link.id)
      this.$emit('refresh', 'link.delete')
    },

    initEditLc (id) {
      console.log('init edit lc:', id)
    },
    deleteLc (id) {
      console.log('delete lcId:', id)
    },

    close () {
      this.$emit('onClose')
      this.show = false
    },

    getSubnetName (id) {
      return 'nist-subnet'
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
  width: 800px;
  max-width: 800px;
}
</style>
