// @budi/types — User and role types

/** User roles in the BUDI platform */
export type UserRole = 'super_admin' | 'school_admin' | 'treasurer' | 'viewer';

/** User profile linked to Supabase auth */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Minimal user info for display */
export interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

/** Role-based permission set */
export interface RolePermissions {
  role: UserRole;
  canManageSchools: boolean;
  canManageUsers: boolean;
  canManageFinance: boolean;
  canManageAcademic: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

/** Auth state for frontend context */
export interface AuthState {
  user: UserProfile | null;
  school: import('./school.types').SchoolProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  permissions: RolePermissions | null;
}

