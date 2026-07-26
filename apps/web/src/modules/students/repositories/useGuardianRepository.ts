import type { GuardianInsert, GuardianUpdate, StudentGuardianInsert, StudentGuardianUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guardianService } from '../services/guardianService';

export const GUARDIAN_QUERY_KEY = (studentId: string) => ['guardians', studentId] as const;

export function useStudentGuardians(studentId: string) {
  return useQuery({
    queryKey: GUARDIAN_QUERY_KEY(studentId),
    queryFn: () => guardianService.listByStudentId(studentId),
    enabled: !!studentId,
  });
}

export function useCreateAndLinkGuardian(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guardian, link }: { guardian: GuardianInsert; link: Omit<StudentGuardianInsert, 'guardian_id'> }) =>
      guardianService.createAndLink(guardian, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIAN_QUERY_KEY(studentId) });
    },
  });
}

export function useLinkExistingGuardian(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (link: StudentGuardianInsert) => guardianService.linkExisting(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIAN_QUERY_KEY(studentId) });
    },
  });
}

export function useUpdateGuardian(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GuardianUpdate }) =>
      guardianService.updateGuardian(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIAN_QUERY_KEY(studentId) });
    },
  });
}

export function useUpdateGuardianLink(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guardianId, input }: { guardianId: string; input: StudentGuardianUpdate }) =>
      guardianService.updateLink(studentId, guardianId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIAN_QUERY_KEY(studentId) });
    },
  });
}

export function useRemoveGuardianLink(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guardianId: string) => guardianService.removeLink(studentId, guardianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIAN_QUERY_KEY(studentId) });
    },
  });
}
