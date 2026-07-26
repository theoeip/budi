import type { EmploymentStatus } from '@budi/types';
import { StatusBadge } from '@shared/components/data';

interface EmployeeStatusBadgeProps {
  status: EmploymentStatus;
  className?: string;
}

export function EmployeeStatusBadge({ status, className }: EmployeeStatusBadgeProps) {
  let color: 'success' | 'warning' | 'error' | 'info' | 'gray' = 'gray';

  switch (status) {
    case 'Active':
      color = 'success';
      break;
    case 'Prospective':
      color = 'info';
      break;
    case 'On Leave':
      color = 'warning';
      break;
    case 'Suspended':
    case 'Terminated':
      color = 'error';
      break;
    case 'Resigned':
    case 'Retired':
    case 'Archived':
      color = 'gray';
      break;
  }

  // @ts-expect-error StatusBadge types don't fully cover EmploymentStatus
  return <StatusBadge status={status} color={color} className={className} />;
}
