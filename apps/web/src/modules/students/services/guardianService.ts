import type { Guardian, GuardianInsert, GuardianUpdate, StudentGuardian, StudentGuardianInsert, StudentGuardianUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export type GuardianWithRelation = Guardian & {
  student_guardians: StudentGuardian[];
};

export const guardianService = {
  async listByStudentId(studentId: string): Promise<GuardianWithRelation[]> {
    const { data, error } = await supabase
      .from('guardians')
      .select('*, student_guardians!inner(*)')
      .eq('student_guardians.student_id', studentId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to fetch guardians: ${error.message}`);
    }

    return data as GuardianWithRelation[];
  },

  async createAndLink(guardianInput: GuardianInsert, linkInput: Omit<StudentGuardianInsert, 'guardian_id'>): Promise<Guardian> {
    // 1. Create guardian
    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .insert(guardianInput)
      .select()
      .single();

    if (guardianError) {
      throw new Error(`Failed to create guardian: ${guardianError.message}`);
    }

    // 2. Link to student
    const { error: linkError } = await supabase
      .from('student_guardians')
      .insert({ ...linkInput, guardian_id: guardian.id });

    if (linkError) {
      throw new Error(`Failed to link guardian: ${linkError.message}`);
    }

    return guardian as Guardian;
  },

  async linkExisting(linkInput: StudentGuardianInsert): Promise<void> {
    // Enforce duplication rule
    const { data: existing } = await supabase
      .from('student_guardians')
      .select('*')
      .eq('student_id', linkInput.student_id)
      .eq('guardian_id', linkInput.guardian_id)
      .single();

    if (existing) {
      throw new Error('Guardian is already linked to this student');
    }

    const { error } = await supabase
      .from('student_guardians')
      .insert(linkInput);

    if (error) {
      throw new Error(`Failed to link existing guardian: ${error.message}`);
    }
  },

  async updateGuardian(id: string, input: GuardianUpdate): Promise<Guardian> {
    const { data, error } = await supabase
      .from('guardians')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update guardian: ${error.message}`);
    }

    return data as Guardian;
  },

  async updateLink(studentId: string, guardianId: string, input: StudentGuardianUpdate): Promise<void> {
    const { error } = await supabase
      .from('student_guardians')
      .update(input)
      .eq('student_id', studentId)
      .eq('guardian_id', guardianId);

    if (error) {
      throw new Error(`Failed to update guardian link: ${error.message}`);
    }
  },

  async removeLink(studentId: string, guardianId: string): Promise<void> {
    const { error } = await supabase
      .from('student_guardians')
      .update({ deleted_at: new Date().toISOString() })
      .eq('student_id', studentId)
      .eq('guardian_id', guardianId);

    if (error) {
      throw new Error(`Failed to remove guardian link: ${error.message}`);
    }
  }
};
