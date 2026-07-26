import type { ClassEnrollmentInsert, ClassEnrollmentUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollmentService';

export const ENROLLMENT_QUERY_KEY = (studentId: string) => ['enrollments', studentId] as const;

export function useStudentEnrollments(studentId: string) {
  return useQuery({
    queryKey: ENROLLMENT_QUERY_KEY(studentId),
    queryFn: () => enrollmentService.listByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useEnrollStudent(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClassEnrollmentInsert) => enrollmentService.enroll(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEY(studentId) });
    },
  });
}

export function useUpdateEnrollment(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClassEnrollmentUpdate }) =>
      enrollmentService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEY(studentId) });
    },
  });
}

export function useWithdrawEnrollment(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, exitReason, exitDate }: { id: string; exitReason: string; exitDate: string }) =>
      enrollmentService.withdraw(id, exitReason, exitDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEY(studentId) });
    },
  });
}

export function useDeleteEnrollment(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEY(studentId) });
    },
  });
}
