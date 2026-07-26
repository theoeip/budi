/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeHrSchema, type EmployeeHrFormValues } from '../schemas';
import { useEmployeeHrRecord, useUpdateEmployeeHrRecord } from '../repositories/useEmployeeHrRepository';
import { useState, useEffect } from 'react';
import { Alert } from '@shared/components/ui/alert';
import { Spinner } from '@shared/components/ui/spinner';
import { ErrorState, PermissionDenied } from '@shared/components/data';

interface EmployeeHrFormProps {
  employeeId: string;
}

export function EmployeeHrForm({ employeeId }: EmployeeHrFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Privacy Enforcement: Data is fetched only when this component mounts
  const { data: hrData, isLoading: isLoadingData, error: fetchError } = useEmployeeHrRecord(employeeId);
  const updateHr = useUpdateEmployeeHrRecord();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeHrFormValues>({
    resolver: zodResolver(employeeHrSchema),
    defaultValues: {
      nik: '',
      npwp: '',
      contract_details: null,
    },
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (hrData) {
      reset({
        nik: hrData.nik || '',
        npwp: hrData.npwp || '',
        contract_details: hrData.contract_details ? JSON.stringify(hrData.contract_details, null, 2) : '',
      });
    }
  }, [hrData, reset]);

  if (isLoadingData) {
    return <div className="p-8 flex justify-center"><Spinner className="w-8 h-8" /></div>;
  }

  // Handle RLS permission denial safely
  if (fetchError) {
    if ((fetchError as any).message?.includes('Permission denied') || (fetchError as any).code === '42501') {
      return <PermissionDenied />;
    }
    // If EmployeeHRRecordNotFoundError, we just allow the form to act as "create" via upsert
    if (fetchError.name !== 'EmployeeHRRecordNotFoundError') {
      return <ErrorState message={fetchError.message} />;
    }
  }

  const handleFormSubmit = async (data: EmployeeHrFormValues) => {
    try {
      setError(null);
      setSuccess(false);

      let parsedContractDetails = null;
      if (data.contract_details) {
        try {
          parsedContractDetails = JSON.parse(data.contract_details);
        } catch {
          throw new Error('Contract details must be valid JSON');
        }
      }

      await updateHr.mutateAsync({
        id: employeeId,
        data: {
          nik: data.nik || null,
          npwp: data.npwp || null,
          contract_details: parsedContractDetails,
        }
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save HR record.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-2xl">
      {error && <Alert variant="error" message={error} />}
      {success && <Alert variant="success" message="HR Record saved successfully." />}

      <div>
        <label className="block text-sm font-medium text-gray-700">National ID (NIK)</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('nik')}
        />
        {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tax ID (NPWP)</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register('npwp')}
        />
        {errors.npwp && <p className="mt-1 text-sm text-red-600">{errors.npwp.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contract Details (JSON)</label>
        <textarea
          rows={6}
          className="mt-1 block w-full font-mono text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('contract_details')}
          placeholder='{ "salary_grade": "A", "bank_account": "..." }'
        />
        {errors.contract_details && <p className="mt-1 text-sm text-red-600">{errors.contract_details.message as string}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={updateHr.isPending}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {updateHr.isPending ? 'Saving...' : 'Save HR Record'}
        </button>
      </div>
    </form>
  );
}
