import { z } from 'zod';

export const academicYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean(),
}).refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});
export type AcademicYearFormData = z.infer<typeof academicYearSchema>;

export const semesterSchema = z.object({
  academic_year_id: z.string().uuid('Academic Year is required'),
  name: z.string().min(1, 'Name is required'),
  term_type: z.string(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean(),
}).refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});
export type SemesterFormData = z.infer<typeof semesterSchema>;

export const departmentSchema = z.object({
  code: z.string().min(1, 'Code is required').max(20, 'Code is too long'),
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean(),
});
export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const classSchema = z.object({
  academic_year_id: z.string().uuid('Academic Year is required'),
  department_id: z.string().uuid('Department is required'),
  name: z.string().min(1, 'Name is required'),
  grade_level: z.number().int().min(1).max(12),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  sort_order: z.number().int(),
});
export type ClassFormData = z.infer<typeof classSchema>;

export const subjectSchema = z.object({
  department_id: z.string().uuid('Department is required').nullable().optional(),
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean(),
});
export type SubjectFormData = z.infer<typeof subjectSchema>;
