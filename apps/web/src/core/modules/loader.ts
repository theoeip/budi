// Module Loader — Bootstraps built-in modules into the ModuleRegistry
// Registration is deterministic and idempotent.
// Calling load() twice does not duplicate modules (last-write-wins).

import { builtInModules } from './definitions/index';
import { moduleRegistry } from './registry';

/**
 * ModuleLoader — Responsible for initializing built-in modules.
 *
 * Responsibilities:
 * - Load all built-in module definitions
 * - Register them with the ModuleRegistry
 * - Return sorted enabled modules list
 * - Idempotent: safe to call multiple times
 */
class ModuleLoader {
  private _loaded = false;

  /**
   * Load all built-in modules into the registry.
   * Idempotent — subsequent calls are no-ops.
   * Returns the registry instance for chaining.
   */
  load(): typeof moduleRegistry {
    if (this._loaded) {
      return moduleRegistry;
    }

    // Register all built-in modules (order is deterministic from definitions)
    for (const definition of builtInModules) {
      moduleRegistry.register(definition);
    }

    this._loaded = true;
    return moduleRegistry;
  }

  /**
   * Reload modules (clear and re-register).
   * Useful for testing or hot-reload scenarios.
   */
  reload(): typeof moduleRegistry {
    moduleRegistry.clear();
    this._loaded = false;
    return this.load();
  }

  /**
   * Whether modules have been loaded.
   */
  get isLoaded(): boolean {
    return this._loaded;
  }
}

/**
 * Singleton instance of ModuleLoader.
 * Call `moduleLoader.load()` once at application startup.
 */
export const moduleLoader = new ModuleLoader();
