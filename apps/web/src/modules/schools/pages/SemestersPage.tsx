import { useState } from 'react';
import type { Semester } from '@budi/types';
import {
  useSemesters,
  useAcademicYears,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
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
import { SemesterForm } from '../components/SemesterForm';
import type { SemesterFormData } from '../schemas';

import { useAuth } from '@core/auth/authContext';

export function SemestersPage() {
  const { school } = useAuth();
  const { data: academicYears, isLoading: isAyLoading } = useAcademicYears();
  const [selectedAyIdState, setSelectedAyIdState] = useState<string>('');

  const activeAy = academicYears?.find(ay => ay.is_active) || academicYears?.[0];
  const selectedAyId = selectedAyIdState || activeAy?.id || '';

  const setSelectedAyId = setSelectedAyIdState;

  const { data: items, isLoading: isSemLoading, error, refetch } = useSemesters(selectedAyId);
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();
  const deleteMutation = useDeleteSemester();

  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Semester | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: Semester) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: Semester) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: SemesterFormData) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, input: data, academicYearId: data.academic_year_id });
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
        await deleteMutation.mutateAsync({ id: selectedItem.id, academicYearId: selectedItem.academic_year_id });
        setIsDeleteDialogOpen(false);
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const filteredItems = items?.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isAyLoading) return <LoadingState message="Memuat konteks..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const customFilter = (
    <div className="w-full sm:max-w-xs">
      <select
        value={selectedAyId}
        onChange={(e) => setSelectedAyId(e.target.value)}
        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
      >
        <option value="" disabled>Pilih Tahun Ajaran</option>
        {academicYears?.map(ay => (
          <option key={ay.id} value={ay.id}>{ay.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6">
      <PageToolbar
        onSearch={setSearch}
        searchQuery={search}
        searchPlaceholder="Cari semester..."
        onCreate={selectedAyId ? handleCreate : undefined}
        createLabel="Tambah Semester"
        onRefresh={() => refetch()}
        customFilters={customFilter}
      />

      {isSemLoading ? (
        <LoadingState message="Memuat semester..." />
      ) : !items?.length ? (
        <EmptyState
          title="Belum Ada Semester"
          description={selectedAyId ? "Tidak ada semester untuk tahun ajaran ini." : "Silakan pilih tahun ajaran terlebih dahulu."}
          actionLabel={selectedAyId ? "Tambah Semester" : undefined}
          onAction={handleCreate}
        />
      ) : (
        <DataTable<Semester>
          data={filteredItems}
          keyExtractor={(item) => item.id}
          columns={[
            {
              key: 'name',
              header: 'Nama',
              cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
            },
            {
              key: 'term',
              header: 'Tipe Semester',
              cell: (item) => <span className="text-gray-500">{item.term_type}</span>,
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
        title={selectedItem ? 'Edit Semester' : 'Tambah Semester'}
      >
        <SemesterForm
          initialData={selectedItem}
          defaultAcademicYearId={selectedAyId}
          onSubmit={onSubmit}
          onCancel={() => setIsDrawerOpen(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </CrudDrawer>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Semester"
        message={`Apakah Anda yakin ingin menghapus ${selectedItem?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
