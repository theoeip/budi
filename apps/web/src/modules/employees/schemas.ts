import { z } from 'zod';

export const employeeFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  employee_number: z.string().optional().nullable(),
  employment_type: z.enum(['Full', 'Part', 'Contract', 'Guest']).optional().nullable(),
  join_date: z.string().optional().nullable(),
  work_email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const employeeProfileSchema = z.object({
  address: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Other']).optional().nullable(),
  place_of_birth: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
});

export type EmployeeProfileFormValues = z.infer<typeof employeeProfileSchema>;

export const employeeHrSchema = z.object({
  nik: z.string().optional().nullable(),
  npwp: z.string().optional().nullable(),
  contract_details: z.any().optional().nullable(), // Store as JSON
});

export type EmployeeHrFormValues = z.infer<typeof employeeHrSchema>;
