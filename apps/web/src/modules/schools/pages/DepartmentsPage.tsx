import { useState } from 'react';
import type { Department } from '@budi/types';
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '../repositories';
import {
  DataTable,
  PageToolbar,
  CrudDrawer,
  ActionMenu,
  DeleteConfirmDialog,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@shared/components';
import { DepartmentForm } from '../components/DepartmentForm';
import type { DepartmentFormData } from '../schemas';

import { useAuth } from '@core/auth/authContext';

export function DepartmentsPage() {
  const { school } = useAuth();
  const { data: items, isLoading, error, refetch } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Department | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: Department) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: Department) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, input: data });
      } else {
        if (!school?.id) return;
        await createMutation.mutateAsync({ ...data, school_id: school.id });
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

  if (isLoading) return <LoadingState message="Loading departments..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="p-6">
      <PageToolbar
        onSearch={setSearch}
        searchQuery={search}
        searchPlaceholder="Search departments..."
        onCreate={handleCreate}
        createLabel="New Department"
        onRefresh={() => refetch()}
      />

      {!items?.length ? (
        <EmptyState
          title="No Departments"
          description="Get started by creating your first academic department."
          actionLabel="Create Department"
          onAction={handleCreate}
        />
      ) : (
        <DataTable<Department>
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
        title={selectedItem ? 'Edit Department' : 'New Department'}
      >
        <DepartmentForm
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
        title="Delete Department"
        message={`Are you sure you want to delete ${selectedItem?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
