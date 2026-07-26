import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubjectFormData} from '../schemas';
import { subjectSchema } from '../schemas';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useEffect } from 'react';
import type { Subject } from '@budi/types';
import { useDepartments } from '../repositories';

interface SubjectFormProps {
  initialData?: Subject;
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SubjectForm({ initialData, onSubmit, onCancel, isSubmitting }: SubjectFormProps) {
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      department_id: '',
      code: '',
      name: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        department_id: initialData.department_id || '',
        code: initialData.code,
        name: initialData.name,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  return (
    <form id="subject-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Kode Mata Pelajaran"
        {...register('code')}
        error={errors.code?.message}
        placeholder="misal MAT101"
      />

      <Input
        label="Nama Mata Pelajaran"
        {...register('name')}
        error={errors.name?.message}
        placeholder="misal Matematika Lanjut"
      />

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



      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Status Aktif
        </label>
      </div>

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
