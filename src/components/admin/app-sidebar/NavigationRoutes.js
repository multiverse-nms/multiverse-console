export const navigationRoutes = {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    /* {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        iconClass: 'va-icon fa fa-dashboard',
      },
    }, */
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
      name: 'telemetry',
      displayName: 'menu.telemetry',
      meta: {
        iconClass: 'va-icon fa fa-exchange',
      },
      disabled: false,
      children: [
        {
          name: 'measurements',
          displayName: 'menu.measurements',
          meta: {
            iconClass: 'va-icon fa fa-database',
          },
        },
        {
          name: 'results',
          displayName: 'menu.results',
          meta: {
            iconClass: 'vuestic-iconset vuestic-iconset-tables',
          },
        },
      ],
    },
  ],
}
