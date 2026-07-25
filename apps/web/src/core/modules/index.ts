// Core Modules — Barrel export
// Single import point for all Module System exports.

export type {
  ModuleDefinition,
  ModuleNavItem,
  ModulePermissionDeclaration,
  ModuleRoute,
  ModuleWidget,
  ModuleWidgetSize,
} from './types';

export { moduleLoader } from './loader';
export { moduleRegistry } from './registry';

export {
  getModuleRouteById,
  getModuleRoutePaths,
  getModuleRoutes,
  getRoutesByModule,
} from './routeGenerator';
