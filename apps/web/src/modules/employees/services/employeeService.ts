import type { Employee, EmployeeInsert, EmployeeUpdate, EmploymentStatus } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';
import { 
  EmployeeNotFoundError, 
  DuplicateEmployeeNumberError, 
  InvalidEmploymentStatusTransitionError 
} from '@budi/utils';

export const EMPLOYMENT_TERMINAL_STATES: EmploymentStatus[] = ['Terminated', 'Archived', 'Retired'];

export const ALL_EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  'Prospective', 'Active', 'On Leave', 'Suspended', 'Resigned', 'Retired', 'Terminated', 'Archived'
];

export function getValidEmploymentTransitions(currentStatus: EmploymentStatus): EmploymentStatus[] {
  if (EMPLOYMENT_TERMINAL_STATES.includes(currentStatus)) return [];
  return ALL_EMPLOYMENT_STATUSES.filter(s => s !== currentStatus);
}

export const employeeService = {
  async list(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .is('deleted_at', null)
      .order('full_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }

    return data as Employee[];
  },

  async getById(id: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new EmployeeNotFoundError();
      }
      throw new Error(`Failed to fetch employee: ${error.message}`);
    }

    return data as Employee;
  },

  async create(employeeInput: EmployeeInsert): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeInput)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new DuplicateEmployeeNumberError();
      }
      throw new Error(`Failed to create employee: ${error.message}`);
    }

    return data as Employee;
  },

  async update(id: string, employeeInput: EmployeeUpdate): Promise<Employee> {
    if (Object.keys(employeeInput).length === 0) {
      return this.getById(id);
    }

    const { error } = await supabase
      .from('employees')
      .update(employeeInput)
      .eq('id', id);

    if (error) {
      if (error.code === '23505') {
        throw new DuplicateEmployeeNumberError();
      }
      throw new Error(`Failed to update employee: ${error.message}`);
    }

    return this.getById(id);
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  },

  async updateStatus(id: string, newStatus: EmploymentStatus): Promise<void> {
    const { data: employee } = await supabase.from('employees').select('employment_status').eq('id', id).single();
    if (!employee) throw new EmployeeNotFoundError();

    const currentStatus = employee.employment_status as EmploymentStatus;
    if (EMPLOYMENT_TERMINAL_STATES.includes(currentStatus)) {
      throw new InvalidEmploymentStatusTransitionError(`Cannot transition from terminal state: ${currentStatus}`);
    }

    const { error } = await supabase
      .from('employees')
      .update({ employment_status: newStatus })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update employee status: ${error.message}`);
    }
  }
};
