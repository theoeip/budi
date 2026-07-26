import type { SubjectInsert, SubjectUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../services/subjectService';

const SUBJECT_QUERY_KEY = ['subjects'] as const;
const SUBJECT_DETAIL_KEY = (id: string) => ['subjects', id] as const;

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECT_QUERY_KEY,
    queryFn: () => subjectService.list(),
  });
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: SUBJECT_DETAIL_KEY(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubjectInsert) => subjectService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SubjectUpdate }) =>
      subjectService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECT_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
    },
  });
}
