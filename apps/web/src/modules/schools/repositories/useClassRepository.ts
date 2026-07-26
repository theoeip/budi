import type { ClassInsert, ClassUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/classService';

const CLASS_QUERY_KEY = (academicYearId: string) => ['classes', 'academic_year', academicYearId] as const;
const CLASS_DETAIL_KEY = (id: string) => ['classes', id] as const;

export function useClasses(academicYearId: string) {
  return useQuery({
    queryKey: CLASS_QUERY_KEY(academicYearId),
    queryFn: () => classService.listByAcademicYear(academicYearId),
    enabled: !!academicYearId,
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: CLASS_DETAIL_KEY(id),
    queryFn: () => classService.getById(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClassInsert) => classService.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY(variables.academic_year_id) });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClassUpdate; academicYearId: string }) =>
      classService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY(variables.academicYearId) });
      queryClient.invalidateQueries({ queryKey: CLASS_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; academicYearId: string }) => 
      classService.softDelete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY(variables.academicYearId) });
    },
  });
}
