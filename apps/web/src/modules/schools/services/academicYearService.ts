import type { AcademicYear, AcademicYearInsert, AcademicYearUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export const academicYearService = {
  async list(): Promise<AcademicYear[]> {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch academic years: ${error.message}`);
    }

    return data as AcademicYear[];
  },

  async getById(id: string): Promise<AcademicYear> {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch academic year: ${error.message}`);
    }

    return data as AcademicYear;
  },

  async create(input: AcademicYearInsert): Promise<AcademicYear> {
    const { data, error } = await supabase.from('academic_years').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create academic year: ${error.message}`);
    }

    return data as AcademicYear;
  },

  async update(id: string, input: AcademicYearUpdate): Promise<AcademicYear> {
    const { data, error } = await supabase
      .from('academic_years')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update academic year: ${error.message}`);
    }

    return data as AcademicYear;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('academic_years')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete academic year: ${error.message}`);
    }
  },
};
