// Centralised nav structure — matches the wireframe's 24 sections
export const NAV = [
  { section: 'OVERVIEW', items: [
    { to: '/',             label: 'Dashboard',          icon: 'ti-layout-dashboard' },
    { to: '/search',       label: 'Global Search',      icon: 'ti-search' },
    { to: '/notifications',label: 'Notifications',      icon: 'ti-bell' },
  ]},
  { section: 'CARE', items: [
    { to: '/residents',    label: 'Residents',          icon: 'ti-users' },
    { to: '/mar',          label: 'MAR (Medications)',  icon: 'ti-pill' },
    { to: '/behavioral',   label: 'Behavioral Log',     icon: 'ti-mood-confuzed' },
    { to: '/bip',          label: 'BIP Plans',          icon: 'ti-clipboard-list' },
    { to: '/incidents',    label: 'Incident Reports',   icon: 'ti-alert-triangle' },
    { to: '/appointments', label: 'Appointments',       icon: 'ti-calendar-event' },
  ]},
  { section: 'OPERATIONS', items: [
    { to: '/facilities',   label: 'Facilities',         icon: 'ti-building' },
    { to: '/staff',        label: 'Staff',              icon: 'ti-id-badge' },
    { to: '/training',     label: 'Training & Certs',   icon: 'ti-certificate' },
    { to: '/workload',     label: 'Tasks / Workload',   icon: 'ti-checklist' },
    { to: '/handoff',      label: 'Shift Handoff',      icon: 'ti-transfer' },
    { to: '/documents',    label: 'Documents Vault',    icon: 'ti-folder' },
  ]},
  { section: 'COMPLIANCE', items: [
    { to: '/licensing',    label: 'State Licensing',    icon: 'ti-license' },
    { to: '/hipaa',        label: 'HIPAA Access Log',   icon: 'ti-shield-lock' },
    { to: '/audit',        label: 'Audit Trail',        icon: 'ti-history' },
    { to: '/outcomes',     label: 'Outcome Metrics',    icon: 'ti-chart-line' },
    { to: '/court-report', label: 'Court Reports',      icon: 'ti-gavel' },
  ]},
  { section: 'INTAKE / DISCHARGE', items: [
    { to: '/discharge',    label: 'Discharge Planning', icon: 'ti-logout' },
    { to: '/guardian-portal', label: 'Guardian Portal', icon: 'ti-user-heart' },
  ]},
  { section: 'ACCOUNT', items: [
    { to: '/profile',      label: 'My Profile',         icon: 'ti-user-circle' },
    { to: '/settings',     label: 'Settings',           icon: 'ti-settings' },
  ]},
];
