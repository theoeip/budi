// Role definitions and permissions configuration.

import type { UserRole } from '@budi/types';

/** Role display configuration */
export interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  level: number; // Higher = more permissions
  color: string; // Role badge color
}

/** All roles with their metadata */
export const ROLES: Record<UserRole, RoleConfig> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access across all schools',
    level: 100,
    color: '#EF4444', // Red
  },
  school_admin: {
    role: 'school_admin',
    label: 'School Admin',
    description: 'Full access within their school',
    level: 90,
    color: '#3B82F6', // Blue
  },
  teacher: {
    role: 'teacher',
    label: 'Teacher',
    description: 'Teaching staff managing classes and academic content',
    level: 80,
    color: '#8B5CF6', // Purple
  },
  staff: {
    role: 'staff',
    label: 'Staff',
    description: 'Administrative and operational staff',
    level: 70,
    color: '#F59E0B', // Amber
  },
  student: {
    role: 'student',
    label: 'Student',
    description: 'Enrolled student with learning access',
    level: 60,
    color: '#06B6D4', // Cyan
  },
  parent: {
    role: 'parent',
    label: 'Parent',
    description: 'Parent or guardian of a student',
    level: 50,
    color: '#EC4899', // Pink
  },
  treasurer: {
    role: 'treasurer',
    label: 'Treasurer',
    description: 'Finance module access within their school',
    level: 65,
    color: '#10B981', // Green
  },
  viewer: {
    role: 'viewer',
    label: 'Viewer',
    description: 'Read-only access within their school',
    level: 10,
    color: '#6B7280', // Gray
  },
};

/** Role hierarchy from lowest to highest */
export const ROLE_HIERARCHY: UserRole[] = [
  'viewer',
  'parent',
  'student',
  'staff',
  'treasurer',
  'teacher',
  'school_admin',
  'super_admin',
];
