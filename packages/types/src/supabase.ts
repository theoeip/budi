export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          deleted_at: string | null
          end_date: string
          id: string
          is_active: boolean
          name: string
          school_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          school_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          school_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_years_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      account_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_system: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          account_number: string | null
          account_type_id: string
          bank_name: string | null
          code: string
          created_at: string
          currency: string
          current_balance: number
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          metadata: Json | null
          name: string
          opening_balance: number
          school_id: string
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          account_type_id: string
          bank_name?: string | null
          code: string
          created_at?: string
          currency?: string
          current_balance?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          name: string
          opening_balance?: number
          school_id: string
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          account_type_id?: string
          bank_name?: string | null
          code?: string
          created_at?: string
          currency?: string
          current_balance?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          name?: string
          opening_balance?: number
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_account_type_id_fkey"
            columns: ["account_type_id"]
            isOneToOne: false
            referencedRelation: "account_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string
          deleted_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string
          school_id: string
          storage_path: string
          transaction_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          mime_type: string
          school_id: string
          storage_path: string
          transaction_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          school_id?: string
          storage_path?: string
          transaction_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          school_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          school_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          school_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_registers: {
        Row: {
          account_id: string
          closed_at: string | null
          closed_by: string | null
          closing_balance: number | null
          created_at: string
          deleted_at: string | null
          difference: number | null
          expected_balance: number | null
          id: string
          notes: string | null
          opened_at: string
          opened_by: string
          opening_balance: number
          school_id: string
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number | null
          created_at?: string
          deleted_at?: string | null
          difference?: number | null
          expected_balance?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by: string
          opening_balance: number
          school_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number | null
          created_at?: string
          deleted_at?: string | null
          difference?: number | null
          expected_balance?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by?: string
          opening_balance?: number
          school_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_registers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_registers_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_registers_opened_by_fkey"
            columns: ["opened_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_registers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          academic_year_id: string
          class_id: string
          created_at: string
          deleted_at: string | null
          enrollment_date: string
          enrollment_reason: string | null
          exit_date: string | null
          exit_reason: string | null
          id: string
          promoted_from_class_id: string | null
          promoted_to_class_id: string | null
          school_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          class_id: string
          created_at?: string
          deleted_at?: string | null
          enrollment_date: string
          enrollment_reason?: string | null
          exit_date?: string | null
          exit_reason?: string | null
          id?: string
          promoted_from_class_id?: string | null
          promoted_to_class_id?: string | null
          school_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          class_id?: string
          created_at?: string
          deleted_at?: string | null
          enrollment_date?: string
          enrollment_reason?: string | null
          exit_date?: string | null
          exit_reason?: string | null
          id?: string
          promoted_from_class_id?: string | null
          promoted_to_class_id?: string | null
          school_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_promoted_from_class_id_fkey"
            columns: ["promoted_from_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_promoted_to_class_id_fkey"
            columns: ["promoted_to_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year_id: string
          capacity: number | null
          code: string
          created_at: string
          deleted_at: string | null
          department_id: string
          description: string | null
          grade_level: number | null
          homeroom_teacher_id: string | null
          id: string
          name: string
          school_id: string
          sort_order: number | null
          status: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          capacity?: number | null
          code: string
          created_at?: string
          deleted_at?: string | null
          department_id: string
          description?: string | null
          grade_level?: number | null
          homeroom_teacher_id?: string | null
          id?: string
          name: string
          school_id: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          capacity?: number | null
          code?: string
          created_at?: string
          deleted_at?: string | null
          department_id?: string
          description?: string | null
          grade_level?: number | null
          homeroom_teacher_id?: string | null
          id?: string
          name?: string
          school_id?: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_homeroom_teacher_id_fkey"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_cash: {
        Row: {
          account_id: string
          cash_date: string
          closing_balance: number
          created_at: string
          deleted_at: string | null
          difference: number
          id: string
          notes: string | null
          opening_balance: number
          school_id: string
          total_cash_in: number
          total_cash_out: number
          transaction_count: number
          updated_at: string
        }
        Insert: {
          account_id: string
          cash_date: string
          closing_balance: number
          created_at?: string
          deleted_at?: string | null
          difference?: number
          id?: string
          notes?: string | null
          opening_balance: number
          school_id: string
          total_cash_in?: number
          total_cash_out?: number
          transaction_count?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          cash_date?: string
          closing_balance?: number
          created_at?: string
          deleted_at?: string | null
          difference?: number
          id?: string
          notes?: string | null
          opening_balance?: number
          school_id?: string
          total_cash_in?: number
          total_cash_out?: number
          transaction_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_cash_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_cash_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          profile_id: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          profile_id?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          profile_id?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardians_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_reports: {
        Row: {
          account_breakdown: Json | null
          category_breakdown: Json | null
          closing_balance: number
          created_at: string
          generated_at: string
          id: string
          month: number
          net_balance: number
          opening_balance: number
          school_id: string
          total_expense: number
          total_income: number
          transaction_count: number
          updated_at: string
          year: number
        }
        Insert: {
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          month: number
          net_balance?: number
          opening_balance?: number
          school_id: string
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
          year: number
        }
        Update: {
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          month?: number
          net_balance?: number
          opening_balance?: number
          school_id?: string
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_system: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_sign_in_at: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean
          last_sign_in_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_sign_in_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          level: number
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          level: number
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          level?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_users: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_default: boolean
          joined_at: string
          role_id: string
          school_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          joined_at?: string
          role_id: string
          school_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          joined_at?: string
          role_id?: string
          school_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          education_level: string | null
          email: string | null
          fiscal_year_end: string | null
          fiscal_year_start: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          principal_name: string | null
          province: string | null
          school_code: string | null
          settings: Json
          slug: string
          timezone: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          education_level?: string | null
          email?: string | null
          fiscal_year_end?: string | null
          fiscal_year_start?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          principal_name?: string | null
          province?: string | null
          school_code?: string | null
          settings?: Json
          slug: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          education_level?: string | null
          email?: string | null
          fiscal_year_end?: string | null
          fiscal_year_start?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          principal_name?: string | null
          province?: string | null
          school_code?: string | null
          settings?: Json
          slug?: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      semester_reports: {
        Row: {
          academic_year: string
          account_breakdown: Json | null
          category_breakdown: Json | null
          closing_balance: number
          created_at: string
          generated_at: string
          id: string
          net_balance: number
          opening_balance: number
          school_id: string
          semester: number
          total_expense: number
          total_income: number
          transaction_count: number
          updated_at: string
        }
        Insert: {
          academic_year: string
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          net_balance?: number
          opening_balance?: number
          school_id: string
          semester: number
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
        }
        Update: {
          academic_year?: string
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          net_balance?: number
          opening_balance?: number
          school_id?: string
          semester?: number
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "semester_reports_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          academic_year_id: string
          created_at: string
          deleted_at: string | null
          end_date: string
          id: string
          is_active: boolean
          name: string
          school_id: string
          start_date: string
          term_type: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          deleted_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          school_id: string
          start_date: string
          term_type: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          deleted_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          school_id?: string
          start_date?: string
          term_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "semesters_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semesters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      student_guardians: {
        Row: {
          created_at: string
          deleted_at: string | null
          guardian_id: string
          is_primary_contact: boolean
          relationship_type: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          guardian_id: string
          is_primary_contact?: boolean
          relationship_type: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          guardian_id?: string
          is_primary_contact?: boolean
          relationship_type?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_guardians_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          address: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          deleted_at: string | null
          gender: string | null
          place_of_birth: string | null
          religion: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          gender?: string | null
          place_of_birth?: string | null
          religion?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          gender?: string | null
          place_of_birth?: string | null
          religion?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string
          created_at: string
          deleted_at: string | null
          id: string
          nis: string
          nisn: string | null
          profile_id: string | null
          school_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admission_date: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nis: string
          nisn?: string | null
          profile_id?: string | null
          school_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admission_date?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nis?: string
          nisn?: string | null
          profile_id?: string | null
          school_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          department_id: string | null
          id: string
          is_active: boolean
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          school_id: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          school_id?: string | null
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          school_id?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_categories: {
        Row: {
          color: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          school_id: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          school_id: string
          sort_order?: number
          type: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          school_id?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_categories_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_items: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          notes: string | null
          quantity: number
          sort_order: number
          subtotal: number
          transaction_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: string
          notes?: string | null
          quantity?: number
          sort_order?: number
          subtotal: number
          transaction_id: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          notes?: string | null
          quantity?: number
          sort_order?: number
          subtotal?: number
          transaction_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_reconciled: boolean
          notes: string | null
          payment_method_id: string | null
          receipt_number: string | null
          reconciled_at: string | null
          reference_number: string | null
          school_id: string
          status: string
          transaction_date: string
          transaction_number: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_reconciled?: boolean
          notes?: string | null
          payment_method_id?: string | null
          receipt_number?: string | null
          reconciled_at?: string | null
          reference_number?: string | null
          school_id: string
          status?: string
          transaction_date: string
          transaction_number: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_reconciled?: boolean
          notes?: string | null
          payment_method_id?: string | null
          receipt_number?: string | null
          reconciled_at?: string | null
          reference_number?: string | null
          school_id?: string
          status?: string
          transaction_date?: string
          transaction_number?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      yearly_reports: {
        Row: {
          account_breakdown: Json | null
          category_breakdown: Json | null
          closing_balance: number
          created_at: string
          generated_at: string
          id: string
          monthly_breakdown: Json | null
          net_balance: number
          opening_balance: number
          school_id: string
          total_expense: number
          total_income: number
          transaction_count: number
          updated_at: string
          year: number
        }
        Insert: {
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          monthly_breakdown?: Json | null
          net_balance?: number
          opening_balance?: number
          school_id: string
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
          year: number
        }
        Update: {
          account_breakdown?: Json | null
          category_breakdown?: Json | null
          closing_balance?: number
          created_at?: string
          generated_at?: string
          id?: string
          monthly_breakdown?: Json | null
          net_balance?: number
          opening_balance?: number
          school_id?: string
          total_expense?: number
          total_income?: number
          transaction_count?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "yearly_reports_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_role_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_school_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

