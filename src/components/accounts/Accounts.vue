<template>
  <div class="accounts">
    <div class="row row-equal">
      <div class="flex xs12 lg6">

        <va-list fit>
          <va-list-label>
            Nodes and Agents
          </va-list-label>

          <va-item v-for="(node, index) in nodes" :key="index">
            <va-item-section side>
              <va-icon name="fa fa-user" :color="getColor(node.hasAgent)" />
            </va-item-section>
            <va-item-section>
              <va-item-label>{{ node.name }}</va-item-label>
            </va-item-section>

            <va-item-section side>
              <va-button v-if="!node.hasAgent" small color="info" @click="initSetAgAccount(node)">
                Setup Agent
              </va-button>
            </va-item-section>
            <va-item-section>
              <va-button v-if="node.hasAgent" small color="warning" @click="initEditAgAccount(node)">
                Edit
              </va-button>
            </va-item-section>
            <va-item-section>
              <va-button v-if="node.hasAgent" small color="danger" @click="deleteAgAccount(node.name)">
                Delete
              </va-button>
            </va-item-section>
          </va-item>

        </va-list>
      </div>
    </div>

    <va-modal
      v-model="showModal"
      title="Set/Edit Agent"
      hideDefaultActions
      noOutsideDismiss
      noEscDismiss
    >
      <div class="x">
        <form>
          <va-input
            readonly
            v-model="nAgent.username"
            type="text"
            label="Username"
          />
          <div class="row">
            <div class="flex xs8">
              <va-input
                v-model="nAgent.password"
                :type="passwordType"
                label="Password"
                :error="!!passwordErrors.length"
                :error-messages="passwordErrors"
              />
            </div>
            <div class="flex xs3 ml-1">
              <a @click="togglepw()"> <va-icon :name="passwordIcon" size="30px"></va-icon> </a>
            </div>
          </div>
          <div class="d-flex justify--center mt-3">
            <va-button small color="danger" @click="cancel">Cancel</va-button>
            <va-button small color="primary" @click="submit">Submit</va-button>
          </div>
        </form>
      </div>
    </va-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'accounts',
  components: {
  },
  data () {
    return {
      nodes: [],
      agents: [],
      nAgent: {
        username: '',
        password: '',
        nodeId: 0,
        role: 'agent',
      },
      showModal: false,
      passwordType: 'password',
      passwordIcon: 'fa fa-eye',

      passwordErrors: [],
    }
  },
  created () {
    this.getAgents()
  },
  methods: {
    getAgents () {
      const nUri = this.$apiURI + '/topology/node'
      axios.get(nUri)
        .then(response => {
          const nodes = response.data
          const agUri = this.$apiURI + '/account/agent/all'
          axios.get(agUri)
            .then(response => {
              this.agents = response.data
              for (let i = 0; i < nodes.length; i++) {
                nodes[i].hasAgent = (this.agents.find(x => x.username === nodes[i].name) !== undefined)
              }
              this.nodes = nodes
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(e => {
          // console.log(e)
        })
    },
    initSetAgAccount (node) {
      this.nAgent.username = node.name
      this.nAgent.nodeId = node.id
      this.nAgent.role = 'agent'
      this.nAgent.password = ''

      this.passwordErrors = []

      this.showModal = true
    },
    initEditAgAccount (node) {
      this.nAgent.username = node.name
      this.nAgent.nodeId = node.id
      this.nAgent.role = 'agent'
      this.nAgent.password = this.agents.find(x => x.username === node.name).password

      this.passwordErrors = []

      this.showModal = true
    },

    submit () {
      if (this.nAgent.password === '') {
        this.passwordErrors = ['Password is required']
        return
      }
      axios.put(this.$apiURI + '/account/agent/' + this.nAgent.username, this.nAgent, {
        headers: {},
      })
        .then(response => {
          this.showToast('Agent ' + this.nAgent.username + ' updated', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getAgents()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Agent creation failed', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
      this.showModal = false
    },
    cancel () {
      this.showModal = false
      this.passwordType = 'password'
      this.passwordIcon = 'fa fa-eye'
    },
    deleteAgAccount (username) {
      axios.delete(this.$apiURI + '/account/agent/' + username, {
        headers: {},
      })
        .then(response => {
          this.showToast('Agent ' + this.nAgent.username + ' deleted', {
            icon: 'fa-check',
            position: 'top-right',
            duration: 3000,
          })
          this.getAgents()
        })
        .catch(e => {
          // console.log(e)
          this.showToast('Failed to delete Agent', {
            icon: 'fa-close',
            position: 'top-right',
            duration: 3000,
          })
        })
    },
    getColor (v) {
      if (v) {
        return 'info'
      } else {
        return 'gray'
      }
    },

    togglepw () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
        this.passwordIcon = 'fa fa-eye-slash'
      } else {
        this.passwordType = 'password'
        this.passwordIcon = 'fa fa-eye'
      }
    },
  },
}
</script>

<style lang="scss">
</style>
