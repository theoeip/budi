import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DepartmentFormData} from '../schemas';
import { departmentSchema } from '../schemas';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useEffect } from 'react';
import type { Department } from '@budi/types';

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DepartmentForm({ initialData, onSubmit, onCancel, isSubmitting }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      code: '',
      name: '',
    },
  });  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
      });
    }
  }, [initialData, reset]);

  return (
    <form id="department-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Department Code"
        {...register('code')}
        error={errors.code?.message}
        placeholder="e.g. SCI"
        disabled={!!initialData} // Usually code is not editable after creation
      />
      <Input
        label="Department Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="e.g. Science Department"
      />


      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
