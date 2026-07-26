import type { Student, StudentInsert, StudentUpdate, StudentProfile, StudentProfileInsert, StudentProfileUpdate } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export type StudentWithProfile = Student & {
  student_profiles: StudentProfile | null;
};

export const studentService = {
  async list(): Promise<StudentWithProfile[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*, student_profiles(*)')
      .is('deleted_at', null)
      .order('nis', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }

    return data as StudentWithProfile[];
  },

  async getById(id: string): Promise<StudentWithProfile> {
    const { data, error } = await supabase
      .from('students')
      .select('*, student_profiles(*)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch student: ${error.message}`);
    }

    return data as StudentWithProfile;
  },

  async create(studentInput: StudentInsert, profileInput?: Omit<StudentProfileInsert, 'student_id'>): Promise<StudentWithProfile> {
    // 1. Create student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert(studentInput)
      .select()
      .single();

    if (studentError) {
      throw new Error(`Failed to create student: ${studentError.message}`);
    }

    let profile = null;

    // 2. Create profile if provided
    if (profileInput) {
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .insert({ ...profileInput, student_id: student.id })
        .select()
        .single();

      if (profileError) {
        throw new Error(`Failed to create student profile: ${profileError.message}`);
      }
      profile = profileData;
    }

    return { ...student, student_profiles: profile } as StudentWithProfile;
  },

  async update(
    id: string, 
    studentInput?: StudentUpdate, 
    profileInput?: StudentProfileUpdate
  ): Promise<StudentWithProfile> {
    // 1. Update student
    if (studentInput && Object.keys(studentInput).length > 0) {
      const { error: studentError } = await supabase
        .from('students')
        .update(studentInput)
        .eq('id', id);

      if (studentError) {
        throw new Error(`Failed to update student: ${studentError.message}`);
      }
    }

    // 2. Update profile
    if (profileInput && Object.keys(profileInput).length > 0) {
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('student_profiles')
        .select('student_id')
        .eq('student_id', id)
        .single();

      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .update(profileInput)
          .eq('student_id', id);

        if (profileError) {
          throw new Error(`Failed to update student profile: ${profileError.message}`);
        }
      } else {
        // If it doesn't exist, we must create it (using the update data, assuming it has all required fields, which is none for profiles)
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({ ...profileInput, student_id: id } as StudentProfileInsert);

        if (profileError) {
          throw new Error(`Failed to insert student profile during update: ${profileError.message}`);
        }
      }
    }

    return this.getById(id);
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  },

  async updateStatus(id: string, status: string): Promise<void> {
    // Basic state machine validation
    const { data: student } = await supabase.from('students').select('status').eq('id', id).single();
    if (!student) throw new Error('Student not found');

    const currentStatus = student.status;
    const terminalStates = ['Withdrawn', 'Transferred', 'Graduated', 'Dropped Out'];

    if (terminalStates.includes(currentStatus)) {
      throw new Error(`Cannot transition from terminal state: ${currentStatus}`);
    }

    const { error } = await supabase
      .from('students')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update student status: ${error.message}`);
    }
  }
};
