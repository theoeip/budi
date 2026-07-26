import type { AcademicYearInsert, AcademicYearUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { academicYearService } from '../services/academicYearService';

const ACADEMIC_YEAR_QUERY_KEY = ['academic_years'] as const;
const ACADEMIC_YEAR_DETAIL_KEY = (id: string) => ['academic_years', id] as const;

export function useAcademicYears() {
  return useQuery({
    queryKey: ACADEMIC_YEAR_QUERY_KEY,
    queryFn: () => academicYearService.list(),
  });
}

export function useAcademicYear(id: string) {
  return useQuery({
    queryKey: ACADEMIC_YEAR_DETAIL_KEY(id),
    queryFn: () => academicYearService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AcademicYearInsert) => academicYearService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AcademicYearUpdate }) =>
      academicYearService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicYearService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
    },
  });
}
