// Dashboard Widget Registry
// Maps widget IDs from dashboard.config.ts to React components.
// DashboardPage uses this registry to resolve widgets — no individual imports needed.

import type { FC } from 'react';
import { PermissionSummaryWidget } from './PermissionSummaryWidget';
import { SchoolSummaryWidget } from './SchoolSummaryWidget';
import { SystemStatusWidget } from './SystemStatusWidget';
import { UserSummaryWidget } from './UserSummaryWidget';

/**
 * Widget registry mapping widget IDs from dashboard config to components.
 * New widgets should be registered here.
 * Components are cast through `unknown` to handle differing prop interfaces,
 * since props are passed dynamically via the DashboardPage.
 */
export const widgetRegistry: Record<string, FC<Record<string, unknown>>> = {
  userSummary: UserSummaryWidget as unknown as FC<Record<string, unknown>>,
  schoolSummary: SchoolSummaryWidget as unknown as FC<Record<string, unknown>>,
  permissionSummary: PermissionSummaryWidget as unknown as FC<Record<string, unknown>>,
  systemStatus: SystemStatusWidget as unknown as FC<Record<string, unknown>>,
};

/**
 * Get a widget component by its ID from the registry.
 * Returns undefined if the widget ID is not registered.
 */
export function getWidgetComponent(widgetId: string): FC<Record<string, unknown>> | undefined {
  return widgetRegistry[widgetId];
}
