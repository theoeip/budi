import { useState } from 'react';
import type { Subject } from '@budi/types';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../repositories';
import {
  DataTable,
  PageToolbar,
  CrudDrawer,
  ActionMenu,
  DeleteConfirmDialog,
  StatusBadge,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@shared/components';
import { SubjectForm } from '../components/SubjectForm';
import type { SubjectFormData } from '../schemas';

import { useAuth } from '@core/auth/authContext';

export function SubjectsPage() {
  const { school } = useAuth();
  const { data: items, isLoading, error, refetch } = useSubjects();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Subject | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: Subject) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: Subject) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: SubjectFormData) => {
    try {
      const payload = {
        ...data,
        department_id: data.department_id || null, // Convert empty string to null
      };
      if (selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, input: payload });
      } else {
        if (!school?.id) return;
        await createMutation.mutateAsync({ ...payload, school_id: school.id });
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Mutation failed', err);
    }
  };

  const onConfirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteMutation.mutateAsync(selectedItem.id);
        setIsDeleteDialogOpen(false);
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const filteredItems = items?.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isLoading) return <LoadingState message="Loading subjects..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="p-6">
      <PageToolbar
        onSearch={setSearch}
        searchQuery={search}
        searchPlaceholder="Search subjects by name or code..."
        onCreate={handleCreate}
        createLabel="New Subject"
        onRefresh={() => refetch()}
      />

      {!items?.length ? (
        <EmptyState
          title="No Subjects"
          description="Get started by creating your first subject in the curriculum."
          actionLabel="Create Subject"
          onAction={handleCreate}
        />
      ) : (
        <DataTable<Subject>
          data={filteredItems}
          keyExtractor={(item) => item.id}
          columns={[
            {
              key: 'code',
              header: 'Code',
              cell: (item) => <span className="font-mono text-sm text-gray-600">{item.code}</span>,
            },
            {
              key: 'name',
              header: 'Name',
              cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
            },

            {
              key: 'status',
              header: 'Status',
              cell: (item) => <StatusBadge status={item.is_active} />,
            },
            {
              key: 'actions',
              header: '',
              cell: (item) => (
                <div className="flex justify-end">
                  <ActionMenu
                    items={[
                      { label: 'Edit', onClick: () => handleEdit(item) },
                      { label: 'Delete', onClick: () => handleDeleteClick(item), destructive: true },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      )}

      <CrudDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem ? 'Edit Subject' : 'New Subject'}
      >
        <SubjectForm
          initialData={selectedItem}
          onSubmit={onSubmit}
          onCancel={() => setIsDrawerOpen(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </CrudDrawer>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${selectedItem?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
