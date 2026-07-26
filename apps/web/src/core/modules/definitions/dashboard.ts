// Dashboard Module Definition — Built-in core dashboard module
// This module owns: Dashboard navigation, core dashboard widgets

import type { ModuleDefinition } from '../types';

/**
 * Dashboard module definition.
 * Registered as a built-in module during application bootstrap.
 */
export const dashboardModule: ModuleDefinition = {
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Core dashboard with user, school, permission, and system status widgets',
  version: '1.0.0',
  enabled: true,
  icon: 'LayoutDashboard',
  order: 0,

  // Navigation — Dashboard link
  navigation: [
    {
      label: 'Dasbor',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['super_admin', 'school_admin', 'treasurer', 'viewer'],
    },
  ],

  // Widgets — Core diagnostic widgets
  widgets: [
    {
      id: 'userSummary',
      title: 'Current User',
      description: 'Authenticated user profile information',
      size: 'third',
      permissionKey: '',
      roles: [],
      order: 1,
    },
    {
      id: 'schoolSummary',
      title: 'School Context',
      description: 'Current school and role information',
      size: 'third',
      permissionKey: '',
      roles: [],
      order: 2,
    },
    {
      id: 'permissionSummary',
      title: 'Permissions',
      description: 'Current role-based permission summary',
      size: 'third',
      permissionKey: '',
      roles: [],
      order: 3,
    },
  ],

  // Routes — Dashboard route metadata
  routes: [
    {
      id: 'dashboard',
      path: '/dashboard',
      componentKey: 'dashboard',
      roles: ['super_admin', 'school_admin', 'treasurer', 'viewer'],
    },
  ],

  // Permissions — Dashboard module permissions
  permissions: [],
};
