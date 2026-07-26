// Module Definitions — Barrel export
// Aggregates all built-in module definitions for bootstrap.

import type { ModuleDefinition } from '../types';
import { dashboardModule } from './dashboard';
import { financeModule } from './finance';
import { schoolsModule } from './schools';
import { studentsModule } from './students';
import { employeesModule } from './employees';

/**
 * All built-in module definitions.
 * Registration order is deterministic — modules are registered in this order.
 * ModuleLoader.load() iterates this array and registers each module.
 */
export const builtInModules: ModuleDefinition[] = [dashboardModule, financeModule, schoolsModule, studentsModule, employeesModule];
