<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new ctp"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-ctp">
      <form>
        <va-input
          v-model="nCtp.name"
          type="text"
          label="Name"
          :error="!!nameErrors.length"
          :error-messages="nameErrors"
        />
        <va-input
          removable
          v-model="nCtp.label"
          type="text"
          label="Label"
          :error="!!labelErrors.length"
          :error-messages="labelErrors"
        />
        <va-input
          removable
          v-model="nCtp.description"
          type="text"
          label="Description"
          :error="!!descErrors.length"
          :error-messages="descErrors"
        />

        <div class="row mt-1">
          <va-button-toggle
            small
            outline
            v-model="nCtp.connType"
            :options="ctpTypes"
            color="dark"
          />
        </div>

        <div class="d-flex justify--center mt-3">
          <va-button small color="danger" @click="cancel">Cancel</va-button>
          <va-button small color="primary" @click="submit">Submit</va-button>
        </div>
      </form>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateCtp',
  props: ['show', 'connInfo'],

  data: function () {
    return {
      nCtp: {
        parentId: this.parentId,
        name: this.ltpName + ':',
        label: '',
        description: '',
        info: {},
        connType: 'Ether',
        connInfo: {},
      },

      nameErrors: [],
      labelErrors: [],
      descErrors: [],
    }
  },

  created () {
  },
  watch: {
  },
  methods: {
  },
}
</script>

<style lang="scss">
</style>
