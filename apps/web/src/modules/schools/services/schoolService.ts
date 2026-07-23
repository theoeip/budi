// School Management — Supabase Service
// Provides data access layer for school CRUD operations.

import type { School } from '@budi/types';
import type { Database } from '@budi/types/supabase';
import { supabase } from '@core/providers/supabaseProvider';

type SchoolInsert = Database['public']['Tables']['schools']['Insert'];
type SchoolUpdate = Database['public']['Tables']['schools']['Update'];

/**
 * Service for managing school (tenant) data.
 * All operations are restricted to super_admin role via RLS.
 */
export const schoolService = {
  /**
   * Retrieves a paginated list of active (non-deleted) schools.
   */
  async list(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch schools: ${error.message}`);
    }

    return data as unknown as School[];
  },

  /**
   * Retrieves a single school by its ID.
   */
  async getById(id: string): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch school: ${error.message}`);
    }

    return data as unknown as School;
  },

  /**
   * Creates a new school record.
   */
  async create(input: SchoolInsert): Promise<School> {
    const { data, error } = await supabase.from('schools').insert(input).select().single();

    if (error) {
      throw new Error(`Failed to create school: ${error.message}`);
    }

    return data as unknown as School;
  },

  /**
   * Updates an existing school record.
   */
  async update(id: string, input: SchoolUpdate): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update school: ${error.message}`);
    }

    return data as unknown as School;
  },

  /**
   * Soft-deletes a school by setting its deleted_at timestamp.
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .update({ deleted_at: new Date().toISOString() } satisfies SchoolUpdate)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete school: ${error.message}`);
    }
  },

  /**
   * Restores a soft-deleted school by clearing its deleted_at timestamp.
   */
  async restore(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .update({ deleted_at: null } satisfies SchoolUpdate)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to restore school: ${error.message}`);
    }
  },

  /**
   * Toggles the active status of a school.
   */
  async toggleStatus(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .update({ is_active: isActive } satisfies SchoolUpdate)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update school status: ${error.message}`);
    }
  },
};
