import type { ClassEntity, ClassInsert, ClassUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export const classService = {
  async listByAcademicYear(academicYearId: string): Promise<ClassEntity[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('academic_year_id', academicYearId)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch classes: ${error.message}`);
    }

    return data as ClassEntity[];
  },

  async getById(id: string): Promise<ClassEntity> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch class: ${error.message}`);
    }

    return data as ClassEntity;
  },

  async create(input: ClassInsert): Promise<ClassEntity> {
    const { data, error } = await supabase.from('classes').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create class: ${error.message}`);
    }

    return data as ClassEntity;
  },

  async update(id: string, input: ClassUpdate): Promise<ClassEntity> {
    const { data, error } = await supabase
      .from('classes')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update class: ${error.message}`);
    }

    return data as ClassEntity;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete class: ${error.message}`);
    }
  },
};
