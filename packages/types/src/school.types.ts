// @budi/types — School entity types

/** Main school entity representing a tenant in the multi-tenant system */
export interface School {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
  subscription_plan: SubscriptionPlan;
  settings: SchoolSettings;
  created_at: string;
  updated_at: string;
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
  finance: FinanceSettings;
}

/** Finance module settings within a school */
export interface FinanceSettings {
  fiscal_year_start: string;
  default_currency: string;
  enable_fee_reminders: boolean;
  enable_auto_receipts: boolean;
  enable_budgeting: boolean;
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

