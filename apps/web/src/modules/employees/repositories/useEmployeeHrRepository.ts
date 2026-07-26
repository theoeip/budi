import type { EmployeeHRRecordUpdate } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeHrService } from '../services/employeeHrService';
import { employeeKeys } from './employeeKeys';

export function useEmployeeHrRecord(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.hr(employeeId),
    queryFn: () => employeeHrService.get(employeeId),
    enabled: !!employeeId,
  });
}

export function useUpdateEmployeeHrRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeHRRecordUpdate }) => employeeHrService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.hr(variables.id) });
    },
  });
}
