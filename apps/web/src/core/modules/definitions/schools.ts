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
      roles: ['super_admin', 'school_admin'],
      children: [
        { label: 'Academic Years', path: '/schools/academic-years', icon: 'Calendar', roles: ['super_admin', 'school_admin'] },
        { label: 'Semesters', path: '/schools/semesters', icon: 'Calendar', roles: ['super_admin', 'school_admin'] },
        { label: 'Departments', path: '/schools/departments', icon: 'Building', roles: ['super_admin', 'school_admin'] },
        { label: 'Classes', path: '/schools/classes', icon: 'Users', roles: ['super_admin', 'school_admin'] },
        { label: 'Subjects', path: '/schools/subjects', icon: 'BookOpen', roles: ['super_admin', 'school_admin'] }
      ]
    },
  ],

  // Widgets — Schools widgets (to be implemented in future sprints)
  widgets: [],

  // Routes — Schools route metadata
  routes: [
    {
      id: 'schools.academic-years',
      path: '/schools/academic-years',
      componentKey: 'academicYears',
      roles: ['super_admin', 'school_admin'],
    },
    {
      id: 'schools.semesters',
      path: '/schools/semesters',
      componentKey: 'semesters',
      roles: ['super_admin', 'school_admin'],
    },
    {
      id: 'schools.departments',
      path: '/schools/departments',
      componentKey: 'departments',
      roles: ['super_admin', 'school_admin'],
    },
    {
      id: 'schools.classes',
      path: '/schools/classes',
      componentKey: 'classes',
      roles: ['super_admin', 'school_admin'],
    },
    {
      id: 'schools.subjects',
      path: '/schools/subjects',
      componentKey: 'subjects',
      roles: ['super_admin', 'school_admin'],
    },
  ],

  // Permissions — Schools module declarations
  permissions: [
    { key: 'canManageSchools', description: 'Manage school settings and configuration' },
  ],
};
