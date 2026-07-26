import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassFormData} from '../schemas';
import { classSchema } from '../schemas';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useEffect } from 'react';
import type { ClassEntity } from '@budi/types';
import { useAcademicYears, useDepartments } from '../repositories';

interface ClassFormProps {
  initialData?: ClassEntity;
  defaultAcademicYearId?: string;
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClassForm({ initialData, defaultAcademicYearId, onSubmit, onCancel, isSubmitting }: ClassFormProps) {
  const { data: academicYears } = useAcademicYears();
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      academic_year_id: defaultAcademicYearId || '',
      department_id: '',
      name: '',
      grade_level: 1,
      capacity: 30,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        academic_year_id: initialData.academic_year_id,
        department_id: initialData.department_id || '',
        name: initialData.name,
        grade_level: initialData.grade_level ?? 1,
        capacity: initialData.capacity ?? 30,
        sort_order: initialData.sort_order ?? 0,
      });
    }
  }, [initialData, reset]);

  return (
    <form id="class-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Tahun Ajaran
        </label>
        <select
          {...register('academic_year_id')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
        >
          <option value="">Pilih Tahun Ajaran</option>
          {academicYears?.map(ay => (
            <option key={ay.id} value={ay.id}>{ay.name}</option>
          ))}
        </select>
        {errors.academic_year_id && (
          <p className="mt-2 text-sm text-red-600">{errors.academic_year_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Departemen (Opsional)
        </label>
        <select
          {...register('department_id')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
        >
          <option value="">Tanpa Departemen</option>
          {departments?.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      <Input
        label="Nama Kelas"
        {...register('name')}
        error={errors.name?.message}
        placeholder="misal 10 MIPA A"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Tingkat"
          {...register('grade_level', { valueAsNumber: true })}
          error={errors.grade_level?.message}
        />
        <Input
          type="number"
          label="Kapasitas"
          {...register('capacity', { valueAsNumber: true })}
          error={errors.capacity?.message}
        />
      </div>

      <Input
        type="number"
        label="Urutan"
        {...register('sort_order', { valueAsNumber: true })}
        error={errors.sort_order?.message}
        placeholder="misal 10"
      />

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
