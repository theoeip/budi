// Dashboard Configuration — Widget definitions and layout configuration
// Responsible ONLY for widget definitions, NOT navigation.
// Navigation is managed by the ModuleRegistry.
// Widgets are now collected from enabled modules via ModuleRegistry.
// Legacy DASHBOARD_WIDGETS is derived from module definitions for compatibility.

import type { UserRole } from '@budi/types';
import { moduleRegistry } from '@core/modules';

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
 * Legacy DASHBOARD_WIDGETS — derived from the Dashboard module definition.
 * This is NOT an independent source of truth.
 * The ModuleRegistry is the single source of truth for all widgets.
 *
 * This export exists only for backward compatibility with code that
 * imports DASHBOARD_WIDGETS directly. New code should use getSortedWidgets().
 */
export const DASHBOARD_WIDGETS: WidgetDefinition[] = (() => {
  const dashboardModule = moduleRegistry.getModule('dashboard');
  if (dashboardModule && dashboardModule.widgets.length > 0) {
    return dashboardModule.widgets.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description ?? '',
      size: w.size as WidgetSize,
      permissionKey: w.permissionKey,
      roles: [...w.roles] as UserRole[],
      order: w.order,
    }));
  }
  return [];
})();

/**
 * Get widgets from ModuleRegistry.
 * Falls back to legacy DASHBOARD_WIDGETS if ModuleRegistry is not yet loaded.
 */
export function getWidgetsFromModules(): WidgetDefinition[] {
  const moduleWidgets = moduleRegistry.getModuleWidgets();

  // If ModuleRegistry is loaded and has widgets, use them
  if (moduleWidgets.length > 0) {
    return moduleWidgets.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      size: w.size as WidgetSize,
      permissionKey: w.permissionKey,
      roles: [...w.roles] as UserRole[],
      order: w.order,
    }));
  }

  // Fallback to legacy widgets
  return [...DASHBOARD_WIDGETS];
}

/** Get widgets sorted by order */
export function getSortedWidgets(): WidgetDefinition[] {
  return getWidgetsFromModules().sort((a, b) => a.order - b.order);
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
