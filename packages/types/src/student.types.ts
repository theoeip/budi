import type { Database } from './supabase';

export type Student = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export type StudentProfile = Database['public']['Tables']['student_profiles']['Row'];
export type StudentProfileInsert = Database['public']['Tables']['student_profiles']['Insert'];
export type StudentProfileUpdate = Database['public']['Tables']['student_profiles']['Update'];

export type Guardian = Database['public']['Tables']['guardians']['Row'];
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert'];
export type GuardianUpdate = Database['public']['Tables']['guardians']['Update'];

export type StudentGuardian = Database['public']['Tables']['student_guardians']['Row'];
export type StudentGuardianInsert = Database['public']['Tables']['student_guardians']['Insert'];
export type StudentGuardianUpdate = Database['public']['Tables']['student_guardians']['Update'];

export type ClassEnrollment = Database['public']['Tables']['class_enrollments']['Row'];
export type ClassEnrollmentInsert = Database['public']['Tables']['class_enrollments']['Insert'];
export type ClassEnrollmentUpdate = Database['public']['Tables']['class_enrollments']['Update'];
