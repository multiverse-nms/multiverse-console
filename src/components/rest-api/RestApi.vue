<template>
  <div class="dashboard">
    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card :title="$t('restApi.request')">
          <form>
            <div class="row">
              <div class="flex md12 sm12 xs12">
                <va-medium-editor>
                  <span class="default-selection">
                    {{ JSON.stringify(request) }}
                  </span>
                </va-medium-editor>
              </div>
            </div>
            <div class="row">
              <div class="flex md4 sm6 xs12">
                <va-button> {{ $t('restApi.send') }}</va-button>
              </div>
            </div>
          </form>
        </va-card>
        <!-- dashboard-tabs @submit="addAddressToMap"/ -->
      </div>
      <div class="flex xs12 lg6">
        <va-card :title="$t('restApi.response')">

        </va-card>
        <!-- dashboard-map ref="dashboardMap"/ -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'rest-api',
  components: {
  },
  data () {
    return {
      request: {
        service: 'nms.storage',
        action: 'get_all_nodes',
        params: {},
      },
    }
  },
  methods: {
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
