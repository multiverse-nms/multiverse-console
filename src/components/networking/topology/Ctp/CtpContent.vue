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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ctp, index) in ctps" :key="index">
          <td>{{ ctp.name }}</td>
          <td>
            <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ctp.status)" >{{ ctp.status }}</va-badge>
          </td>
          <td>
            <va-button small color="danger" @click="deleteCtp(ctp.id)"> Delete </va-button>
            <va-button small color="info" @click="initEditCtp(ctp)"> Edit </va-button>
          </td>
        </tr>
      </tbody>
    </table>

    <va-modal
      v-model="showCtpDetails"
      size="large"
      title="CTP details"
      hideDefaultActions
      noOutsideDismiss
      noEscDismiss
    >
      <div class="ctp-details">
        <div class="row">
          <div class="flex md8">
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
          </div>
        </div>
      </div>

      <va-separator/>
      <va-button small color="gray" @click="showCtpDetails = false"> OK </va-button>
    </va-modal>
  </div>
</template>

<script>
export default {
  name: 'CtpContent',
  props: ['ctps'],
  components: {
  },
  data: function () {
    return {
      ctp: {},
      showCtpDetails: false,
    }
  },

  created () {
  },
  watch: {
  },
  methods: {
    // get one ctp
    getCtp (id) {
      console.log('get CTP:', id)
      this.ctp = {
        id: 1,
        name: 'A:ltp0',
        status: 'UP',
        created: '1246879',
        updated: '1246879',
      }
      this.showCtpDetails = true
    },

    // edit one ltp
    initEditCtp (ctp) {
      console.log('init edit CTP:', ctp.name)
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
