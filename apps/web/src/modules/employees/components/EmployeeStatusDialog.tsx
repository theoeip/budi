/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import type { EmploymentStatus } from '@budi/types';
import { useUpdateEmploymentStatus } from '../repositories/useEmployeeRepository';
import { getValidEmploymentTransitions, EMPLOYMENT_TERMINAL_STATES } from '../services/employeeService';
import { DomainError } from '@budi/utils';
import { Alert } from '@shared/components/ui/alert';

interface EmployeeStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  currentStatus: EmploymentStatus;
}

export function EmployeeStatusDialog({ isOpen, onClose, employeeId, currentStatus }: EmployeeStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<EmploymentStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  
  const updateStatus = useUpdateEmploymentStatus();

  const isTerminal = EMPLOYMENT_TERMINAL_STATES.includes(currentStatus);
  const availableStatuses = getValidEmploymentTransitions(currentStatus);

  const handleSave = () => {
    setError(null);
    updateStatus.mutate(
      { id: employeeId, status: selectedStatus },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          if (err instanceof DomainError) {
            setError(err.message);
          } else {
            setError(err.message || 'Failed to update status.');
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
              Change Employment Status
            </h3>

            {isTerminal && (
              <Alert variant="warning" className="mb-4" message={`This employee is in a terminal state (${currentStatus}) and their status cannot be changed.`} />
            )}

            {error && (
              <Alert variant="error" className="mb-4" message={error} />
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as EmploymentStatus)}
                  disabled={isTerminal || updateStatus.isPending}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                >
                  <option value={currentStatus}>{currentStatus} (Current)</option>
                  {availableStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isTerminal || updateStatus.isPending || selectedStatus === currentStatus}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {updateStatus.isPending ? 'Saving...' : 'Save'}
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
