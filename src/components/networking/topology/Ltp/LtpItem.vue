<template>
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
          <va-button small color="danger" @click="onDelete(ltp.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(ltp)"> Edit </va-button>

          <va-button small color="warning" @click="initAddCtp()"> Add CTP </va-button>
        </div>
      </div>

      <div class="flex md8">
        <ctp-table :ctps="ltp.ctps" :onDelete="deleteCtp" :onEdit="initEditCtp" />
      </div>
    </div>

    <create-ctp @onOk="postCtp" @onCancel="showCreateCtp = false" :show="showCreateCtp" :ltpId="ltp.id" />
  </div>
</template>

<script>
import CtpTable from '../Ctp/CtpTable'
import CreateCtp from '../Ctp/CreateCtp'

export default {
  name: 'LtpItem',
  props: ['ltp', 'onDelete', 'onEdit'],
  components: {
    CtpTable,
    CreateCtp,
  },
  data: function () {
    return {
      showCreateCtp: false,
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // CRUD CTP
    initAddCtp () {
      console.log('init add CTP on ltpId:', this.ltp.id)
      this.showCreateCtp = true
    },
    postCtp (ctp) {
      console.log('CTP created: ', ctp.name)
      this.showCreateCtp = false
      this.$emit('refresh', 'ltp.ctp.add')
    },

    initEditCtp (ctp) {
      console.log('init edit CTP:', ctp.name)
    },
    patchCtp (ctp) {},

    deleteCtp (id) {
      console.log('delete CTP:', id)
      this.$emit('refresh', 'ltp.ctp.delete')
    },

    // other
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
