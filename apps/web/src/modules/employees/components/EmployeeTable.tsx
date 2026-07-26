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
  return (
    <DataTable
      data={data}
      keyExtractor={(employee) => employee.id}
      columns={[
        {
          header: 'Employee',
          key: 'employee',
          cell: (employee) => (
            <div>
              <div className="font-medium text-gray-900">{employee.full_name}</div>
              {employee.work_email && <div className="text-sm text-gray-500">{employee.work_email}</div>}
            </div>
          ),
        },
        {
          header: 'Employee Number',
          key: 'employee_number',
          cell: (employee) => employee.employee_number || '-'
        },
        {
          header: 'Type',
          key: 'employment_type',
          cell: (employee) => employee.employment_type || '-'
        },
        {
          header: 'Status',
          key: 'employment_status',
          cell: (employee) => <EmployeeStatusBadge status={employee.employment_status as any} />,
        },
        {
          header: 'Actions',
          key: 'id',
          cell: (employee) => {
            const menuItems: ActionMenuItem[] = [
              { label: 'View Details', onClick: () => onViewDetails(employee) }
            ];
            
            if (canManage) {
              menuItems.push({ label: 'Edit', onClick: () => onEdit(employee) });
              menuItems.push({ label: 'Remove Erroneous Record', onClick: () => onDelete(employee), destructive: true });
            }

            return <ActionMenu items={menuItems} />;
          },
        },
      ]}
    />
  );
}
