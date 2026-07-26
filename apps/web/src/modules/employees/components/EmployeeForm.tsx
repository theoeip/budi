/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, type EmployeeFormValues } from '../schemas';
import type { Employee } from '@budi/types';
import { DomainError } from '@budi/utils';
import { useState } from 'react';
import { Alert } from '@shared/components/ui/alert';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EmployeeForm({ initialData, onSubmit, isLoading, onCancel }: EmployeeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      employee_number: initialData?.employee_number || '',
      employment_type: initialData?.employment_type as any || 'Full',
      join_date: initialData?.join_date ? initialData.join_date.split('T')[0] : '',
      work_email: initialData?.work_email || '',
    },
  });

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err: any) {
      if (err instanceof DomainError) {
        setError(err.message);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && <Alert variant="error" message={error} />}

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('full_name')}
        />
        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
      </div>

      <div>
        <label htmlFor="employee_number" className="block text-sm font-medium text-gray-700">
          Employee Number
        </label>
        <input
          type="text"
          id="employee_number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('employee_number')}
        />
        {errors.employee_number && <p className="mt-1 text-sm text-red-600">{errors.employee_number.message}</p>}
      </div>
      
      <div>
        <label htmlFor="work_email" className="block text-sm font-medium text-gray-700">
          Work Email
        </label>
        <input
          type="email"
          id="work_email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('work_email')}
        />
        {errors.work_email && <p className="mt-1 text-sm text-red-600">{errors.work_email.message}</p>}
      </div>

      <div>
        <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">
          Employment Type
        </label>
        <select
          id="employment_type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('employment_type')}
        >
          <option value="Full">Full Time</option>
          <option value="Part">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Guest">Guest</option>
        </select>
        {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type.message}</p>}
      </div>

      <div>
        <label htmlFor="join_date" className="block text-sm font-medium text-gray-700">
          Join Date
        </label>
        <input
          type="date"
          id="join_date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('join_date')}
        />
        {errors.join_date && <p className="mt-1 text-sm text-red-600">{errors.join_date.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
