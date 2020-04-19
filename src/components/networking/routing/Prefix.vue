<template class="prefix">
  <div>
    <va-card :title="title">
      <div class="row">
        <div class="flex xs8 md3">
          <va-button small color="info" style="max-width: 100%;" @click="addPrefixModal">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            Add prefix
          </va-button>
        </div>

        <div class="flex xs12">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th> Prefix </th>
                <th> Source node </th>
                <th> Status </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prefix, index) in prefixes" :key="index">
                <td>{{ prefix.name }}</td>
                <td>{{ nodeIdNameMap.get(prefix.node) }}</td>
                <td>
                  <va-badge small :color="getStatusColor(prefix.status)" >{{ prefix.status }}</va-badge>
                </td>
                <td>
                  <va-button small color="danger" @click="remove(prefix._id)"> Delete </va-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </va-card>

    <div class="modal-mask" v-if="showModal" >
      <div class="modal-wrapper">
        <div class="modal-container">
          <section class="form">
            <h3 class="title is-7"> Add prefix </h3>
            <va-separator />
            <div class="row">
              <div class="flex xs12 ">
                <div class="x">
                  <label class="label">Node</label>
                  <div class="x">
                    <va-select
                      :label="$t('Select the source node')"
                      v-model="nPrefix.node"
                      textBy="node"
                      :options="Array.from(nodeNameIdMap.keys())"
                    />
                  </div>
                </div>
                <div class="x">
                  <label class="label"> Prefix </label>
                  <div class="x">
                    <va-input  placeholder="e.g., /a/b" v-model="nPrefix.name"/>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="flex xs6 md6 offset--md6">
                  <va-button small color="danger"  @click="cancelModal"> Cancel </va-button>
                  <va-button small  @click="createPrefix"> Submit </va-button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Prefix',
  props: ['nodes', 'prefixes'],

  data: function () {
    return {
      title: 'Registered Prefixes',
      showModal: false,
      nodeNameIdMap: new Map(),
      nodeIdNameMap: new Map(),
      nPrefix: {
        node: '',
        name: '',
        status: '',
      },
    }
  },

  created () {
  },
  watch: {
    nodes: {
      handler: function () {
        this.updateNodeMap()
      },
      deep: true,
    },
  },
  methods: {
    updateNodeMap () {
      this.nodeNameIdMap.clear()
      this.nodeIdNameMap.clear()
      this.nodes.forEach(node => {
        this.nodeNameIdMap.set(node.name, node._id)
        this.nodeIdNameMap.set(node._id, node.name)
      })
    },
    addPrefixModal () {
      this.showModal = true
    },
    createPrefix () {
      this.nPrefix.node = this.nodeNameIdMap.get(this.nPrefix.node)
      const message = {
        action: 'add_reg_pref',
        params: this.nPrefix,
      }
      const context = this
      this.$eventBus.send('nms.routing', message, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
          context.showToast('Failed: cannot reach routing service', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed: prefix not created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Prefix successfuly created', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
      this.showModal = false
    },
    cancelModal () {
      this.showModal = false
    },
    remove (id) {
      const message = {
        action: 'del_reg_pref',
        params: {
          _id: id,
        },
      }
      const context = this
      this.$eventBus.send('nms.routing', message, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
          context.showToast('Failed: cannot reach routing service', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 10000,
          })
        } else {
          const repBody = reply.body
          if (repBody.error) {
            console.error(repBody.error)
            context.showToast('Failed: prefix not deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            context.showToast('Prefix successfuly deleted', {
              icon: 'fa-check',
              position: 'top-right',
              duration: 10000,
            })
          }
        }
      })
    },

    getStatusColor (status) {
      if (status === 'pending') {
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
