/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useEmployeeCapabilities, useRevokeCapability } from '../repositories/useEmployeeCapabilityRepository';
import type { CapabilityCode } from '@budi/types';
import { ErrorState, LoadingState } from '@shared/components/data';
import { EmployeeCapabilityDialog } from './EmployeeCapabilityDialog';
import { Alert } from '@shared/components/ui/alert';

interface EmployeeCapabilitiesSectionProps {
  employeeId: string;
  canManage: boolean;
}

export function EmployeeCapabilitiesSection({ employeeId, canManage }: EmployeeCapabilitiesSectionProps) {
  const { data: capabilities, isLoading, error } = useEmployeeCapabilities(employeeId);
  const revokeCapability = useRevokeCapability();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  const handleRevoke = async (capability: CapabilityCode) => {
    try {
      setRevokeError(null);
      await revokeCapability.mutateAsync({ id: employeeId, capability });
    } catch (err: any) {
      setRevokeError(err.message || 'Failed to revoke capability');
    }
  };

  return (
    <div className="space-y-4">
      {revokeError && (
        <Alert variant="error" message={revokeError} />
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Kemampuan</h3>
        {canManage && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
          >
            Beri Kemampuan
          </button>
        )}
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {(!capabilities || capabilities.length === 0) ? (
            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">Tidak ada kemampuan yang diberikan.</li>
          ) : (
            capabilities.map((cap) => (
              <li key={cap.capability} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{cap.capability}</span>
                {canManage && (
                  <button
                    onClick={() => handleRevoke(cap.capability as CapabilityCode)}
                    disabled={revokeCapability.isPending}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    Cabut
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <EmployeeCapabilityDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeId={employeeId}
        currentCapabilities={capabilities?.map(c => c.capability as CapabilityCode) || []}
      />
    </div>
  );
}
