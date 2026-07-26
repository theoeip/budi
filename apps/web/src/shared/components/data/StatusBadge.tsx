

interface StatusBadgeProps {
  status: 'Active' | 'Inactive' | 'Archived' | 'Draft' | 'Closed' | boolean;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800';
  let label = String(status);

  if (status === true || status === 'Active') {
    colorClass = 'bg-green-100 text-green-800';
    label = 'Active';
  } else if (status === false || status === 'Inactive') {
    colorClass = 'bg-red-100 text-red-800';
    label = 'Inactive';
  } else if (status === 'Archived' || status === 'Closed') {
    colorClass = 'bg-yellow-100 text-yellow-800';
  } else if (status === 'Draft') {
    colorClass = 'bg-blue-100 text-blue-800';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
