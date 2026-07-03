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
      // {
      //   to: '/super-admin/payments',
      //   label: 'Payments',
      //   icon: 'ti-currency-dollar',
      // },
      // {
      //   to: '/super-admin/coupons',
      //   label: 'Coupons',
      //   icon: 'ti-ticket',
      // },
    ],
  },

  // {
  //   section: 'SUPPORT',
  //   items: [
  //     {
  //       to: '/super-admin/support',
  //       label: 'Support Tickets',
  //       icon: 'ti-headset',
  //     },
  //     {
  //       to: '/super-admin/announcements',
  //       label: 'Announcements',
  //       icon: 'ti-speakerphone',
  //     },
  //   ],
  // },

  // {
  //   section: 'SYSTEM',
  //   items: [
  //     {
  //       to: '/super-admin/audit',
  //       label: 'Audit Logs',
  //       icon: 'ti-history',
  //     },
  //     {
  //       to: '/super-admin/settings',
  //       label: 'Settings',
  //       icon: 'ti-settings',
  //     },
  //   ],
  // },
];