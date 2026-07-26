import { useState } from 'react';
import { PageToolbar, CrudDrawer, DeleteConfirmDialog } from '@shared/components/data';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../repositories/useEmployeeRepository';
import type { EmployeeFormValues } from '../schemas';
import type { EmployeeInsert, Employee } from '@budi/types';
import { useAuth } from '@core/auth';
import { useNavigate } from 'react-router-dom';

export function EmployeeListPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { role } = useAuth();
  const canManage = ['super_admin', 'school_admin'].includes(role || '');

  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: EmployeeFormValues) => {
    if (selectedEmployee) {
      await updateEmployee.mutateAsync({ id: selectedEmployee.id, data: data as unknown as Record<string, unknown> });
      setIsDrawerOpen(false);
    } else {
      await createEmployee.mutateAsync(data as unknown as EmployeeInsert);
      setIsDrawerOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      deleteEmployee.mutate(selectedEmployee.id, {
        onSuccess: () => setIsDeleteDialogOpen(false),
      });
    }
  };

  const handleViewDetails = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Teachers & Staff</h2>
        <p className="mt-1 text-sm text-gray-500">Manage school employees and staff members.</p>
      </div>
      
      {canManage && (
        <PageToolbar
          onCreate={handleOpenCreate}
          createLabel="Add Employee"
        />
      )}

      <EmployeeTable
        data={employees || []}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onViewDetails={handleViewDetails}
        canManage={canManage}
      />

      <CrudDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          initialData={selectedEmployee}
          onSubmit={handleSubmit}
          isLoading={createEmployee.isPending || updateEmployee.isPending}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </CrudDrawer>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Remove Erroneous Record"
        message="Are you sure you want to completely remove this erroneous record? Note: If this employee simply left the school, use 'Change Status -> Resigned/Archived' instead."
        isDeleting={deleteEmployee.isPending}
      />
    </div>
  );
}
