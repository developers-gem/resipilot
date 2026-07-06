export const SUPER_ADMIN_NAV = [
  {
    section: 'OVERVIEW',
    items: [
      {
        to: '/super-admin',
        label: 'Dashboard',
        icon: 'ti-layout-dashboard',
      },
    ],
  },

  {
    section: 'CUSTOMERS',
    items: [
      {
        to: '/super-admin/facilities',
        label: 'Facilities',
        icon: 'ti-building',
      },
    //   {
    //     to: '/super-admin/facility-admins',
    //     label: 'Facility Admins',
    //     icon: 'ti-users',
    //   },
      
    ],
  },

  {
    section: 'SUBSCRIPTIONS',
    items: [
      {
        to: '/super-admin/plans',
        label: 'Plans',
        icon: 'ti-package',
      },
      // {
      //   to: '/super-admin/subscriptions',
      //   label: 'Subscriptions',
      //   icon: 'ti-credit-card',
      // },
      {
        to: '/super-admin/platform-billing',
        label: 'Platform Billing',
        icon: 'ti-receipt',
      },
      {
        to: '/super-admin/payments',
        label: 'Payments',
        icon: 'ti-currency-dollar',
      },
      
    ],
  },

  

 
];