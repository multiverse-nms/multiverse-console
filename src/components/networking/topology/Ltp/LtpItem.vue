<template>
  <div class="ltp-details">
    <div class="row">
      <div class="flex md4">

        <va-item>
          <va-item-section side>
            Name:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.name }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Label:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.label }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Description:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.description }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Busy:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.busy }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Status:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.status }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Info:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.info }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Created:
          </va-item-section>
          <va-item-section>
            <va-item-label>{{ ltp.created }}</va-item-label>
          </va-item-section>
        </va-item>

        <va-item>
          <va-item-section side>
            Updated:
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
        <ctp-table :ctps="ltp.vctps" :onSelected="getCtp" />
      </div>
    </div>

    <va-modal
      v-model="showItem"
      size="large"
      title="Details"
      hideDefaultActions
    >
      <ctp-item :ctp="selectedCtp" :onDelete="deleteCtp" :onEdit="initEditCtp" />
    </va-modal>

    <create-ctp @onOk="postCtp" @onCancel="showCreateCtp = false" :show="showCreateCtp" :ltpId="ltp.id" :ltpName="ltp.name" />
  </div>
</template>

<script>
import axios from 'axios'
import CtpTable from '../Ctp/CtpTable.vue'
import CtpItem from '../Ctp/CtpItem.vue'
import CreateCtp from '../Ctp/CreateCtp.vue'

export default {
  name: 'LtpItem',
  props: ['ltp', 'onDelete', 'onEdit'],
  components: {
    CtpTable,
    CtpItem,
    CreateCtp,
  },
  data: function () {
    return {
      showItem: false,
      showCreateCtp: false,
      selectedCtp: {},
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // CRUD CTP
    getCtp (id) {
      this.showItem = false
      console.log('get ctpId:', id)
      const ctpApi = 'https://localhost:8787/api/topology/ctp/' + id.toString()
      axios.get(ctpApi)
        .then(response => {
          this.selectedCtp = response.data
          this.showItem = true
        })
        .catch(e => {
          console.log(e)
        })
    },

    initAddCtp () {
      console.log('init add CTP on ltpId:', this.ltp.id)
      this.showCreateCtp = true
    },
    postCtp (ctp) {
      axios.post('https://localhost:8787/api/topology/ctp', ctp, {
        headers: {},
      })
        .then(response => {
          console.log(response.data)
          this.showToast('CTP ' + ctp.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 5000,
          })
          this.$emit('refresh', 'ltp.ctp.add')
          this.getCtpsByLtp()
        })
        .catch(e => {
          console.log(e)
          this.showToast('CTP creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 5000,
          })
        })
      this.showCreateCtp = false
    },

    initEditCtp (ctp) {
      console.log('init edit CTP:', ctp.name)
    },
    patchCtp (ctp) {},

    deleteCtp (id) {
      console.log('delete CTP:', id)
      this.$emit('refresh', 'ltp.ctp.delete')
    },

    getCtpsByLtp () {
      const ctpsApi = 'https://localhost:8787/api/topology/ctps/ltp/' + this.ltp.id.toString()
      axios.get(ctpsApi)
        .then(response => {
          this.ltp.vctps = response.data
        })
        .catch(e => {
          console.log(e)
        })
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
