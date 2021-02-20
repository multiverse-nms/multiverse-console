<template>
  <div class="ltp-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">LTP Details</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Name:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.name }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Label:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.label }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Description:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.description }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Port:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.port }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>MTU:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.mtu }} bytes</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Busy:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label> <va-badge small :color="getBusyColor(ltp.busy)" > {{ ltp.busy }} </va-badge> </va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Status:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label> <va-badge small :color="getStatusColor(ltp.status)" > {{ ltp.status }} </va-badge> </va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Created:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.created }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Updated:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ltp.updated }}</va-item-label>
            </va-item-section>
          </va-item>
        </div>

        <div class="text-center mt-3">
          <va-button small color="danger" @click="onDelete(ltp.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(ltp)"> Edit </va-button>
        </div>
      </div>

      <div class="lg8">
        <div class="text-center">
          <p class="display-5">CTPs</p>
          <div class="mt-3">
            <ctp-table :ctps="ltp.vctps" :onSelected="getCtp" />
            <va-button small color="warning" @click="initAddCtp()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Add CTP </va-button>
          </div>
        </div>
      </div>

    </div>

    <!-- va-modal
      v-model="showItem"
      size="large"
      hideDefaultActions
    >
      <ctp-item :ctp="selectedCtp" :onDelete="deleteCtp" :onEdit="initEditCtp" />
    </va-modal -->

    <create-ctp @onOk="postCtp" @onCancel="showCreateCtp = false" :show="showCreateCtp" :parentId="ltp.id" />
  </div>
</template>

<script>
import { getStatusColor, getBusyColor } from '../../../../assets/icons/colors.js'
import axios from 'axios'
import CtpTable from '../Ctp/CtpTable.vue'
import CreateCtp from '../Ctp/CreateCtp.vue'

export default {
  name: 'LtpItem',
  props: ['ltp', 'onDelete', 'onEdit'],
  components: {
    CtpTable,
    CreateCtp,
  },
  data: function () {
    return {
      getStatusColor,
      getBusyColor,
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
    },

    initAddCtp () {
      this.showCreateCtp = true
    },
    postCtp (ctp) {
      axios.post(this.$apiURI + '/topology/ctp', ctp, {
        headers: {},
      })
        .then(response => {
          this.showToast('CTP ' + ctp.name + ' created', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getCtpsByLtp()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('CTP creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showCreateCtp = false
    },

    initEditCtp (ctp) {},
    patchCtp (ctp) {},

    deleteCtp (id) {
      axios.delete(this.$apiURI + '/topology/ctp/' + id.toString())
        .then(response => {
          this.$emit('refresh', 'topology.ctp')
          this.showItem = false
          this.getCtpsByLtp()
        })
        .catch(e => {
          // console.log(e)
        })
    },

    getCtpsByLtp () {
      const ctpsApi = this.$apiURI + '/topology/ltp/' + this.ltp.id.toString() + '/ctps'
      axios.get(ctpsApi)
        .then(response => {
          this.ltp.vctps = response.data
        })
        .catch(e => {
          // console.log(e)
        })
    },
  },
  computed: {},
}
</script>

<style lang="scss">
</style>
