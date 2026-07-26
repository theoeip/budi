import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/components/ui/input';
import { createStudentSchema, type StudentFormValues } from '../schemas';
import type { StudentWithProfile } from '../services/studentService';

interface StudentFormProps {
  initialData?: StudentWithProfile | null;
  onSubmit: (data: StudentFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function StudentForm({ initialData, onSubmit }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(createStudentSchema) as any,
    defaultValues: initialData
      ? {
          student: {
            nis: initialData.nis,
            nisn: initialData.nisn,
            status: (initialData.status as StudentFormValues['student']['status']) || 'Active',
            admission_date: initialData.admission_date,
          },
          profile: initialData.student_profiles
            ? {
                gender: (initialData.student_profiles as any).gender,
                place_of_birth: (initialData.student_profiles as any).place_of_birth,
                date_of_birth: (initialData.student_profiles as any).date_of_birth,
                address: (initialData.student_profiles as any).address,
                religion: (initialData.student_profiles as any).religion,
                blood_group: (initialData.student_profiles as any).blood_group,
              }
            : undefined,
        }
      : {
          student: {
            status: 'Active',
          },
        },
  });

  return (
    <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Student Information</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <Input
            label="NIS (School ID)"
            {...register('student.nis')}
            error={errors.student?.nis?.message}
          />
          <Input
            label="NISN"
            {...register('student.nisn')}
            error={errors.student?.nisn?.message}
          />
          <Input
            label="Admission Date"
            type="date"
            {...register('student.admission_date')}
            error={errors.student?.admission_date?.message}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register('student.status')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Transferred">Transferred</option>
              <option value="Graduated">Graduated</option>
              <option value="Dropped Out">Dropped Out</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              {...register('profile.gender')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <Input
            label="Date of Birth"
            type="date"
            {...register('profile.date_of_birth')}
            error={errors.profile?.date_of_birth?.message}
          />
          <Input
            label="Place of Birth"
            {...register('profile.place_of_birth')}
            error={errors.profile?.place_of_birth?.message}
          />
          <Input
            label="Religion"
            {...register('profile.religion')}
            error={errors.profile?.religion?.message}
          />
          <Input
            label="Blood Group"
            {...register('profile.blood_group')}
            error={errors.profile?.blood_group?.message}
          />
          <div className="sm:col-span-2">
            <Input
              label="Address"
              {...register('profile.address')}
              error={errors.profile?.address?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
