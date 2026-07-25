// Route Generator — Helper functions for route registration from ModuleRegistry
// Does NOT modify the router. Only prepares route metadata for future consumption.
// The current router (apps/web/src/core/router/index.tsx) remains unchanged.

import { moduleRegistry } from './registry';
import type { ModuleRoute } from './types';

/**
 * Get all route metadata from enabled modules.
 * Returns a readonly array of ModuleRoute objects.
 */
export function getModuleRoutes(): ReadonlyArray<ModuleRoute> {
  return moduleRegistry.getModuleRoutes();
}

/**
 * Get all active route paths from enabled modules.
 * Useful for generating navigation maps or route validation.
 */
export function getModuleRoutePaths(): string[] {
  const paths: string[] = [];

  function collectPaths(routes: ReadonlyArray<ModuleRoute>): void {
    for (const route of routes) {
      if (route.path) {
        paths.push(route.path);
      }
      if (route.children) {
        collectPaths(route.children as ReadonlyArray<ModuleRoute>);
      }
    }
  }

  collectPaths(moduleRegistry.getModuleRoutes());
  return paths;
}

/**
 * Get a specific route definition by its id.
 * Returns undefined if not found.
 */
export function getModuleRouteById(id: string): ModuleRoute | undefined {
  const routes = moduleRegistry.getModuleRoutes();

  function findRoute(routes: ReadonlyArray<ModuleRoute>): ModuleRoute | undefined {
    for (const route of routes) {
      if (route.id === id) return route as ModuleRoute;
      if (route.children) {
        const found = findRoute(route.children as ReadonlyArray<ModuleRoute>);
        if (found) return found;
      }
    }
    return undefined;
  }

  return findRoute(routes);
}

/**
 * Get routes grouped by module.
 * Returns a record mapping module IDs to their route arrays.
 */
export function getRoutesByModule(): Record<string, ReadonlyArray<ModuleRoute>> {
  const result: Record<string, ReadonlyArray<ModuleRoute>> = {};

  for (const module of moduleRegistry.getEnabledModules()) {
    if (module.routes.length > 0) {
      result[module.id] = Object.freeze([...module.routes]);
    }
  }

  return result;
}
