import { useState } from 'react';
import { CrudDrawer } from '@shared/components/data';
import { EnrollmentTable } from '../../components/EnrollmentTable';
import { EnrollmentDialog } from '../../components/EnrollmentDialog';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStudentEnrollments, useEnrollStudent } from '../../repositories/useEnrollmentRepository';

interface EnrollmentHistorySectionProps {
  studentId: string;
}

export function EnrollmentHistorySection({ studentId }: EnrollmentHistorySectionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: enrollments, isLoading } = useStudentEnrollments(studentId);
  const enrollStudent = useEnrollStudent(studentId);

  const handleSubmit = (data: any) => {
    enrollStudent.mutate(
      { ...data, student_id: studentId },
      { onSuccess: () => setIsDrawerOpen(false) }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Enrollment History</h3>
        <button onClick={() => setIsDrawerOpen(true)} className="bg-brand-600 text-white px-4 py-2 rounded-md">Enroll Student</button>
      </div>
      <EnrollmentTable data={enrollments || []} isLoading={isLoading} />
      <CrudDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="New Enrollment">
        <EnrollmentDialog onSubmit={handleSubmit} isLoading={enrollStudent.isPending} onCancel={() => setIsDrawerOpen(false)} />
      </CrudDrawer>
    </div>
  );
}
