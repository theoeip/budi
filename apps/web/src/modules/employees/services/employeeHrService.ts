/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmployeeHRRecord, EmployeeHRRecordUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';
import { EmployeeHRRecordNotFoundError } from '@budi/utils';

export const employeeHrService = {
  async get(employeeId: string): Promise<EmployeeHRRecord> {
    const { data, error } = await supabase
      .from('employee_hr_records')
      .select('*')
      .eq('employee_id', employeeId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new EmployeeHRRecordNotFoundError();
      }
      throw new Error(`Failed to fetch HR record: ${error.message}`);
    }

    return data as EmployeeHRRecord;
  },

  async update(employeeId: string, hrInput: EmployeeHRRecordUpdate): Promise<EmployeeHRRecord> {
    const { data: existing } = await supabase
      .from('employee_hr_records')
      .select('employee_id')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('employee_hr_records')
        .update(hrInput)
        .eq('employee_id', employeeId);

      if (error) throw new Error(`Failed to update HR record: ${error.message}`);
    } else {
      const { error } = await supabase
        .from('employee_hr_records')
        .insert({ ...hrInput, employee_id: employeeId } as any);
        
      if (error) throw new Error(`Failed to insert HR record: ${error.message}`);
    }

    return this.get(employeeId);
  }
};
