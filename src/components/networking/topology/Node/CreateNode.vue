<template>
  <va-modal
    v-model="showModal"
    size="large"
    title="Create new node"
    hideDefaultActions
    noOutsideDismiss
    noEscDismiss
  >
    <div class="modal-create-node">
      <div class="row">
        <va-notification color="danger" v-if="error != ''">
          {{ error }}
        </va-notification>
      </div>

      <div class="row">
        <div class="flex xs12">
          <label class="label">Name</label>
          <va-input placeholder="e.g., ..." v-model="nNode.name"/>
        </div>
      </div>
      <div class="row mt-5">
        <div class="flex xs6 offset--xs6">
          <va-button  small color="danger" @click="cancel"> Cancel </va-button>
          <va-button  small  @click="submit"> Submit </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script>
export default {
  name: 'CreateNode',
  props: ['show'],

  data: function () {
    return {
      showModal: false,
      error: '',
      nNode: {
        name: '',
      },
    }
  },

  created () {
  },
  watch: {
    show: {
      handler: function () {
        if (this.show === true) {
          this.initCreateNode()
        }
      },
      deep: true,
    },
    /* 'nPrefix.node': function (newVal, oldVal) {
      this.nPrefix.interface = ''
      this.getInterfaces(newVal)
    }, */
  },
  methods: {
    initCreateNode () {
      console.log('init create node modal')
      this.nNode = {
        name: '',
        status: '',
      }
      this.error = ''
      this.showModal = true
    },
    submit () {
      if (this.nNode.name === '') {
        this.error = 'Node name not specified'
        return
      }
      this.$emit('onOk', this.nNode)
      this.showModal = false
    },
    cancel () {
      this.$emit('onCancel')
      this.showModal = false
    },
  },

  /*
  createNodeModal () {
      this.nNode = {
        name: '',
        agent: '',
        itfs: '',
        status: '',
      }
      this.error = ''
      this.showModalNode = true
    },
    addNode () {
      if (this.nNode.name === '') {
        this.error = 'Node name not specified'
        return
      }
      const itfsArray = this.nNode.itfs.split(',')
      if (itfsArray.length === 0) {
        this.error = 'Interfaces not specified'
        return
      }
      this.nNode.itfs = itfsArray
      const message = {
        action: 'add_node',
        params: { node: this.nNode },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to create node', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModalNode = false
    },
    removeNode (id) {
      const message = {
        action: 'del_node',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to delete node', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Node deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    createLinkModal () {
      this.nLink = {
        source: '',
        target: '',
        sourceItf: '',
        targetItf: '',
      }
      this.error = ''
      this.showModalLink = true
    },
    addLink () {
      if ((this.nLink.sourceItf === '') & (this.nLink.targetItf === '')) {
        this.error = 'Interfaces not specified'
        return
      }
      if (this.nLink.source === this.nLink.target) {
        this.error = 'Source and target must be different'
        return
      }
      const sourceId = this.nodeToIdMap.get(this.nLink.source)
      const targetId = this.nodeToIdMap.get(this.nLink.target)
      if (this.findLink(sourceId, targetId)) {
        this.error = 'Link already exists'
        return
      }
      const message = {
        action: 'add_link',
        params: {
          source: sourceId,
          target: targetId,
          sourceItf: this.nLink.sourceItf,
          targetItf: this.nLink.targetItf,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to create link', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Link created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModalLink = false
    },
    removeLink (id) {
      const message = {
        action: 'del_link',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.topology', message, {}, function (err, reply) {
        if (err) {
          console.log('Failed to reach topology service', err)
          context.showToast('Failed to reach topology service', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed to delete link', {
              icon: 'fa-close',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Link deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },
    cancelModal () {
      this.error = ''
      this.showModalNode = false
      this.showModalLink = false
    },
  */
}
</script>

<style lang="scss">
.modal-create-node {
  width: 500px;
  max-width: 500px;
}
</style>
