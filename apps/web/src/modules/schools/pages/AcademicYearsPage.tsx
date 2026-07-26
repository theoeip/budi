import { useState } from 'react';
import type { AcademicYear } from '@budi/types';
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
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
import { AcademicYearForm } from '../components/AcademicYearForm';
import type { AcademicYearFormData } from '../schemas';

import { useAuth } from '@core/auth/authContext';

export function AcademicYearsPage() {
  const { school } = useAuth();
  const { data: items, isLoading, error, refetch } = useAcademicYears();
  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();
  const deleteMutation = useDeleteAcademicYear();

  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcademicYear | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: AcademicYear) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: AcademicYear) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: AcademicYearFormData) => {
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
    item.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isLoading) return <LoadingState message="Memuat tahun ajaran..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="p-6">
      <PageToolbar
        onSearch={setSearch}
        searchQuery={search}
        searchPlaceholder="Cari tahun ajaran..."
        onCreate={handleCreate}
        createLabel="Tambah Tahun Ajaran"
        onRefresh={() => refetch()}
      />

      {!items?.length ? (
        <EmptyState
          title="Belum Ada Tahun Ajaran"
          description="Mulai dengan membuat tahun ajaran pertama."
          actionLabel="Tambah Tahun Ajaran"
          onAction={handleCreate}
        />
      ) : (
        <DataTable<AcademicYear>
          data={filteredItems}
          keyExtractor={(item) => item.id}
          columns={[
            {
              key: 'name',
              header: 'Nama',
              cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
            },
            {
              key: 'dates',
              header: 'Periode',
              cell: (item) => (
                <span className="text-gray-500">
                  {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                </span>
              ),
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
                      { label: 'Hapus', onClick: () => handleDeleteClick(item), destructive: true },
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
        title={selectedItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
      >
        <AcademicYearForm
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
        title="Hapus Tahun Ajaran"
        message={`Apakah Anda yakin ingin menghapus ${selectedItem?.name}? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
