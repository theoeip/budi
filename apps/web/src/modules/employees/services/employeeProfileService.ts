/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmployeeProfile, EmployeeProfileUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';
import { EmployeeProfileNotFoundError } from '@budi/utils';

export const employeeProfileService = {
  async get(employeeId: string): Promise<EmployeeProfile> {
    const { data, error } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('employee_id', employeeId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new EmployeeProfileNotFoundError();
      }
      throw new Error(`Failed to fetch employee profile: ${error.message}`);
    }

    return data as EmployeeProfile;
  },

  async update(employeeId: string, profileInput: EmployeeProfileUpdate): Promise<EmployeeProfile> {
    // Upsert behavior: Since profile is 1-1 optional, update might need to create it.
    // We check existence first
    const { data: existing } = await supabase
      .from('employee_profiles')
      .select('employee_id')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('employee_profiles')
        .update(profileInput)
        .eq('employee_id', employeeId);

      if (error) throw new Error(`Failed to update employee profile: ${error.message}`);
    } else {
      const { error } = await supabase
        .from('employee_profiles')
        .insert({ ...profileInput, employee_id: employeeId } as any);
        
      if (error) throw new Error(`Failed to insert employee profile: ${error.message}`);
    }

    return this.get(employeeId);
  }
};
