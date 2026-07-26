/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Employee } from '@budi/types';
import { DataTable, ActionMenu, type ActionMenuItem } from '@shared/components/data';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetails: (employee: Employee) => void;
  canManage: boolean;
}

export function EmployeeTable({
  data,

  onEdit,
  onDelete,
  onViewDetails,
  canManage,
}: EmployeeTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border rounded-lg shadow-sm">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Belum ada data guru/staf</h3>
        <p className="mt-1 text-sm text-gray-500">Silakan tambah data baru.</p>
      </div>
    );
  }

  return (
    <DataTable
      data={data}
      keyExtractor={(employee) => employee.id}
      columns={[
        {
          header: 'Guru/Staf',
          key: 'employee',
          cell: (employee) => (
            <div>
              <div className="font-medium text-gray-900">{employee.full_name}</div>
              {employee.work_email && <div className="text-sm text-gray-500">{employee.work_email}</div>}
            </div>
          ),
        },
        {
          header: 'Nomor Pegawai',
          key: 'employee_number',
          cell: (employee) => employee.employee_number || '-'
        },
        {
          header: 'Jenis Kepegawaian',
          key: 'employment_type',
          cell: (employee) => employee.employment_type || '-'
        },
        {
          header: 'Status',
          key: 'employment_status',
          cell: (employee) => <EmployeeStatusBadge status={employee.employment_status as any} />,
        },
        {
          header: 'Aksi',
          key: 'id',
          cell: (employee) => {
            const menuItems: ActionMenuItem[] = [
              { label: 'Lihat Detail', onClick: () => onViewDetails(employee) }
            ];
            
            if (canManage) {
              menuItems.push({ label: 'Edit', onClick: () => onEdit(employee) });
              menuItems.push({ label: 'Hapus Data', onClick: () => onDelete(employee), destructive: true });
            }

            return <ActionMenu items={menuItems} />;
          },
        },
      ]}
    />
  );
}
