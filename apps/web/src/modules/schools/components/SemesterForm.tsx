import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SemesterFormData} from '../schemas';
import { semesterSchema } from '../schemas';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useEffect } from 'react';
import type { Semester } from '@budi/types';
import { useAcademicYears } from '../repositories';

interface SemesterFormProps {
  initialData?: Semester;
  defaultAcademicYearId?: string;
  onSubmit: (data: SemesterFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SemesterForm({ initialData, defaultAcademicYearId, onSubmit, onCancel, isSubmitting }: SemesterFormProps) {
  const { data: academicYears } = useAcademicYears();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      academic_year_id: defaultAcademicYearId || '',
      name: '',
      term_type: 'Odd',
      start_date: '',
      end_date: '',
      is_active: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        academic_year_id: initialData.academic_year_id,
        name: initialData.name,
        term_type: initialData.term_type,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  return (
    <form id="semester-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Tahun Ajaran
        </label>
        <select
          {...register('academic_year_id')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6"
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

      <Input
        label="Nama Semester"
        {...register('name')}
        error={errors.name?.message}
        placeholder="misal Ganjil 2024"
      />

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Tipe Semester
        </label>
        <select
          {...register('term_type')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="Odd">Ganjil</option>
          <option value="Even">Genap</option>
          <option value="Summer">Antara (Pendek)</option>
        </select>
        {errors.term_type && (
          <p className="mt-2 text-sm text-red-600">{errors.term_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Tanggal Mulai"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
        <Input
          type="date"
          label="Tanggal Selesai"
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
          Jadikan Semester Aktif
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
