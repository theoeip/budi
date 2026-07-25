// Module Registry — Single source of truth for all application modules
// Stores ModuleDefinitions and provides readonly access.
// No React rendering logic. No React component references.
// All data access returns readonly/frozen arrays to prevent mutation.

import type { ModuleDefinition, ModuleNavItem, ModuleRoute, ModuleWidget } from './types';

/**
 * ModuleRegistry — Singleton registry for application modules.
 *
 * Responsibilities:
 * - register modules (idempotent, last-write-wins)
 * - unregister modules
 * - getModule(id) — single module by id
 * - getModules() — all registered modules (readonly)
 * - getEnabledModules() — only enabled modules (readonly, sorted)
 * - getModuleNavItems() — flattened nav items from enabled modules
 * - getModuleWidgets() — flattened widgets from enabled modules
 * - getModuleRoutes() — flattened routes from enabled modules
 */
class ModuleRegistry {
  /** Internal mutable store */
  private readonly _modules = new Map<string, ModuleDefinition>();

  /** Track registration order for deterministic output */
  private _registrationOrder: string[] = [];

  // ============================================================
  // Registration
  // ============================================================

  /**
   * Register a module definition.
   * Throws if a module with the same id is already registered.
   * Returns the registry for chaining.
   */
  register(definition: ModuleDefinition): this {
    const id = definition.id;

    if (this._modules.has(id)) {
      throw new Error(
        `[ModuleRegistry] Duplicate module ID detected: "${id}". ` +
          `A module with this ID is already registered. ` +
          `Use a unique module ID or unregister the existing module first.`,
      );
    }

    this._registrationOrder.push(id);
    this._modules.set(id, { ...definition });
    return this;
  }

  /**
   * Unregister a module by id.
   * Returns true if the module was removed, false if it didn't exist.
   */
  unregister(id: string): boolean {
    const existed = this._modules.delete(id);
    if (existed) {
      this._registrationOrder = this._registrationOrder.filter((key) => key !== id);
    }
    return existed;
  }

  // ============================================================
  // Query — Single Module
  // ============================================================

  /**
   * Get a module definition by id.
   * Returns a frozen copy to prevent mutation.
   */
  getModule(id: string): Readonly<ModuleDefinition> | undefined {
    const module = this._modules.get(id);
    if (!module) return undefined;
    return Object.freeze({ ...module });
  }

  // ============================================================
  // Query — All Modules
  // ============================================================

  /**
   * Get all registered module definitions.
   * Returns a frozen array of frozen objects.
   */
  getModules(): ReadonlyArray<Readonly<ModuleDefinition>> {
    return Object.freeze(
      this._registrationOrder
        .map((id) => this._modules.get(id))
        .filter((m): m is ModuleDefinition => m !== undefined)
        .map((m) => Object.freeze({ ...m })),
    );
  }

  /**
   * Get only enabled module definitions, sorted by order.
   * Returns a frozen array of frozen objects.
   */
  getEnabledModules(): ReadonlyArray<Readonly<ModuleDefinition>> {
    return Object.freeze(
      this._registrationOrder
        .map((id) => this._modules.get(id))
        .filter((m): m is ModuleDefinition => m !== undefined && m.enabled)
        .sort((a, b) => a.order - b.order)
        .map((m) => Object.freeze({ ...m })),
    );
  }

  // ============================================================
  // Query — Navigation
  // ============================================================

  /**
   * Get all navigation items from enabled modules.
   * Returns a frozen array of frozen ModuleNavItems.
   * Throws if duplicate navigation paths are detected across modules.
   */
  getModuleNavItems(): ReadonlyArray<ModuleNavItem> {
    const items: ModuleNavItem[] = [];
    const seenPaths = new Map<string, string>(); // path -> source moduleId

    for (const module of this.getEnabledModules()) {
      for (const navItem of module.navigation) {
        // Duplicate navigation path detection — throw on conflict
        if (seenPaths.has(navItem.path)) {
          const sourceModule = seenPaths.get(navItem.path);
          throw new Error(
            `[ModuleRegistry] Duplicate navigation path detected: "${navItem.path}" ` +
              `defined in modules "${sourceModule}" and "${module.id}". ` +
              `Navigation paths must be unique across all enabled modules.`,
          );
        }
        seenPaths.set(navItem.path, module.id);
        items.push(this.freezeNavItem(navItem));
      }
    }

    return Object.freeze(items);
  }

  // ============================================================
  // Query — Widgets
  // ============================================================

  /**
   * Get all widgets from enabled modules, sorted by order.
   * Returns a frozen array of frozen objects.
   * Throws if duplicate widget IDs are detected across modules.
   */
  getModuleWidgets(): ReadonlyArray<ModuleWidget> {
    const widgets: ModuleWidget[] = [];
    const seenIds = new Map<string, string>(); // widgetId -> source moduleId

    for (const module of this.getEnabledModules()) {
      for (const widget of module.widgets) {
        // Duplicate widget ID detection — throw on conflict
        if (seenIds.has(widget.id)) {
          const sourceModule = seenIds.get(widget.id);
          throw new Error(
            `[ModuleRegistry] Duplicate widget ID detected: "${widget.id}" ` +
              `defined in modules "${sourceModule}" and "${module.id}". ` +
              `Widget IDs must be unique across all enabled modules.`,
          );
        }
        seenIds.set(widget.id, module.id);
        widgets.push(Object.freeze({ ...widget }));
      }
    }

    widgets.sort((a, b) => a.order - b.order);
    return Object.freeze(widgets);
  }

  // ============================================================
  // Query — Routes
  // ============================================================

  /**
   * Get all route metadata from enabled modules.
   * Returns a frozen array of frozen objects.
   * Throws if duplicate route paths are detected across modules.
   */
  getModuleRoutes(): ReadonlyArray<ModuleRoute> {
    const routes: ModuleRoute[] = [];
    const seenPaths = new Map<string, string>(); // path -> source moduleId

    for (const module of this.getEnabledModules()) {
      for (const route of module.routes) {
        // Duplicate route path detection — throw on conflict
        if (seenPaths.has(route.path)) {
          const sourceModule = seenPaths.get(route.path);
          throw new Error(
            `[ModuleRegistry] Duplicate route path detected: "${route.path}" ` +
              `defined in modules "${sourceModule}" and "${module.id}". ` +
              `Route paths must be unique across all enabled modules.`,
          );
        }
        seenPaths.set(route.path, module.id);
        routes.push(this.freezeRoute(route));
      }
    }

    return Object.freeze(routes);
  }

  // ============================================================
  // Utility
  // ============================================================

  /**
   * Check if a module is registered.
   */
  hasModule(id: string): boolean {
    return this._modules.has(id);
  }

  /**
   * Get the count of registered modules.
   */
  get size(): number {
    return this._modules.size;
  }

  /**
   * Clear all registered modules.
   */
  clear(): void {
    this._modules.clear();
    this._registrationOrder = [];
  }

  // ============================================================
  // Private — Deep freeze helpers
  // ============================================================

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private freezeNavItem(item: ModuleNavItem): any {
    return Object.freeze({
      ...item,
      children: item.children
        ? Object.freeze(item.children.map((child) => this.freezeNavItem(child)))
        : undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private freezeRoute(route: ModuleRoute): any {
    return Object.freeze({
      ...route,
      children: route.children
        ? Object.freeze(route.children.map((child) => this.freezeRoute(child)))
        : undefined,
    });
  }
}

/**
 * Singleton instance of ModuleRegistry.
 * Import this throughout the application to access module definitions.
 */
export const moduleRegistry = new ModuleRegistry();
