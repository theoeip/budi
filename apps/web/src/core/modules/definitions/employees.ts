import type { ModuleDefinition } from '../types';

export const employeesModule: ModuleDefinition = {
  id: 'employees',
  name: 'Employees',
  description: 'Teachers and Staff management',
  version: '1.0.0',
  enabled: true,
  icon: 'Users',
  order: 40,

  // Navigation — Employees link
  navigation: [
    {
      label: 'Guru & Staf',
      path: '/employees',
      icon: 'Users',
      roles: ['super_admin', 'school_admin', 'staff', 'teacher'],
    },
  ],

  // Widgets
  widgets: [],

  // Routes — Employees route metadata
  routes: [
    {
      id: 'employees.list',
      path: '/employees',
      componentKey: 'employeesList',
      roles: ['super_admin', 'school_admin', 'staff', 'teacher'],
    },
    {
      id: 'employees.details',
      path: '/employees/:id',
      componentKey: 'employeeDetails',
      roles: ['super_admin', 'school_admin', 'staff', 'teacher'],
    },
  ],

  // Permissions — Employees module declarations
  permissions: [
    { key: 'canManageEmployees', description: 'Manage employee profiles and roles' },
  ],
};
