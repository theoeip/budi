// School Management — School List Page
// Displays a searchable, responsive table of all schools.

import type { School } from '@budi/types';
import { Card, CardContent, CardHeader } from '@shared/components';
import { useMemo, useState } from 'react';
import { SchoolTable } from '../components/SchoolTable';
import { useSchools } from '../repositories';

// ---------------------------------------------------------------------------
// Search Logic
// ---------------------------------------------------------------------------

/**
 * Filters a list of schools by name or school code.
 * Client-side filtering — no server round-trip.
 */
function filterSchools(schools: School[], query: string): School[] {
  if (!query.trim()) return schools;
  const lowerQuery = query.toLowerCase();
  return schools.filter((school) => {
    const name = school.name.toLowerCase();
    const code = (school.school_code ?? '').toLowerCase();
    return name.includes(lowerQuery) || code.includes(lowerQuery);
  });
}

// ---------------------------------------------------------------------------
// SearchBar — local component (only used here)
// ---------------------------------------------------------------------------

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by school name or code…"
        aria-label="Search schools"
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results Summary
// ---------------------------------------------------------------------------

function ResultsSummary({ total, filtered }: { total: number; filtered: number }) {
  if (total === 0) return null;

  return (
    <p className="text-sm text-gray-500">
      {filtered === total
        ? `${total} school${total !== 1 ? 's' : ''} total`
        : `Showing ${filtered} of ${total} schools`}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

/**
 * School list page — displays all active schools with client-side search.
 * Accessible only by super_admin role.
 */
export function SchoolListPage() {
  const { data: schools, isLoading, isError, error } = useSchools();
  const [searchQuery, setSearchQuery] = useState('');

  const totalSchools = schools?.length ?? 0;
  const filteredSchools = useMemo(
    () => filterSchools(schools ?? [], searchQuery),
    [schools, searchQuery],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
        <p className="mt-1 text-sm text-gray-600">Manage school tenants in the BUDI platform.</p>
      </div>

      <Card>
        <CardHeader
          title="Schools"
          action={<SearchBar value={searchQuery} onChange={setSearchQuery} />}
        />
        <CardContent>
          {/* Results summary */}
          {!isLoading && !isError && (
            <div className="mb-4">
              <ResultsSummary total={totalSchools} filtered={filteredSchools.length} />
            </div>
          )}

          {/* School table with all states */}
          <SchoolTable
            schools={filteredSchools}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
