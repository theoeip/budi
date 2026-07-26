import { useState } from 'react';
import { PageToolbar, CrudDrawer, DeleteConfirmDialog } from '@shared/components/data';
import { StudentTable } from '../components/StudentTable';
import { StudentForm } from '../components/StudentForm';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../repositories/useStudentRepository';
import type { StudentWithProfile } from '../services/studentService';
import type { StudentFormValues } from '../schemas';
import type { StudentInsert, StudentProfileInsert } from '@budi/types';

export function StudentListPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: students, isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const handleOpenCreate = () => {
    setSelectedStudent(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (student: StudentWithProfile) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleOpenDelete = (student: StudentWithProfile) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (data: StudentFormValues) => {
    if (selectedStudent) {
      updateStudent.mutate(
        { id: selectedStudent.id, student: data.student, profile: data.profile },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createStudent.mutate(
        { student: data.student as unknown as StudentInsert, profile: data.profile as unknown as StudentProfileInsert },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      deleteStudent.mutate(selectedStudent.id, {
        onSuccess: () => setIsDeleteDialogOpen(false),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Students</h2>
        <p className="mt-1 text-sm text-gray-500">Manage all enrolled students in the school</p>
      </div>
      <PageToolbar
        onCreate={handleOpenCreate}
        createLabel="Add Student"
      />

      <StudentTable
        data={students || []}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onViewDetails={() => {}}
      />

      <CrudDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          initialData={selectedStudent}
          onSubmit={handleSubmit}
          isLoading={createStudent.isPending || updateStudent.isPending}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </CrudDrawer>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Archive Student"
        message="Are you sure you want to archive this student? This action can be reversed by restoring them later."
        isDeleting={deleteStudent.isPending}
      />
    </div>
  );
}
