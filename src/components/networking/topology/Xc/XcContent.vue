<template>
  <div>
    <table class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>

          <th>Name</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(xc, index) in xcs" :key="index">
          <td>{{ xc.name }}</td>
          <td>
            <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(xc.status)" >{{ xc.status }}</va-badge>
          </td>
          <td>
            <va-button small color="danger" @click="deleteXc(xc.id)"> Delete </va-button>
            <va-button small color="info" @click="initEditXc(xc)"> Edit </va-button>
          </td>
        </tr>
      </tbody>
    </table>

    <va-modal
      v-model="showXcDetails"
      size="large"
      title="XC details"
      hideDefaultActions
      noOutsideDismiss
      noEscDismiss
    >
      <div class="modal-xc-details">
        <div class="row">
          <div class="flex md8">
            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ xc.name }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ xc.status }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ xc.created }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ xc.updated }}</va-item-label>
              </va-item-section>
            </va-item>

            <div class="row mt-3">
              <va-button small color="danger" @click="deleteXc(xc.id)"> Delete </va-button>
              <va-button small color="info" @click="initEditXc(xc)"> Edit </va-button>
            </div>
          </div>
        </div>
      </div>

      <va-separator/>
      <va-button small color="gray" @click="showXcDetails = false"> OK </va-button>
    </va-modal>
  </div>
</template>

<script>
export default {
  name: 'XcContent',
  props: ['xcs'],
  components: {
  },
  data: function () {
    return {
      xc: {},
      showXcDetails: false,
    }
  },

  created () {
  },
  watch: {
  },
  methods: {
    // get one xc
    getXc (id) {
      console.log('get XC:', id)
      this.xc = {
        id: 1,
        name: 'A:xc0',
        status: 'UP',
        created: '1246879',
        updated: '1246879',
      }
      this.showXcDetails = true
    },

    // edit one xc
    initEditXc (xc) {
      console.log('init edit XC:', xc.name)
    },
    deleteXc (id) {
      console.log('delete XC:', id)
      this.$emit('refresh', 'xc.delete')
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
