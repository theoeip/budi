import type { SemesterInsert, SemesterUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semesterService';

const SEMESTER_QUERY_KEY = (academicYearId: string) => ['semesters', 'academic_year', academicYearId] as const;
const SEMESTER_DETAIL_KEY = (id: string) => ['semesters', id] as const;

export function useSemesters(academicYearId: string) {
  return useQuery({
    queryKey: SEMESTER_QUERY_KEY(academicYearId),
    queryFn: () => semesterService.listByAcademicYear(academicYearId),
    enabled: !!academicYearId,
  });
}

export function useSemester(id: string) {
  return useQuery({
    queryKey: SEMESTER_DETAIL_KEY(id),
    queryFn: () => semesterService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SemesterInsert) => semesterService.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SEMESTER_QUERY_KEY(variables.academic_year_id) });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SemesterUpdate; academicYearId: string }) =>
      semesterService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SEMESTER_QUERY_KEY(variables.academicYearId) });
      queryClient.invalidateQueries({ queryKey: SEMESTER_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; academicYearId: string }) => 
      semesterService.softDelete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SEMESTER_QUERY_KEY(variables.academicYearId) });
    },
  });
}
