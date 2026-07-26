import type { Department, DepartmentInsert, DepartmentUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export const departmentService = {
  async list(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }

    return data as Department[];
  },

  async getById(id: string): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch department: ${error.message}`);
    }

    return data as Department;
  },

  async create(input: DepartmentInsert): Promise<Department> {
    const { data, error } = await supabase.from('departments').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }

    return data as Department;
  },

  async update(id: string, input: DepartmentUpdate): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update department: ${error.message}`);
    }

    return data as Department;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete department: ${error.message}`);
    }
  },
};
