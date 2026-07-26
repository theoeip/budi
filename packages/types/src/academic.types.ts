import type { Database } from './supabase';

export type AcademicYear = Database['public']['Tables']['academic_years']['Row'];
export type AcademicYearInsert = Database['public']['Tables']['academic_years']['Insert'];
export type AcademicYearUpdate = Database['public']['Tables']['academic_years']['Update'];

export type Semester = Database['public']['Tables']['semesters']['Row'];
export type SemesterInsert = Database['public']['Tables']['semesters']['Insert'];
export type SemesterUpdate = Database['public']['Tables']['semesters']['Update'];

export type Department = Database['public']['Tables']['departments']['Row'];
export type DepartmentInsert = Database['public']['Tables']['departments']['Insert'];
export type DepartmentUpdate = Database['public']['Tables']['departments']['Update'];

export type ClassEntity = Database['public']['Tables']['classes']['Row'];
export type ClassInsert = Database['public']['Tables']['classes']['Insert'];
export type ClassUpdate = Database['public']['Tables']['classes']['Update'];

export type Subject = Database['public']['Tables']['subjects']['Row'];
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];
export type SubjectUpdate = Database['public']['Tables']['subjects']['Update'];
