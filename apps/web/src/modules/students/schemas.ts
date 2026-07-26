import { z } from 'zod';

export const studentProfileSchema = z.object({
  gender: z.enum(['Male', 'Female']).optional().nullable(),
  place_of_birth: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
  blood_group: z.string().optional().nullable(),
});

export const studentSchema = z.object({
  nis: z.string().min(1, 'NIS is required'),
  nisn: z.string().optional().nullable(),
  status: z.enum(['Active', 'Suspended', 'Withdrawn', 'Transferred', 'Graduated', 'Dropped Out']).default('Active'),
  admission_date: z.string().min(1, 'Admission date is required'),
});

export const createStudentSchema = z.object({
  student: studentSchema,
  profile: studentProfileSchema.optional(),
});

export const updateStudentSchema = z.object({
  student: studentSchema.partial(),
  profile: studentProfileSchema.partial().optional(),
});

export const guardianSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  address: z.string().optional().nullable(),
});

export const studentGuardianSchema = z.object({
  relationship_type: z.enum(['Father', 'Mother', 'Guardian', 'Sibling']),
  is_primary_contact: z.boolean().default(false),
});

export const createAndLinkGuardianSchema = z.object({
  guardian: guardianSchema,
  link: studentGuardianSchema,
});

export const classEnrollmentSchema = z.object({
  class_id: z.string().uuid('Class is required'),
  academic_year_id: z.string().uuid('Academic Year is required'),
  enrollment_date: z.string().min(1, 'Enrollment date is required'),
  enrollment_reason: z.string().optional().nullable(),
});

export const withdrawEnrollmentSchema = z.object({
  exit_date: z.string().min(1, 'Exit date is required'),
  exit_reason: z.string().min(1, 'Exit reason is required'),
});

export type StudentFormValues = z.infer<typeof createStudentSchema>;
export type GuardianFormValues = z.infer<typeof createAndLinkGuardianSchema>;
export type EnrollmentFormValues = z.infer<typeof classEnrollmentSchema>;
export type WithdrawFormValues = z.infer<typeof withdrawEnrollmentSchema>;
