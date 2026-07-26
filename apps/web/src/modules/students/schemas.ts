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
  nis: z.string().min(1, 'NIS wajib diisi'),
  nisn: z.string().optional().nullable(),
  status: z.enum(['Active', 'Suspended', 'Withdrawn', 'Transferred', 'Graduated', 'Dropped Out']).default('Active'),
  admission_date: z.string().min(1, 'Tanggal masuk wajib diisi'),
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
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().min(1, 'Telepon wajib diisi'),
  email: z.string().email('Format email tidak valid').optional().nullable(),
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
  class_id: z.string().uuid('Kelas wajib diisi'),
  academic_year_id: z.string().uuid('Tahun Akademik wajib diisi'),
  enrollment_date: z.string().min(1, 'Tanggal pendaftaran wajib diisi'),
  enrollment_reason: z.string().optional().nullable(),
});

export const withdrawEnrollmentSchema = z.object({
  exit_date: z.string().min(1, 'Tanggal keluar wajib diisi'),
  exit_reason: z.string().min(1, 'Alasan keluar wajib diisi'),
});

export type StudentFormValues = z.infer<typeof createStudentSchema>;
export type GuardianFormValues = z.infer<typeof createAndLinkGuardianSchema>;
export type EnrollmentFormValues = z.infer<typeof classEnrollmentSchema>;
export type WithdrawFormValues = z.infer<typeof withdrawEnrollmentSchema>;
