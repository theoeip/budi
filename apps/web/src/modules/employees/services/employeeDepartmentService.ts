import type { EmployeeDepartment } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';
import { DuplicateDepartmentAssignmentError } from '@budi/utils';

export const employeeDepartmentService = {
  async listAssignments(employeeId: string): Promise<EmployeeDepartment[]> {
    const { data, error } = await supabase
      .from('employee_departments')
      .select('*')
      .eq('employee_id', employeeId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to fetch department assignments: ${error.message}`);
    }

    return data as EmployeeDepartment[];
  },

  async assign(employeeId: string, departmentId: string): Promise<void> {
    const { error } = await supabase
      .from('employee_departments')
      .insert({ employee_id: employeeId, department_id: departmentId });

    if (error) {
      if (error.code === '23505') {
        throw new DuplicateDepartmentAssignmentError();
      }
      throw new Error(`Failed to assign department: ${error.message}`);
    }
  },

  async remove(employeeId: string, departmentId: string): Promise<void> {
    const { error } = await supabase
      .from('employee_departments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('employee_id', employeeId)
      .eq('department_id', departmentId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to remove department assignment: ${error.message}`);
    }
  },

  async setHead(employeeId: string, departmentId: string): Promise<void> {
    const { error } = await supabase.rpc('set_department_head', {
      p_employee_id: employeeId,
      p_department_id: departmentId
    });

    if (error) {
      throw new Error(`Failed to set department head: ${error.message}`);
    }
  }
};
