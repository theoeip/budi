import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AcademicYearFormData} from '../schemas';
import { academicYearSchema } from '../schemas';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useEffect } from 'react';
import type { AcademicYear } from '@budi/types';

interface AcademicYearFormProps {
  initialData?: AcademicYear;
  onSubmit: (data: AcademicYearFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AcademicYearForm({ initialData, onSubmit, onCancel, isSubmitting }: AcademicYearFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  return (
    <form id="academic-year-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="e.g. 2023/2024"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
        <Input
          type="date"
          label="End Date"
          {...register('end_date')}
          error={errors.end_date?.message}
        />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Set as Active Academic Year
        </label>
      </div>

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
