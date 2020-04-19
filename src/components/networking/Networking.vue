<template>
  <div class="networking">
    <div class="row">
      <div class="flex xs12 lg12">
        <Topology
          @action="topologyEvent"
          :topology="{nodes: nodes, links: links}"
        />
      </div>
    </div>
    <div class="row">
      <div class="flex xs12 lg6">
        <Prefix
          @action="prefixEvent"
          :nodes="nodes"
          :prefixes="prefixes"
        />
      </div>
      <div class="flex xs12 lg6">
        <Route
          @action="routeEvent"
          :nodes="nodes"
          :links="links"
          :prefixes="prefixes"
          :routes="routes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Topology from './topology/Topology.vue'
import Prefix from './routing/Prefix.vue'
import Route from './routing/Route.vue'

export default {
  name: 'networking',
  components: {
    Topology,
    Prefix,
    Route,
  },
  data: function () {
    return {
      nodes: [],
      links: [],
      prefixes: [],
      routes: [],
    }
  },
  created () {
  },

  methods: {
    getTopology () {
      const msgGetTopology = {
        action: 'get_topology',
        params: {},
      }
      const context = this
      context.$eventBus.send('nms.topology', msgGetTopology, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
        } else {
          const repBody = reply.body
          if (repBody.content) {
            context.nodes = repBody.content.nodes
            context.links = repBody.content.links
          }
        }
      })
    },
    getPrefixes () {
      const msgGetPref = {
        action: 'get_all_reg_pref',
        params: {},
      }
      const context = this
      context.$eventBus.send('nms.routing', msgGetPref, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
        } else {
          const repBody = reply.body
          if (repBody.content) {
            context.prefixes = repBody.content.docs
          }
        }
      })
    },
    getRoutes () {
      const msgGetRoutes = {
        action: 'get_all_routes',
        params: {},
      }
      const context = this
      context.$eventBus.send('nms.routing', msgGetRoutes, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
        } else {
          const repBody = reply.body
          if (repBody.content) {
            context.routes = repBody.content.docs
          }
        }
      })
    },

    topologyEvent (action, args) {
      console.log(action, args)
    },
    prefixEvent (action, args) {
      console.log(action, args)
    },
    routeEvent (action, args) {
      console.log(action, args)
    },
  },
  eventbus: {
    lifecycleHooks: {
      created (context, eventbus) {
        context.getTopology()
        context.getPrefixes()
        context.getRoutes()

        // subscribe to topology service info
        eventbus.registerHandler('nms.info.topology', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const content = msg.body.content
          if (JSON.stringify(content) !== JSON.stringify(context.topology)) {
            context.nodes = content.nodes
            context.links = content.links
          }
        })
        // subscribe to routing service info
        eventbus.registerHandler('nms.info.routing.prefixes', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const content = msg.body.content
          if (JSON.stringify(content) !== JSON.stringify(context.prefixes)) {
            context.prefixes = content.docs
          }
        })

        eventbus.registerHandler('nms.info.routing.routes', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const content = msg.body.content
          if (JSON.stringify(content) !== JSON.stringify(context.routes)) {
            context.routes = content.docs
          }
        })
      },
    },
  },
}
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }

  .networking {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
