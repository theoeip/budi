// @budi/types — Shared TypeScript type definitions
// Central export point for all BUDI type definitions.

export type * from './school.types';
export type * from './user.types';
export type * from './finance.types';

// Common utility types used across the platform

/** Generic pagination parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error response */
export interface ApiError {
  message: string;
  code: string;
  details: string | null;
  hint: string | null;
}

/** Entity with standard audit fields */
export interface AuditableEntity {
  id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

/** Soft-deletable entity */
export interface SoftDeletable {
  deleted_at: string | null;
}

