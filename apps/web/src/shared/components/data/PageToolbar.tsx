import React from 'react';
import { Button } from '../ui/button';
import { SearchBox } from './SearchBox';
import type { StatusFilterOption } from './StatusFilter';
import { StatusFilter } from './StatusFilter';

interface PageToolbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchPlaceholder?: string;
  onFilterStatus?: (status: StatusFilterOption) => void;
  statusFilter?: StatusFilterOption;
  onRefresh?: () => void;
  onCreate?: () => void;
  createLabel?: string;
  customFilters?: React.ReactNode;
}

export function PageToolbar({
  onSearch,
  searchQuery = '',
  searchPlaceholder,
  onFilterStatus,
  statusFilter = 'All',
  onRefresh,
  onCreate,
  createLabel = 'Create New',
  customFilters,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {onSearch !== undefined && (
          <div className="w-full sm:max-w-xs">
            <SearchBox value={searchQuery} onChange={onSearch} placeholder={searchPlaceholder} />
          </div>
        )}
        {onFilterStatus !== undefined && (
          <div className="w-full sm:max-w-xs">
            <StatusFilter value={statusFilter} onChange={onFilterStatus} />
          </div>
        )}
        {customFilters}
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button variant="secondary" onClick={onRefresh} aria-label="Refresh">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </Button>
        )}
        {onCreate && (
          <Button onClick={onCreate}>
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
