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
      header: 'Nama', 
      cell: (row: StudentWithProfile) => row.nisn || '-',
    },
    {
      key: 'gender',
      header: 'Jenis Kelamin',
      cell: (row: StudentWithProfile) => {
        const gender = row.student_profiles?.gender;
        return gender === 'Male' ? 'Laki-laki' : gender === 'Female' ? 'Perempuan' : '-';
      }
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
              { label: 'Lihat Detail', onClick: () => onViewDetails(row) },
              { label: 'Edit', onClick: () => onEdit(row) },
              { label: 'Arsipkan', onClick: () => onDelete(row), destructive: true },
            ]}
          />
        </div>
      ),
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border rounded-lg shadow-sm">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Belum ada data siswa</h3>
        <p className="mt-1 text-sm text-gray-500">Silakan tambah data siswa baru.</p>
      </div>
    );
  }

  return <DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />;
}
