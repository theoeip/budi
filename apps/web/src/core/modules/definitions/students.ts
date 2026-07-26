import type { ModuleDefinition } from '../types';

export const studentsModule: ModuleDefinition = {
  id: 'students',
  name: 'Students',
  description: 'Student management — profiles, guardians, and enrollments',
  version: '1.0.0',
  enabled: true,
  icon: 'Users',
  order: 30,

  // Navigation — Students link
  navigation: [
    {
      label: 'Siswa',
      path: '/students',
      icon: 'Users',
      roles: ['super_admin', 'school_admin'],
    },
  ],

  // Widgets
  widgets: [],

  // Routes — Students route metadata
  routes: [
    {
      id: 'students.list',
      path: '/students',
      componentKey: 'studentsList',
      roles: ['super_admin', 'school_admin'],
    },
    {
      id: 'students.details',
      path: '/students/:id',
      componentKey: 'studentDetails',
      roles: ['super_admin', 'school_admin'],
    },
  ],

  // Permissions — Students module declarations
  permissions: [
    { key: 'canManageStudents', description: 'Manage student profiles and enrollments' },
  ],
};
