<template>
  <div class="dashboard">
    <!-- dashboard-info-block / -->
    <dashboard-charts :servicesData="serviceInfo" />
  </div>
</template>

<script>
import DashboardCharts from './DashboardCharts'
// import DashboardInfoBlock from './DashboardInfoBlock'

export default {
  name: 'dashboard',
  components: {
    DashboardCharts,
    // DashboardInfoBlock,
  },
  data: function () {
    return {
      serviceInfo: {
        dss: {
          name: 'Data Streaming',
          status: 'stopped',
          activity: 0,
        },
        rest: {
          name: 'REST API',
          status: 'stopped',
          activity: 0,
        },
        storage: {
          name: 'Storage',
          status: 'stopped',
          activity: 0,
        },
        topology: {
          name: 'Topology',
          status: 'stopped',
          activity: 0,
        },
        routing: {
          name: 'Routing',
          status: 'stopped',
          activity: 0,
        },
      },
    }
  },
  methods: {
    getServiceInfo (name) {
      const msgGetInfo = {
        action: 'get_service_info',
        params: {},
      }
      const context = this
      context.$eventBus.send('nms.' + name, msgGetInfo, {}, function (err, reply) {
        if (err) {
          console.log('Error in sending message', err)
        } else {
          const repBody = reply.body
          if (repBody.content) {
            context.serviceInfo[name].status = repBody.content.status
            context.serviceInfo[name].activity = repBody.content.messages
          }
        }
      })
    },
  },
  eventbus: {
    lifecycleHooks: {
      created (context, eventbus) {
        context.getServiceInfo('dss')
        context.getServiceInfo('rest')
        context.getServiceInfo('storage')
        context.getServiceInfo('topology')
        context.getServiceInfo('routing')

        /* eventbus.registerHandler('nms.status', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const content = msg.body.content
          // ...
        })

        eventbus.registerHandler('nms.logs', function (err, msg) {
          if (err) {
            console.log('VertxEventBus error: ', err)
            return
          }
          const content = msg.body.content
          // ...
        }) */
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

  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
