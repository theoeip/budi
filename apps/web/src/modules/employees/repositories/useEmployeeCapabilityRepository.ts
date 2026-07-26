import type { CapabilityCode } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeCapabilityService } from '../services/employeeCapabilityService';
import { employeeKeys } from './employeeKeys';

export function useEmployeeCapabilities(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.capabilities(employeeId),
    queryFn: () => employeeCapabilityService.list(employeeId),
    enabled: !!employeeId,
  });
}

export function useGrantCapability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, capability }: { id: string; capability: CapabilityCode }) => employeeCapabilityService.grant(id, capability),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.capabilities(variables.id) });
    },
  });
}

export function useRevokeCapability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, capability }: { id: string; capability: CapabilityCode }) => employeeCapabilityService.revoke(id, capability),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.capabilities(variables.id) });
    },
  });
}
