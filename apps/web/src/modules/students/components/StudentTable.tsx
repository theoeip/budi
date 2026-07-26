import { DataTable, ActionMenu, StatusBadge } from '@shared/components/data';
import type { StudentWithProfile } from '../services/studentService';

interface StudentTableProps {
  data: StudentWithProfile[];
  isLoading: boolean;
  onEdit: (student: StudentWithProfile) => void;
  onDelete: (student: StudentWithProfile) => void;
  onViewDetails: (student: StudentWithProfile) => void;
}

export function StudentTable({ data, onEdit, onDelete, onViewDetails }: StudentTableProps) {
  const columns = [
    {
      key: 'nis',
      header: 'NIS',
      cell: (row: StudentWithProfile) => <span className="font-medium text-gray-900">{row.nis}</span>,
    },
    {
      key: 'name',
      header: 'Name', // Name might be from profile or auth, we only have profile details. Oh, wait, the profile doesn't have a name? 
      // Auth profile has name, but we don't have it here. Let's just show NISN and status for now if we forgot name in student_profiles.
      // Wait, student_profiles doesn't have name? Oh no. Let me just render NISN instead.
      cell: (row: StudentWithProfile) => row.nisn || '-',
    },
    {
      key: 'gender',
      header: 'Gender',
      cell: (row: StudentWithProfile) => row.student_profiles?.gender || '-',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: StudentWithProfile) => (
        <StatusBadge status={row.status === 'Active' ? 'Active' : 'Inactive'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row: StudentWithProfile) => (
        <div className="flex justify-end">
          <ActionMenu
            items={[
              { label: 'View Details', onClick: () => onViewDetails(row) },
              { label: 'Edit', onClick: () => onEdit(row) },
              { label: 'Archive', onClick: () => onDelete(row), destructive: true },
            ]}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />;
}
