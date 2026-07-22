// Shared Constants — index
// Application-wide constant values.

export const APP_NAME = 'BUDI';
export const APP_VERSION = '0.1.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const;

// Dates
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const DISPLAY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

// API Query Keys
export const QUERY_KEYS = {
  transactions: 'finance-transactions',
  categories: 'finance-categories',
  accounts: 'finance-accounts',
  reports: 'finance-reports',
} as const;

// Routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  FINANCE: {
    ROOT: '/finance',
    TRANSACTIONS: '/finance/transactions',
    CATEGORIES: '/finance/categories',
    ACCOUNTS: '/finance/accounts',
    REPORTS: '/finance/reports',
    SETTINGS: '/finance/settings',
  },
  SETTINGS: '/settings',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
} as const;

