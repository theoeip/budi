import type { EmployeeCapability, CapabilityCode } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';
import { DuplicateCapabilityError } from '@budi/utils';

export const employeeCapabilityService = {
  async list(employeeId: string): Promise<EmployeeCapability[]> {
    const { data, error } = await supabase
      .from('employee_capabilities')
      .select('*')
      .eq('employee_id', employeeId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to fetch capabilities: ${error.message}`);
    }

    return data as EmployeeCapability[];
  },

  async grant(employeeId: string, capability: CapabilityCode): Promise<void> {
    const { error } = await supabase
      .from('employee_capabilities')
      .insert({ employee_id: employeeId, capability });

    if (error) {
      if (error.code === '23505') {
        throw new DuplicateCapabilityError();
      }
      throw new Error(`Failed to grant capability: ${error.message}`);
    }
  },

  async revoke(employeeId: string, capability: CapabilityCode): Promise<void> {
    const { error } = await supabase
      .from('employee_capabilities')
      .update({ deleted_at: new Date().toISOString() })
      .eq('employee_id', employeeId)
      .eq('capability', capability)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to revoke capability: ${error.message}`);
    }
  }
};
