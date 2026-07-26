import type { Subject, SubjectInsert, SubjectUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export const subjectService = {
  async list(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch subjects: ${error.message}`);
    }

    return data as Subject[];
  },

  async getById(id: string): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch subject: ${error.message}`);
    }

    return data as Subject;
  },

  async create(input: SubjectInsert): Promise<Subject> {
    const { data, error } = await supabase.from('subjects').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create subject: ${error.message}`);
    }

    return data as Subject;
  },

  async update(id: string, input: SubjectUpdate): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update subject: ${error.message}`);
    }

    return data as Subject;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('subjects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete subject: ${error.message}`);
    }
  },
};
