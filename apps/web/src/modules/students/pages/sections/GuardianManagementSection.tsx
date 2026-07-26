/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { CrudDrawer } from '@shared/components/data';
import { GuardianForm } from '../../components/GuardianForm';
import { useStudentGuardians, useCreateAndLinkGuardian, useRemoveGuardianLink } from '../../repositories/useGuardianRepository';
import type { Guardian } from '@budi/types';
import { DataTable, ActionMenu } from '@shared/components/data';

interface GuardianManagementSectionProps {
  studentId: string;
}

export function GuardianManagementSection({ studentId }: GuardianManagementSectionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: guardians } = useStudentGuardians(studentId);
  const createAndLink = useCreateAndLinkGuardian(studentId);
  const removeLink = useRemoveGuardianLink(studentId);

  const handleSubmit = (data: any) => {
    createAndLink.mutate({ guardian: data.guardian, link: { ...data.link, student_id: studentId } }, {
      onSuccess: () => setIsDrawerOpen(false)
    });
  };

  const columns = [
    { key: 'name', header: 'Name', cell: (r: Guardian) => r.name },
    { key: 'phone', header: 'Phone', cell: (r: Guardian) => r.phone },
    { 
      key: 'actions', 
      header: '', 
      cell: (row: Guardian) => (
        <ActionMenu items={[
          { label: 'Unlink', onClick: () => removeLink.mutate(row.id), destructive: true }
        ]} />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Guardians</h3>
        <button onClick={() => setIsDrawerOpen(true)} className="bg-brand-600 text-white px-4 py-2 rounded-md">Add Guardian</button>
      </div>
      <DataTable columns={columns} data={guardians || []} keyExtractor={(row) => row.id} />
      <CrudDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Guardian">
        <GuardianForm onSubmit={handleSubmit} isLoading={createAndLink.isPending} onCancel={() => setIsDrawerOpen(false)} />
      </CrudDrawer>
    </div>
  );
}
