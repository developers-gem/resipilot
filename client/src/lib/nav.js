// Centralised nav structure — matches the wireframe's 24 sections
export const NAV = [
  { section: 'OVERVIEW', items: [
    { to: '/',             label: 'Dashboard',          icon: 'ti-layout-dashboard' },
    // { to: '/search',       label: 'Global Search',      icon: 'ti-search' },
    // { to: '/notifications',label: 'Notifications',      icon: 'ti-bell' },
  ]},
  
  { section: 'CARE', items: [
    { to: '/residents',    label: 'Residents',          icon: 'ti-users' },
    { to: '/mar',          label: 'MAR (Medications)',  icon: 'ti-pill' },
    { to: '/behavioral',   label: 'Behavioral Log',     icon: 'ti-mood-confuzed' },
    // { to: '/bip',          label: 'BIP Plans',          icon: 'ti-clipboard-list' },
    { to: '/incidents',    label: 'Incident Reports',   icon: 'ti-alert-triangle' },
    { to: '/appointments', label: 'Appointments',       icon: 'ti-calendar-event' },
  ]},
  { section: 'OPERATIONS', items: [
    // { to: '/facilities',   label: 'Facilities',         icon: 'ti-building' },
    { to: '/staff',        label: 'Staff',              icon: 'ti-id-badge' },
    { to: '/training-courses',     label: 'Training courses',   icon: 'ti-certificate' },

    { to: '/training',     label: 'Training & Certs',   icon: 'ti-certificate' },
    // { to: '/workload',     label: 'Tasks / Workload',   icon: 'ti-checklist' },
    { to: '/handoff',      label: 'Shift Handoff',      icon: 'ti-transfer' },
    { to: '/documents',    label: 'Documents Vault',    icon: 'ti-folder' },
  ]},
  // { section: 'COMPLIANCE', items: [
  //   { to: '/licensing',    label: 'State Licensing',    icon: 'ti-license' },
  //   { to: '/hipaa',        label: 'HIPAA Access Log',   icon: 'ti-shield-lock' },
  //   { to: '/audit',        label: 'Audit Trail',        icon: 'ti-history' },
  //   { to: '/outcomes',     label: 'Outcome Metrics',    icon: 'ti-chart-line' },
  //   { to: '/court-report', label: 'Court Reports',      icon: 'ti-gavel' },
  // ]},

  {
  section: 'Billing',

  items: [
    {
      to: '/billing',
      label: 'Dashboard',
      icon: 'ti-layout-dashboard',
    },

    // {
    //   to: '/billing/residents',
    //   label: 'Residents',
    //   icon: 'ti-users',
    // },

    {
      to: '/billing/services',
      label: 'Services',
      icon: 'ti-briefcase',
    },

    {
      to: '/billing/service-logs',
      label: 'Service Logs',
      icon: 'ti-clipboard-list',
    },

    {
      to: '/billing/invoices',
      label: 'Invoices',
      icon: 'ti-file-invoice',
    },

    {
      to: '/billing/payments',
      label: 'Payments',
      icon: 'ti-cash',
    },

    {
      to: '/billing/payers',
      label: 'Payers',
      icon: 'ti-building-bank',
    },
  ],
},
 {
  section: 'INTAKE / DISCHARGE',
  items: [
    {
      to: '/guardian-portal',
      label: 'Guardian Management',
      icon: 'ti-user-heart'
    }
  ]
},


// {
//   section: 'GUARDIAN PORTAL',
//   items: [
//     {
//       to: '/guardian',
//       label: 'Dashboard',
//       icon: 'ti-layout-dashboard'
//     },
//     {
//       to: '/guardian/children',
//       label: 'My Children',
//       icon: 'ti-users'
//     },
//     {
//       to: '/guardian/behavior',
//       label: 'Behavior Reports',
//       icon: 'ti-mood-confuzed'
//     },
//     {
//       to: '/guardian/visits',
//       label: 'Visits',
//       icon: 'ti-calendar-event'
//     },
//     {
//       to: '/guardian/messages',
//       label: 'Messages',
//       icon: 'ti-message'
//     },
    
//   ]
// },

  { section: 'ACCOUNT', items: [
    // { to: '/profile',      label: 'My Profile',         icon: 'ti-user-circle' },
    { to: '/settings',     label: 'Settings',           icon: 'ti-settings' },
  ]},
];
