// @budi/types — School entity types
// Updated for Sprint 2.1 — School Management Module

/** Education level options for a school */
export type EducationLevel = 'sd' | 'smp' | 'sma' | 'smk' | 'mi' | 'mts' | 'ma' | 'pkbm' | 'other';

/** School status */
export type SchoolStatus = 'active' | 'inactive';

/** Main school entity representing a tenant in the multi-tenant system */
export interface School {
  id: string;
  name: string;
  slug: string;
  school_code: string | null;
  education_level: EducationLevel | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  website: string | null;
  principal_name: string | null;
  logo_url: string | null;
  is_active: boolean;
  currency: string;
  timezone: string;
  fiscal_year_start: string | null;
  fiscal_year_end: string | null;
  settings: SchoolSettings;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** School subscription plan options */
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

/** School-level configuration settings */
export interface SchoolSettings {
  timezone: string;
  locale: string;
  currency: string;
  academic_year_start: string;
  academic_year_end: string;
}

/** School profile for display purposes */
export interface SchoolProfile {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

/** Minimal school info for dropdown/select components */
export interface SchoolOption {
  id: string;
  name: string;
}

/** Form input for creating/editing a school */
export interface SchoolFormInput {
  name: string;
  slug: string;
  school_code: string;
  education_level: EducationLevel;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  website: string;
  principal_name: string;
  logo_url: string;
  is_active: boolean;
}
