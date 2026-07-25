// Schools Module Definition — Built-in schools module
// Registers: navigation metadata, route metadata
// No new Schools functionality — captures existing nav/routes

import type { ModuleDefinition } from '../types';

export const schoolsModule: ModuleDefinition = {
  id: 'schools',
  name: 'Schools',
  description: 'School management — CRUD, settings, and configuration',
  version: '1.0.0',
  enabled: true,
  icon: 'Landmark',
  order: 20,

  // Navigation — Schools link
  navigation: [
    {
      label: 'Schools',
      path: '/schools',
      icon: 'Landmark',
      roles: ['super_admin'],
    },
  ],

  // Widgets — Schools widgets (to be implemented in future sprints)
  widgets: [],

  // Routes — Schools route metadata
  routes: [
    {
      id: 'schools.list',
      path: '/schools',
      componentKey: 'schoolList',
      roles: ['super_admin'],
      index: true,
    },
  ],

  // Permissions — Schools module declarations
  permissions: [
    { key: 'canManageSchools', description: 'Manage school settings and configuration' },
  ],
};
