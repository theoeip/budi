// Dashboard Configuration — Widget definitions and layout configuration
// Responsible ONLY for widget definitions, NOT navigation.
// Navigation is managed by @budi/config/navigation.

import type { UserRole } from '@budi/types';

/** Dashboard widget size */
export type WidgetSize = 'full' | 'half' | 'third' | 'twoThirds';

/** Dashboard widget definition */
export interface WidgetDefinition {
  /** Unique widget identifier */
  id: string;
  /** Widget display title */
  title: string;
  /** Widget description (optional) */
  description?: string;
  /** Size class for grid layout */
  size: WidgetSize;
  /** Permission key required to view this widget (empty string = no permission required) */
  permissionKey: string;
  /** Roles allowed to see this widget (empty array = all authenticated) */
  roles: UserRole[];
  /** Sort order (lower = first) */
  order: number;
}

/**
 * Dashboard page configuration.
 * Defines which widgets appear on the dashboard and their layout.
 * Widgets are filtered by PermissionService at render time.
 */
export const DASHBOARD_WIDGETS: WidgetDefinition[] = [
  {
    id: 'userSummary',
    title: 'Current User',
    description: 'Authenticated user profile information',
    size: 'third',
    permissionKey: '',
    roles: [],
    order: 1,
  },
  {
    id: 'schoolSummary',
    title: 'School Context',
    description: 'Current school and role information',
    size: 'third',
    permissionKey: '',
    roles: [],
    order: 2,
  },
  {
    id: 'permissionSummary',
    title: 'Permissions',
    description: 'Current role-based permission summary',
    size: 'third',
    permissionKey: '',
    roles: [],
    order: 3,
  },
  {
    id: 'systemStatus',
    title: 'System Status',
    description: 'Application version and environment information',
    size: 'full',
    permissionKey: '',
    roles: [],
    order: 4,
  },
];

/** Get widgets sorted by order */
export function getSortedWidgets(): WidgetDefinition[] {
  return [...DASHBOARD_WIDGETS].sort((a, b) => a.order - b.order);
}

/** Map widget size to Tailwind grid column class */
export function widgetSizeToGridCols(size: WidgetSize): string {
  switch (size) {
    case 'full':
      return 'col-span-full';
    case 'half':
      return 'col-span-full sm:col-span-6';
    case 'third':
      return 'col-span-full sm:col-span-6 lg:col-span-4';
    case 'twoThirds':
      return 'col-span-full sm:col-span-6 lg:col-span-8';
  }
}
