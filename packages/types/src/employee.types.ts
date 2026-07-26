import type { Database } from './supabase';

export type Employee = Database['public']['Tables']['employees']['Row'];
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
export type EmployeeUpdate = Database['public']['Tables']['employees']['Update'];

export type EmployeeProfile = Database['public']['Tables']['employee_profiles']['Row'];
export type EmployeeProfileInsert = Database['public']['Tables']['employee_profiles']['Insert'];
export type EmployeeProfileUpdate = Database['public']['Tables']['employee_profiles']['Update'];

export type EmployeeHRRecord = Database['public']['Tables']['employee_hr_records']['Row'];
export type EmployeeHRRecordInsert = Database['public']['Tables']['employee_hr_records']['Insert'];
export type EmployeeHRRecordUpdate = Database['public']['Tables']['employee_hr_records']['Update'];

export type EmployeeCapability = Database['public']['Tables']['employee_capabilities']['Row'];
export type EmployeeCapabilityInsert = Database['public']['Tables']['employee_capabilities']['Insert'];

export type EmployeeDepartment = Database['public']['Tables']['employee_departments']['Row'];
export type EmployeeDepartmentInsert = Database['public']['Tables']['employee_departments']['Insert'];

export type EmploymentStatus = 'Prospective' | 'Active' | 'On Leave' | 'Suspended' | 'Resigned' | 'Retired' | 'Terminated' | 'Archived';
export type CapabilityCode = 'Teaching' | 'Homeroom' | 'Counseling' | 'DepartmentLeadership' | 'Administration';
