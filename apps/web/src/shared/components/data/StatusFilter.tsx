

export type StatusFilterOption = 'All' | 'Active' | 'Inactive' | 'Archived';

interface StatusFilterProps {
  value: StatusFilterOption;
  onChange: (val: StatusFilterOption) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <select
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
      value={value}
      onChange={(e) => onChange(e.target.value as StatusFilterOption)}
    >
      <option value="All">All Statuses</option>
      <option value="Active">Active Only</option>
      <option value="Inactive">Inactive Only</option>
      <option value="Archived">Archived Only</option>
    </select>
  );
}
