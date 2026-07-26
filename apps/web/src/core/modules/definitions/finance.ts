// Finance Module Definition — Built-in finance module
// Registers: navigation metadata, route metadata, and permission declarations
// No new Finance functionality — captures existing nav/routes/permissions

import type { ModuleDefinition } from '../types';

export const financeModule: ModuleDefinition = {
  id: 'finance',
  name: 'Finance',
  description: 'Financial management — transactions, accounts, categories, reports',
  version: '1.0.0',
  enabled: true,
  icon: 'Wallet',
  order: 10,

  // Navigation — Finance menu with children
  navigation: [
    {
      label: 'Keuangan',
      path: '/finance',
      icon: 'Wallet',
      roles: ['super_admin', 'school_admin', 'treasurer'],
      children: [
        {
          label: 'Ringkasan',
          path: '/finance',
          icon: 'BarChart3',
          roles: ['super_admin', 'school_admin', 'treasurer'],
        },
        /* Features not yet implemented in this phase
        {
          label: 'Transactions',
          path: '/finance/transactions',
          icon: 'ArrowLeftRight',
          roles: ['super_admin', 'school_admin', 'treasurer'],
        },
        {
          label: 'Categories',
          path: '/finance/categories',
          icon: 'Tags',
          roles: ['super_admin', 'school_admin'],
        },
        {
          label: 'Accounts',
          path: '/finance/accounts',
          icon: 'Landmark',
          roles: ['super_admin', 'school_admin', 'treasurer'],
        },
        {
          label: 'Reports',
          path: '/finance/reports',
          icon: 'FileBarChart',
          roles: ['super_admin', 'school_admin', 'treasurer', 'viewer'],
        },
        {
          label: 'Settings',
          path: '/finance/settings',
          icon: 'Settings',
          roles: ['super_admin', 'school_admin'],
        },
        */
      ],
    },
  ],

  // Widgets — Finance widgets (to be implemented in future sprints)
  widgets: [],

  // Routes — Finance route metadata (componentKey resolved by route resolver)
  routes: [
    {
      id: 'finance.overview',
      path: '/finance',
      componentKey: 'financeOverview',
      permission: 'canManageFinance',
      roles: ['super_admin', 'school_admin', 'treasurer'],
      index: true,
    },
  ],

  // Permissions — Finance module declarations
  permissions: [
    { key: 'canManageFinance', description: 'Manage financial operations' },
    { key: 'canViewReports', description: 'View financial reports' },
    { key: 'canExportData', description: 'Export financial data' },
  ],
};
