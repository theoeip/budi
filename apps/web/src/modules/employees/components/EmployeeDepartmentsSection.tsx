/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useEmployeeDepartments, useRemoveDepartment } from '../repositories/useEmployeeDepartmentRepository';
import { ErrorState, LoadingState } from '@shared/components/data';
import { EmployeeDepartmentDialog } from './EmployeeDepartmentDialog';
import { DepartmentHeadAction } from './DepartmentHeadAction';
import { Alert } from '@shared/components/ui/alert';

interface EmployeeDepartmentsSectionProps {
  employeeId: string;
  canManage: boolean;
}

export function EmployeeDepartmentsSection({ employeeId, canManage }: EmployeeDepartmentsSectionProps) {
  const { data: assignments, isLoading, error } = useEmployeeDepartments(employeeId);
  const removeDept = useRemoveDepartment();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  const handleRemove = async (departmentId: string) => {
    try {
      setRemoveError(null);
      await removeDept.mutateAsync({ id: employeeId, departmentId });
    } catch (err: any) {
      setRemoveError(err.message || 'Failed to remove department assignment');
    }
  };

  return (
    <div className="space-y-4">
      {removeError && (
        <Alert variant="error" message={removeError} />
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Departments</h3>
        {canManage && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
          >
            Assign Department
          </button>
        )}
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {(!assignments || assignments.length === 0) ? (
            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">Not assigned to any departments.</li>
          ) : (
            assignments.map((assignment) => (
              <li key={assignment.department_id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">Department ID: {assignment.department_id}</span>
                  {assignment.is_head_of_department && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Head of Department
                    </span>
                  )}
                </div>
                {canManage && (
                  <div className="flex space-x-4">
                    {!assignment.is_head_of_department && (
                      <DepartmentHeadAction employeeId={employeeId} departmentId={assignment.department_id} />
                    )}
                    <button
                      onClick={() => handleRemove(assignment.department_id)}
                      disabled={removeDept.isPending}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <EmployeeDepartmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeId={employeeId}
        currentAssignments={assignments?.map(a => a.department_id) || []}
      />
    </div>
  );
}
