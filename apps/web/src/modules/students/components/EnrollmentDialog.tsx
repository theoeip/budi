import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/components/ui/input';
import { classEnrollmentSchema, type EnrollmentFormValues } from '../schemas';

interface EnrollmentDialogProps {
  onSubmit: (data: EnrollmentFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function EnrollmentDialog({ onSubmit }: EnrollmentDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(classEnrollmentSchema) as any,
  });

  return (
    <form id="enrollment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6">
        <Input
          label="Class ID"
          {...register('class_id')}
          error={errors.class_id?.message}
        />
        <Input
          label="Academic Year ID"
          {...register('academic_year_id')}
          error={errors.academic_year_id?.message}
        />
        <Input
          label="Enrollment Date"
          type="date"
          {...register('enrollment_date')}
          error={errors.enrollment_date?.message}
        />
        <Input
          label="Reason"
          {...register('enrollment_reason')}
          error={errors.enrollment_reason?.message}
        />
      </div>
    </form>
  );
}
