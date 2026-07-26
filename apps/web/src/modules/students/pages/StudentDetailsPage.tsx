import { useParams } from 'react-router-dom';
import { useStudent } from '../repositories/useStudentRepository';
import { GuardianManagementSection } from './sections/GuardianManagementSection';
import { EnrollmentHistorySection } from './sections/EnrollmentHistorySection';
import { PageToolbar } from '@shared/components/data';

export function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading } = useStudent(id!);

  if (isLoading) return <div>Memuat...</div>;
  if (!student) return <div>Siswa tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Siswa: {student.nis}</h2>
        <p className="mt-1 text-sm text-gray-500">Lihat dan kelola detail siswa.</p>
      </div>
      <PageToolbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GuardianManagementSection studentId={student.id} />
        <EnrollmentHistorySection studentId={student.id} />
      </div>
    </div>
  );
}
