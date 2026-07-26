import type { DepartmentInsert, DepartmentUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/departmentService';

const DEPARTMENT_QUERY_KEY = ['departments'] as const;
const DEPARTMENT_DETAIL_KEY = (id: string) => ['departments', id] as const;

export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEY,
    queryFn: () => departmentService.list(),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: DEPARTMENT_DETAIL_KEY(id),
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DepartmentInsert) => departmentService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DepartmentUpdate }) =>
      departmentService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_DETAIL_KEY(variables.id) });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
    },
  });
}
