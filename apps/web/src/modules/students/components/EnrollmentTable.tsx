import { DataTable } from '@shared/components/data';
import type { EnrollmentWithDetails } from '../services/enrollmentService';

interface EnrollmentTableProps {
  data: EnrollmentWithDetails[];
  isLoading: boolean;
}

export function EnrollmentTable({ data }: EnrollmentTableProps) {
  const columns = [
    {
      key: 'academic_year',
      header: 'Academic Year',
      cell: (row: EnrollmentWithDetails) => row.academic_years?.name || '-',
    },
    {
      key: 'class',
      header: 'Class',
      cell: (row: EnrollmentWithDetails) => row.classes?.code || '-',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: EnrollmentWithDetails) => row.status,
    },
    {
      key: 'enrollment_date',
      header: 'Enrollment Date',
      cell: (row: EnrollmentWithDetails) => new Date(row.enrollment_date).toLocaleDateString(),
    },
  ];

  return <DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />;
}
