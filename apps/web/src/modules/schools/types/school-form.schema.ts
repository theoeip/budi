// School Management — Zod validation schemas
// Defines form validation rules using Zod + React Hook Form.

import { z } from 'zod';

/**
 * Education level options for Indonesian schools.
 */
export const educationLevelOptions = [
  { value: 'sd', label: 'SD / Sekolah Dasar' },
  { value: 'smp', label: 'SMP / Sekolah Menengah Pertama' },
  { value: 'sma', label: 'SMA / Sekolah Menengah Atas' },
  { value: 'smk', label: 'SMK / Sekolah Menengah Kejuruan' },
  { value: 'mi', label: 'MI / Madrasah Ibtidaiyah' },
  { value: 'mts', label: 'MTS / Madrasah Tsanawiyah' },
  { value: 'ma', label: 'MA / Madrasah Aliyah' },
  { value: 'pkbm', label: 'PKBM / Pusat Kegiatan Belajar Masyarakat' },
  { value: 'other', label: 'Lainnya' },
] as const;

export const EDUCATION_LEVELS = [
  'sd',
  'smp',
  'sma',
  'smk',
  'mi',
  'mts',
  'ma',
  'pkbm',
  'other',
] as const;

/**
 * Zod schema for school form validation.
 */
export const schoolFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama sekolah minimal 3 karakter')
    .max(255, 'Nama sekolah maksimal 255 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  school_code: z
    .string()
    .min(1, 'Kode sekolah wajib diisi')
    .max(50, 'Kode sekolah maksimal 50 karakter'),
  education_level: z.enum(EDUCATION_LEVELS, { message: 'Pilih jenjang pendidikan' }),
  email: z.string().email('Format email tidak valid').or(z.literal('')).optional().default(''),
  phone: z.string().max(50, 'Nomor telepon maksimal 50 karakter').optional().default(''),
  address: z.string().max(500, 'Alamat maksimal 500 karakter').optional().default(''),
  city: z.string().max(100, 'Kota maksimal 100 karakter').optional().default(''),
  province: z.string().max(100, 'Provinsi maksimal 100 karakter').optional().default(''),
  postal_code: z
    .string()
    .regex(/^\d{5}$/, 'Kode pos harus 5 digit angka')
    .or(z.literal(''))
    .optional()
    .default(''),
  website: z.string().url('Format URL tidak valid').or(z.literal('')).optional().default(''),
  principal_name: z
    .string()
    .max(255, 'Nama kepala sekolah maksimal 255 karakter')
    .optional()
    .default(''),
  logo_url: z.string().optional().default(''),
  is_active: z.boolean().default(true),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;
