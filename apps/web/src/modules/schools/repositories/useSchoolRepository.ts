// School Management — TanStack Query Repository
// Provides React hooks for school data operations with caching and optimistic updates.

import type { School } from '@budi/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schoolService } from '../services/schoolService';

const SCHOOL_QUERY_KEY = ['schools'] as const;
const SCHOOL_DETAIL_KEY = (id: string) => ['schools', id] as const;

/**
 * Hook: Fetch all active schools.
 */
export function useSchools() {
  return useQuery({
    queryKey: SCHOOL_QUERY_KEY,
    queryFn: () => schoolService.list(),
  });
}

/**
 * Hook: Fetch a single school by ID.
 */
export function useSchool(id: string) {
  return useQuery({
    queryKey: SCHOOL_DETAIL_KEY(id),
    queryFn: () => schoolService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook: Create a new school.
 */
export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<School>) => schoolService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });
}

/**
 * Hook: Update an existing school.
 */
export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<School> }) =>
      schoolService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SCHOOL_DETAIL_KEY(variables.id) });
    },
  });
}

/**
 * Hook: Soft-delete a school.
 */
export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => schoolService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });
}

/**
 * Hook: Restore a soft-deleted school.
 */
export function useRestoreSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => schoolService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });
}

/**
 * Hook: Toggle school active/inactive status.
 */
export function useToggleSchoolStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      schoolService.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });
}
