/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeProfileSchema, type EmployeeProfileFormValues } from '../schemas';
import type { EmployeeProfile } from '@budi/types';
import { useState } from 'react';
import { Alert } from '@shared/components/ui/alert';

interface EmployeeProfileFormProps {
  initialData?: EmployeeProfile | null;
  onSubmit: (data: EmployeeProfileFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function EmployeeProfileForm({ initialData, onSubmit, isLoading }: EmployeeProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeProfileFormValues>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      address: initialData?.address || '',
      date_of_birth: initialData?.date_of_birth ? initialData.date_of_birth.split('T')[0] : '',
      gender: initialData?.gender as any || '',
      place_of_birth: initialData?.place_of_birth || '',
      religion: initialData?.religion || '',
    },
  });

  const handleFormSubmit = async (data: EmployeeProfileFormValues) => {
    try {
      setError(null);
      setSuccess(false);
      await onSubmit(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-2xl">
      {error && <Alert variant="error" message={error} />}
      {success && <Alert variant="success" message="Profile saved successfully." />}

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('address')}
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register('place_of_birth')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register('date_of_birth')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register('gender')}
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Religion</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register('religion')}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
