// School Management — School Table Component
// Displays school data in a responsive table with loading, error, empty, and success states.

import type { School } from '@budi/types';
import { formatDate } from '@budi/utils';
import { Spinner } from '@shared/components';
import { educationLevelOptions } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map an education level code to its display label.
 */
function educationLevelLabel(code: School['education_level']): string {
  if (!code) return '-';
  const option = educationLevelOptions.find((o) => o.value === code);
  return option?.label ?? code;
}

/**
 * Format an ISO date string to a readable date.
 */
function formatCellDate(date: string | null | undefined): string {
  return formatDate(date, 'id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
          : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-600'}`}
        aria-hidden="true"
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Row Component
// ---------------------------------------------------------------------------

function SchoolRow({ school }: { school: School }) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
        {school.name}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
        {school.school_code ?? '-'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
        {educationLevelLabel(school.education_level)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{school.city ?? '-'}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
        {school.province ?? '-'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <StatusBadge isActive={school.is_active} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {formatCellDate(school.created_at)}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg
        className="mb-4 h-12 w-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-900">No schools found</p>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new school.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg
        className="mb-4 h-12 w-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <p className="text-sm font-medium text-red-800">Failed to load schools</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingBody() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <Spinner size="md" />
          <p className="mt-3 text-sm text-gray-500">Loading schools...</p>
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * Renders a responsive table of schools with full state coverage.
 */
export function SchoolTable({ schools, isLoading, isError, error }: SchoolTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {['School Name', 'Code', 'Level', 'City', 'Province', 'Status', 'Created At'].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {isLoading && <LoadingBody />}

          {isError && (
            <tr>
              <td colSpan={7} className="px-4 py-8">
                <ErrorState message={error?.message ?? 'An unexpected error occurred.'} />
              </td>
            </tr>
          )}

          {!isLoading && !isError && schools.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8">
                <EmptyState />
              </td>
            </tr>
          )}

          {!isLoading && !isError && schools.length > 0 && (
            <>
              {schools.map((school) => (
                <SchoolRow key={school.id} school={school} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
