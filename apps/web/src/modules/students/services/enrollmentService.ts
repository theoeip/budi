import type { ClassEnrollment, ClassEnrollmentInsert, ClassEnrollmentUpdate, ClassEntity, AcademicYear } from '@budi/types';
import { supabase } from '@core/providers/supabaseProvider';

export type EnrollmentWithDetails = ClassEnrollment & {
  classes: ClassEntity | null;
  academic_years: AcademicYear | null;
};

export const enrollmentService = {
  async listByStudent(studentId: string): Promise<EnrollmentWithDetails[]> {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select('*, classes!class_enrollments_class_id_fkey(*), academic_years(*)')
      .eq('student_id', studentId)
      .is('deleted_at', null)
      .order('enrollment_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }

    return data as EnrollmentWithDetails[];
  },

  async enroll(input: ClassEnrollmentInsert): Promise<ClassEnrollment> {
    // 1. Business rule: Check for active enrollment in the same academic year
    const { data: existingActive, error: checkError } = await supabase
      .from('class_enrollments')
      .select('id')
      .eq('student_id', input.student_id)
      .eq('academic_year_id', input.academic_year_id)
      .eq('status', 'Active')
      .is('deleted_at', null);

    if (checkError) {
      throw new Error(`Failed to validate existing enrollment: ${checkError.message}`);
    }

    if (existingActive && existingActive.length > 0) {
      throw new Error('Student already has an active enrollment in this academic year.');
    }

    // 2. Insert new enrollment
    const { data, error } = await supabase
      .from('class_enrollments')
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to enroll student: ${error.message}`);
    }

    return data as ClassEnrollment;
  },

  async update(id: string, input: ClassEnrollmentUpdate): Promise<ClassEnrollment> {
    const { data, error } = await supabase
      .from('class_enrollments')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update enrollment: ${error.message}`);
    }

    return data as ClassEnrollment;
  },

  async withdraw(id: string, exitReason: string, exitDate: string): Promise<void> {
    const { error } = await supabase
      .from('class_enrollments')
      .update({
        status: 'Withdrawn',
        exit_reason: exitReason,
        exit_date: exitDate
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to withdraw enrollment: ${error.message}`);
    }
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('class_enrollments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete enrollment: ${error.message}`);
    }
  }
};
