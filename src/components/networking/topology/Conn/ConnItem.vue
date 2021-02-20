<template>
  <div class="trail-details mt-3">
    <div class="row">
      <div class="lg4">
        <div class="text-center">
          <p class="display-5">Connection Details</p>
        </div>
        <div class="mt-3">
          <va-item>
            <va-item-section side>
              <b>Name:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.name }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Label:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.label }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Description:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.description }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Source CTP:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.srcVctpId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Destination CTP:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.destVctpId }}</va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Status:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label> <va-badge small :color="getStatusColor(conn.status)" > {{ conn.status }} </va-badge> </va-item-label>
            </va-item-section>
          </va-item>

          <va-item>
            <va-item-section side>
              <b>Created:</b>
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ conn.created }}</va-item-label>
            </va-item-section>
          </va-item>
        </div>

        <div class="text-center mt-3">
          <va-button small color="danger" @click="onDelete(conn.id)"> Delete </va-button>
          <va-button small color="info" @click="onEdit(conn)"> Edit </va-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getStatusColor } from '../../../../assets/icons/colors.js'
// import axios from 'axios'

export default {
  name: 'ConnItem',
  props: ['conn', 'onDelete', 'onEdit'],
  components: {
  },
  data: function () {
    return {
      getStatusColor,
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
  },
  computed: {},
}
</script>

<style lang="scss">
</style>
