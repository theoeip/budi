import { useState } from 'react';
import type { ClassEntity } from '@budi/types';
import {
  useClasses,
  useAcademicYears,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
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
import { ClassForm } from '../components/ClassForm';
import type { ClassFormData } from '../schemas';

import { useAuth } from '@core/auth/authContext';

export function ClassesPage() {
  const { school } = useAuth();
  const { data: academicYears, isLoading: isAyLoading } = useAcademicYears();
  const [selectedAyIdState, setSelectedAyIdState] = useState<string>('');

  const activeAy = academicYears?.find(ay => ay.is_active) || academicYears?.[0];
  const selectedAyId = selectedAyIdState || activeAy?.id || '';

  const setSelectedAyId = setSelectedAyIdState;

  const { data: items, isLoading: isClassLoading, error, refetch } = useClasses(selectedAyId);
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClassEntity | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: ClassEntity) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: ClassEntity) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: ClassFormData) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, input: data, academicYearId: data.academic_year_id });
      } else {
        if (!school?.id) return;
        await createMutation.mutateAsync({ ...data, code: data.name, school_id: school.id });
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

  if (isAyLoading) return <LoadingState message="Loading context..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const customFilter = (
    <div className="w-full sm:max-w-xs">
      <select
        value={selectedAyId}
        onChange={(e) => setSelectedAyId(e.target.value)}
        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
      >
        <option value="" disabled>Select Academic Year</option>
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
        searchPlaceholder="Search classes..."
        onCreate={selectedAyId ? handleCreate : undefined}
        createLabel="New Class"
        onRefresh={() => refetch()}
        customFilters={customFilter}
      />

      {isClassLoading ? (
        <LoadingState message="Loading classes..." />
      ) : !items?.length ? (
        <EmptyState
          title="No Classes"
          description={selectedAyId ? "No classes found for this academic year." : "Please select an academic year first."}
          actionLabel={selectedAyId ? "Create Class" : undefined}
          onAction={handleCreate}
        />
      ) : (
        <DataTable<ClassEntity>
          data={filteredItems}
          keyExtractor={(item) => item.id}
          columns={[
            {
              key: 'name',
              header: 'Class Name',
              cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
            },
            {
              key: 'grade',
              header: 'Grade',
              cell: (item) => <span className="text-gray-500">Grade {item.grade_level}</span>,
            },
            {
              key: 'capacity',
              header: 'Capacity',
              cell: (item) => <span className="text-gray-500">{item.capacity} students</span>,
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
        title={selectedItem ? 'Edit Class' : 'New Class'}
      >
        <ClassForm
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
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedItem?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
