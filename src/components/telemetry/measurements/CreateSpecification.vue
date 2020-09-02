<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create specification"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-node">

      <form>
        <va-input
          removable
          v-model="fSpec.ts.period"
          type="number"
          label="Period (milliseconds)"
          :min="minPreiod"
          :error="!!periodErrors.length"
          :error-messages="periodErrors"
        />

        <va-date-picker
          label="When"
          :config="{ mode: 'range', inline: true, enableTime: true }"
          v-model="fSpec.ts.when"
        />

        <va-checkbox
          label="Start NOW"
          v-model="fSpec.ts.now"
        />
      </form>

      <div class="d-flex justify--center mt-3">
        <va-button small color="danger" @click="cancel">Cancel</va-button>
        <va-button small color="primary" @click="submit">Submit</va-button>
      </div>

    </div>
  </va-modal>
</template>

<script>

export default {
  name: 'create-specification',
  props: ['show', 'capability'],
  components: {
  },
  data () {
    return {
      showModal: false,
      fSpec: {
        ts: {
          now: false,
          when: '',
          period: 0,
        },
      },
      minPreiod: 10000,
      periodErrors: [],
    }
  },
  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateSpec()
        } else {
          this.showModal = false
        }
      },
      deep: true,
    },
  },
  methods: {
    initCreateSpec () {
      const now = new Date()
      const nowDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      const nowTime = now.getHours() + ':' + now.getMinutes()

      const next = new Date(now)
      next.setHours(now.getHours() + 1)
      const nextDate = next.getFullYear() + '-' + (next.getMonth() + 1) + '-' + next.getDate()
      const newtTime = next.getHours() + ':' + next.getMinutes()

      const startTime = nowDate + ' ' + nowTime
      const stopTime = nextDate + ' ' + newtTime

      const period = Number(this.capability.when.split(' / ')[1])
      this.minPreiod = period
      this.fSpec.ts.period = period
      this.fSpec.ts.when = startTime + ' to ' + stopTime
      this.fSpec.ts.now = false

      this.labelErrors = []
      this.descErrors = []
      this.locationErrors = []

      this.showModal = true
    },
    submit () {
      const range = this.fSpec.ts.when.split(' to ')
      const dStart = new Date(range[0])
      const dStop = new Date(range[1])

      let sStart = 'now'
      if (!this.fSpec.ts.now) {
        if (dStart instanceof Date && !isNaN(dStart)) {
          sStart = String(dStart.getTime())
        } else {
          return
        }
      }

      let sStop = ''
      if (dStop instanceof Date && !isNaN(dStop)) {
        sStop = String(dStop.getTime())
      } else {
        return
      }
      const sPeriod = String(this.fSpec.ts.period)
      const sWhen = sStart + ' ... ' + sStop + ' / ' + sPeriod

      const specification = Object.assign({}, this.capability)
      specification.specification = this.capability.capability
      specification.when = sWhen
      delete specification.capability

      this.$emit('onOk', specification)
      this.showModal = false
    },
    cancel () {
      this.$emit('onCancel')
      this.showModal = false
    },
  },
}
</script>

<style lang="scss">
</style>
