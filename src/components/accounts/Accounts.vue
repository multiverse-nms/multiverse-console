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

            <va-item-section>
              <va-button v-if="!node.hasAgent" small color="info" @click="initSetAgAccount(node)">
                Create Agent
              </va-button>
            </va-item-section>
            <va-item-section>
              <va-button v-if="node.hasAgent" small color="warning" @click="initSetAgAccount(node)">
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
        <div class="row">
          <va-notification color="danger" v-if="error != ''">
            {{ error }}
          </va-notification>
        </div>

        <div class="row">
          <div class="flex xs12">
            <label class="label">Username</label>
            <va-input disabled v-model="nAgent.username"/>
          </div>
        </div>
        <div class="row">
          <div class="flex xs12">
            <label class="label">Password</label>
            <va-input v-model="nAgent.password"/>
          </div>
        </div>
        <div class="row mt-3">
          <div class="flex xs12">
            <va-button  small color="danger" @click="cancel"> Cancel </va-button>
            <va-button  small  @click="submitAgAccount"> Submit </va-button>
          </div>
        </div>
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
      error: '',
    }
  },
  created () {
    this.getAgents()
  },
  methods: {
    getAgents () {
      const nUri = 'https://localhost:8787/api/topology/nodes'
      axios.get(nUri)
        .then(response => {
          const nodes = response.data
          const agUri = 'https://localhost:8787/api/account/agent/all'
          axios.get(agUri)
            .then(response => {
              this.agents = response.data
              for (let i = 0; i < nodes.length; i++) {
                nodes[i].hasAgent = (this.agents.find(x => x.username === nodes[i].name) !== undefined)
              }
              this.nodes = nodes
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(e => {
          console.log(e)
        })
    },
    initSetAgAccount (node) {
      this.nAgent.username = node.name
      this.nAgent.nodeId = node.id
      this.nAgent.role = 'agent'
      this.nAgent.password = ''
      this.error = ''
      this.showModal = true
    },

    submitAgAccount () {
      if (this.nAgent.password === '') {
        this.error = 'Password is required'
        return
      }
      axios.put('https://localhost:8787/api/account/agent/' + this.nAgent.username, this.nAgent, {
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
          console.log(e)
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
    },
    deleteAgAccount (username) {
      axios.delete('https://localhost:8787/api/account/agent/' + username, {
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
          console.log(e)
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
  },
}
</script>

<style lang="scss">
</style>
