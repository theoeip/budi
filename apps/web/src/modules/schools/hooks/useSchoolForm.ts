// School Management — React Hook Form wrapper
// Provides a pre-configured form instance with Zod validation.

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { schoolFormSchema, type SchoolFormValues } from '../types';

/**
 * Returns default form values with all required fields populated.
 */
function getDefaultValues(overrides?: Partial<SchoolFormValues>): SchoolFormValues {
  return {
    name: '',
    slug: '',
    school_code: '',
    education_level: 'sd' as const,
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    website: '',
    principal_name: '',
    logo_url: '',
    is_active: true,
    ...overrides,
  };
}

/**
 * Hook: Returns a configured React Hook Form instance for school forms.
 * Pre-populates values when editing an existing school.
 */
export function useSchoolForm(defaultValues?: Partial<SchoolFormValues>) {
  return useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: getDefaultValues(defaultValues),
  });
}
