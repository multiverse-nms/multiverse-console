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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ltp, index) in ltps" :key="index" @click="getLtp(ltp.id)">
          <td>{{ ltp.name }}</td>
          <td>
            <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
          </td>
          <td>
            <va-badge small :color="getStatusColor(ltp.status)" >{{ ltp.status }}</va-badge>
          </td>
        </tr>
      </tbody>
    </table>

    <va-modal
      v-model="showLtpDetails"
      size="large"
      title="LTP details"
      hideDefaultActions
      noOutsideDismiss
      noEscDismiss
    >
      <div class="ltp-details">
        <div class="row">
          <div class="flex md4">
            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ ltp.name }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ ltp.status }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ ltp.created }}</va-item-label>
              </va-item-section>
            </va-item>

            <va-item>
              <va-item-section side>
                <va-icon name="fa fa-google" color="red" />
              </va-item-section>
              <va-item-section>
                <va-item-label>{{ ltp.updated }}</va-item-label>
              </va-item-section>
            </va-item>

            <div class="row mt-3">
              <va-button small color="danger" @click="deleteLtp(ltp.id)"> Delete </va-button>
              <va-button small color="info" @click="initEditLtp(ltp)"> Edit </va-button>
            </div>
          </div>

          <div class="flex md8">
            <ctp-content :ctps="ltp.ctps" @refresh="refresh" />
            <va-button small color="warning" @click="initAddCtp(ltp.id)"> Add CTP </va-button>
          </div>
        </div>
      </div>

      <va-separator/>
      <va-button small color="gray" @click="showLtpDetails = false"> OK </va-button>

      <create-ctp @onOk="ctpCreated" @onCancel="showCreateCtp = false" :show="showCreateCtp" :ltpId="ltp.id" />
    </va-modal>
  </div>
</template>

<script>

import CreateCtp from '../Ctp/CreateCtp.vue'
import CtpContent from '../Ctp/CtpContent.vue'

export default {
  name: 'LtpContent',
  props: ['ltps'],
  components: {
    CtpContent,
    CreateCtp,
  },
  data: function () {
    return {
      tabValue: 0,
      node: {},
      showLtpDetails: false,
      ltp: {},

      showCreateCtp: false,
    }
  },

  created () {
  },
  watch: {
  },
  methods: {
    // get one ltp
    getLtp (id) {
      console.log('get LTP:', id)
      this.ltp = {
        id: 1,
        name: 'A:ltp0',
        status: 'UP',
        created: '1246879',
        updated: '1246879',
        ctps: [
          {
            id: 1,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 2,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
          {
            id: 3,
            name: 'A:ltp0:ctp0',
            status: 'UP',
          },
        ],
      }
      this.showLtpDetails = true
    },

    // edit one ltp
    initEditLtp (ltp) {
      console.log('init edit LTP:', ltp.name)
    },
    deleteLtp (id) {
      console.log('delete LTP:', id)
      this.$emit('refresh', 'ltp.delete')
    },

    initAddCtp (ltpId) {
      console.log('init add CTP for ltpId:', ltpId)
      this.showCreateCtp = true
    },
    ctpCreated (ctp) {
      console.log('Ctp created: ', ctp.name)
      this.showCreateCtp = false
      this.$emit('refresh', 'ltp.ctp.add')
    },

    refresh (type) {
      console.log('refresh: ', type)
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
