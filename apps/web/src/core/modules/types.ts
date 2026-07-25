// Module System — Core Type Definitions
// These types are declarative only — no React components, no import paths.
// ModuleRegistry uses these types as its data contracts.

import type { UserRole } from '@budi/types';

/**
 * Module navigation item — metadata only.
 * No React components or lazy imports.
 */
export interface ModuleNavItem {
  /** Display label (i18n key or plain text) */
  label: string;
  /** Route path (e.g. '/finance') */
  path: string;
  /** Icon key (resolved by consumer, e.g. DashboardLayout's resolveIcon) */
  icon: string;
  /** Allowed roles (empty = all authenticated) */
  roles: UserRole[];
  /** Child navigation items (optional) */
  children?: ModuleNavItem[];
}

/**
 * Module route metadata — declarative route definition.
 * componentKey is resolved by a route resolver, NOT an import path.
 * Do NOT store React components or lazy() calls here.
 */
export interface ModuleRoute {
  /** Unique route identifier within the module */
  id: string;
  /** URL path (e.g. '/finance/transactions') */
  path: string;
  /** Component key for route resolution (maps to actual component elsewhere) */
  componentKey: string;
  /** Required permission (empty = no permission required) */
  permission?: string;
  /** Allowed roles (empty = all authenticated) */
  roles?: UserRole[];
  /** Index route flag */
  index?: boolean;
  /** Child routes */
  children?: ModuleRoute[];
}

/**
 * Dashboard widget size options.
 */
export type ModuleWidgetSize = 'full' | 'half' | 'third' | 'twoThirds';

/**
 * Module widget definition — declarative only.
 * No React components. widgetId is resolved by a widget registry.
 */
export interface ModuleWidget {
  /** Unique widget identifier (used as component key for widget registry) */
  id: string;
  /** Widget display title */
  title: string;
  /** Widget description (optional) */
  description?: string;
  /** Size class for grid layout */
  size: ModuleWidgetSize;
  /** Permission key required (empty = no permission required) */
  permissionKey: string;
  /** Allowed roles (empty = all authenticated) */
  roles: UserRole[];
  /** Sort order (lower = first) */
  order: number;
}

/**
 * Module permission declaration — metadata only.
 * Actual authorization is handled by PermissionService.
 */
export interface ModulePermissionDeclaration {
  /** Permission key (e.g. 'canManageFinance') */
  key: string;
  /** Human-readable description */
  description: string;
}

/**
 * Module definition — single source of truth for an application module.
 * Declarative only. No React components, no import paths, no lazy().
 */
export interface ModuleDefinition {
  /** Unique module identifier (e.g. 'finance', 'schools') */
  id: string;
  /** Human-readable module name */
  name: string;
  /** Module description */
  description?: string;
  /** Module version string */
  version: string;
  /** Whether the module is enabled */
  enabled: boolean;
  /** Icon key for navigation */
  icon: string;
  /** Sort order (lower = first) */
  order: number;
  /** Navigation items contributed by this module */
  navigation: ModuleNavItem[];
  /** Widgets contributed by this module */
  widgets: ModuleWidget[];
  /** Route metadata contributed by this module */
  routes: ModuleRoute[];
  /** Permission keys this module declares */
  permissions: ModulePermissionDeclaration[];
}
