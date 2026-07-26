import type { StudentInsert, StudentUpdate, StudentProfileInsert, StudentProfileUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';

export const STUDENT_QUERY_KEY = ['students'] as const;
export const STUDENT_DETAIL_KEY = (id: string) => ['students', id] as const;

export function useStudents() {
  return useQuery({
    queryKey: STUDENT_QUERY_KEY,
    queryFn: () => studentService.list(),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: STUDENT_DETAIL_KEY(id),
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ student, profile }: { student: StudentInsert; profile?: Omit<StudentProfileInsert, 'student_id'> }) => 
      studentService.create(student, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEY });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, student, profile }: { id: string; student?: StudentUpdate; profile?: StudentProfileUpdate }) =>
      studentService.update(id, student, profile),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(variables.id) });
    },
  });
}

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      studentService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEY });
    },
  });
}
