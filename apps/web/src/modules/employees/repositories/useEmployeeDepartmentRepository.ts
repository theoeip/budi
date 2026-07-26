import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeDepartmentService } from '../services/employeeDepartmentService';
import { employeeKeys } from './employeeKeys';

export function useEmployeeDepartments(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.departments(employeeId),
    queryFn: () => employeeDepartmentService.listAssignments(employeeId),
    enabled: !!employeeId,
  });
}

export function useAssignDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, departmentId }: { id: string; departmentId: string }) => employeeDepartmentService.assign(id, departmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.departments(variables.id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.id) });
    },
  });
}

export function useRemoveDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, departmentId }: { id: string; departmentId: string }) => employeeDepartmentService.remove(id, departmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.departments(variables.id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.id) });
    },
  });
}

export function useSetDepartmentHead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, departmentId }: { id: string; departmentId: string }) => employeeDepartmentService.setHead(id, departmentId),
    onSuccess: (_data, variables) => {
      // Both the employee's department cache and potentially lists that show department heads must update
      queryClient.invalidateQueries({ queryKey: employeeKeys.departments(variables.id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
