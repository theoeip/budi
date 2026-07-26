/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { useAssignDepartment } from '../repositories/useEmployeeDepartmentRepository';
import { DomainError } from '@budi/utils';
import { Alert } from '@shared/components/ui/alert';
// Note: In a real implementation we would fetch the list of available departments to display in a dropdown.
// For now, we will provide a text input for the department ID.

interface EmployeeDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  currentAssignments: string[];
}

export function EmployeeDepartmentDialog({ isOpen, onClose, employeeId }: EmployeeDepartmentDialogProps) {
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const assignDepartment = useAssignDepartment();

  const handleSave = () => {
    if (!departmentId) return;
    setError(null);
    assignDepartment.mutate(
      { id: employeeId, departmentId },
      {
        onSuccess: () => {
          setDepartmentId('');
          onClose();
        },
        onError: (err: any) => {
          if (err instanceof DomainError) {
            setError(err.message);
          } else {
            setError(err.message || 'Failed to assign department.');
          }
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
              Assign Department
            </h3>

            {error && (
              <Alert variant="error" className="mb-4" message={error} />
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department ID</label>
                <input
                  type="text"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={assignDepartment.isPending}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="Enter valid UUID..."
                />
              </div>
              
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!departmentId || assignDepartment.isPending}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {assignDepartment.isPending ? 'Saving...' : 'Assign'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
