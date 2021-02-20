<template>
  <div class="ctp-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">CTP Details</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Name:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.name }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Label:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.label }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Description:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.description }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Parent:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.parentId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Status:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label> <va-badge small :color="getStatusColor(ctp.status)" > {{ ctp.status }} </va-badge> </va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Created:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.created }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Updated:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ ctp.updated }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Type:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label> <va-badge small color="gray" > {{ ctp.connType }} </va-badge> </va-item-label>
            </va-item-section>
          </va-item>

          <ctp-ether v-if="ctp.connType === 'Ether'" :ctp="ctp.connInfo" ></ctp-ether>
          <ctp-ndn v-if="ctp.connType === 'NDN'" :ctp="ctp.connInfo" ></ctp-ndn>
          <ctp-i-pv4 v-if="ctp.connType === 'IPv4'" :ctp="ctp.connInfo" ></ctp-i-pv4>
        </div>

        <div class="text-center mt-3">
          <va-button small color="danger" @click="onDelete(ctp.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(ctp)"> Edit </va-button>
        </div>
      </div>

      <div class="lg8" v-if="ctp.vctps">
        <div class="text-center">
          <p class="display-5">CTPs</p>
          <div class="mt-3">
            <ctp-table :ctps="ctp.vctps" :onSelected="getCtp" />
            <va-button small color="warning" @click="initAddCtp()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              Add CTP </va-button>
          </div>
        </div>
      </div>
    </div>

    <create-ctp @onOk="postCtp" @onCancel="showCreateCtp = false" :show="showCreateCtp" :parentId="ctp.id" />
  </div>
</template>

<script>
import { getStatusColor } from '../../../../assets/icons/colors.js'
import CtpTable from './CtpTable.vue'
import CreateCtp from './CreateCtp.vue'
import CtpEther from './CtpEther.vue'
import CtpNdn from './CtpNdn.vue'
import CtpIPv4 from './CtpIPv4.vue'
import axios from 'axios'

export default {
  name: 'CtpItem',
  props: ['ctp', 'onEdit', 'onDelete'],
  components: {
    CtpTable,
    CreateCtp,
    CtpEther,
    CtpNdn,
    CtpIPv4,
  },
  data: function () {
    return {
      getStatusColor,
      showCreateCtp: false,
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
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
  },
  computed: {},
}
</script>

<style lang="scss">
</style>
