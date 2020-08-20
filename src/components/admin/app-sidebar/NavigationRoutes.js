export const navigationRoutes = {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        iconClass: 'va-icon fa fa-dashboard',
      },
    },
    {
      name: 'telemetry',
      displayName: 'menu.telemetry',
      meta: {
        iconClass: 'va-icon fa fa-exchange',
      },
    },
    {
      name: 'networking',
      displayName: 'menu.networking',
      meta: {
        iconClass: 'va-icon fa fa-map',
      },
    },
    {
      name: 'notifications',
      displayName: 'menu.notifications',
      meta: {
        iconClass: 'va-icon fa fa-comment',
      },
    },
    {
      name: 'accounts',
      displayName: 'menu.accounts',
      meta: {
        iconClass: 'va-icon fa fa-users',
      },
    },
    {
      name: 'configuration',
      displayName: 'menu.configuration',
      meta: {
        iconClass: 'va-icon fa fa-gears',
      },
    },
    {
      name: 'storage',
      displayName: 'menu.storage',
      meta: {
        iconClass: 'va-icon fa fa-database',
      },
      disabled: true,
      children: [
        {
          name: 'measurements',
          displayName: 'menu.measurements',
          meta: {
            iconClass: 'vuestic-iconset vuestic-iconset-tables',
          },
        },
        {
          name: 'collections',
          displayName: 'menu.collections',
          meta: {
            iconClass: 'vuestic-iconset vuestic-iconset-tables',
          },
        },
      ],
    },
  ],
}
