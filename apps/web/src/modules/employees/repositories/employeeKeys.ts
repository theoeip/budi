export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...employeeKeys.lists(), filters] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
  profile: (id: string) => [...employeeKeys.all, 'profile', id] as const,
  hr: (id: string) => [...employeeKeys.all, 'hr', id] as const,
  capabilities: (id: string) => [...employeeKeys.all, 'capabilities', id] as const,
  departments: (id: string) => [...employeeKeys.all, 'departments', id] as const,
};
