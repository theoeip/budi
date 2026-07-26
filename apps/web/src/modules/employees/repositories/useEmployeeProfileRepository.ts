import type { EmployeeProfileUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeProfileService } from '../services/employeeProfileService';
import { employeeKeys } from './employeeKeys';

export function useEmployeeProfile(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.profile(employeeId),
    queryFn: () => employeeProfileService.get(employeeId),
    enabled: !!employeeId,
  });
}

export function useUpdateEmployeeProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeProfileUpdate }) => employeeProfileService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.profile(variables.id) });
    },
  });
}
