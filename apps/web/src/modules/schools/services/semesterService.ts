import type { Semester, SemesterInsert, SemesterUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export const semesterService = {
  async listByAcademicYear(academicYearId: string): Promise<Semester[]> {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('academic_year_id', academicYearId)
      .is('deleted_at', null)
      .order('start_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch semesters: ${error.message}`);
    }

    return data as Semester[];
  },

  async getById(id: string): Promise<Semester> {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch semester: ${error.message}`);
    }

    return data as Semester;
  },

  async create(input: SemesterInsert): Promise<Semester> {
    const { data, error } = await supabase.from('semesters').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create semester: ${error.message}`);
    }

    return data as Semester;
  },

  async update(id: string, input: SemesterUpdate): Promise<Semester> {
    const { data, error } = await supabase
      .from('semesters')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update semester: ${error.message}`);
    }

    return data as Semester;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('semesters')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete semester: ${error.message}`);
    }
  },
};
