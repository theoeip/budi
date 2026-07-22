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
    level: 80,
    color: '#3B82F6', // Blue
  },
  treasurer: {
    role: 'treasurer',
    label: 'Treasurer',
    description: 'Finance module access within their school',
    level: 60,
    color: '#10B981', // Green
  },
  viewer: {
    role: 'viewer',
    label: 'Viewer',
    description: 'Read-only access within their school',
    level: 20,
    color: '#6B7280', // Gray
  },
};

/** Role hierarchy from lowest to highest */
export const ROLE_HIERARCHY: UserRole[] = ['viewer', 'treasurer', 'school_admin', 'super_admin'];

