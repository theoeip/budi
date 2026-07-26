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
    description: 'Akses penuh ke semua sekolah',
    level: 100,
    color: '#EF4444', // Red
  },
  school_admin: {
    role: 'school_admin',
    label: 'Admin Sekolah',
    description: 'Akses penuh di dalam sekolah',
    level: 90,
    color: '#3B82F6', // Blue
  },
  teacher: {
    role: 'teacher',
    label: 'Guru',
    description: 'Staf pengajar yang mengelola kelas dan akademik',
    level: 80,
    color: '#8B5CF6', // Purple
  },
  staff: {
    role: 'staff',
    label: 'Staf',
    description: 'Staf administrasi dan operasional',
    level: 70,
    color: '#F59E0B', // Amber
  },
  student: {
    role: 'student',
    label: 'Siswa',
    description: 'Siswa terdaftar',
    level: 60,
    color: '#06B6D4', // Cyan
  },
  parent: {
    role: 'parent',
    label: 'Orang Tua',
    description: 'Orang tua atau wali siswa',
    level: 50,
    color: '#EC4899', // Pink
  },
  treasurer: {
    role: 'treasurer',
    label: 'Bendahara',
    description: 'Akses modul keuangan sekolah',
    level: 65,
    color: '#10B981', // Green
  },
  viewer: {
    role: 'viewer',
    label: 'Pengamat',
    description: 'Akses hanya lihat di dalam sekolah',
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
