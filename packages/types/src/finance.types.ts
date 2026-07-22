// @budi/types — Finance module types
// Active module — these types represent the core finance data model.

import type { AuditableEntity } from './index';

/** Transaction entry — income or expense record */
export interface FinanceTransaction extends AuditableEntity {
  school_id: string;
  category_id: string;
  account_id: string | null;
  amount: number;
  description: string | null;
  notes: string | null;
  transaction_date: string;
  due_date: string | null;
  type: TransactionType;
  status: TransactionStatus;
  payment_method: PaymentMethod | null;
  reference_number: string | null;
  is_reconciled: boolean;
  reconciled_at: string | null;
}

/** Transaction type */
export type TransactionType = 'income' | 'expense';

/** Transaction status */
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

/** Available payment methods */
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'check' | 'other';

/** Financial category for grouping transactions */
export interface FinanceCategory extends AuditableEntity {
  school_id: string;
  name: string;
  description: string | null;
  type: TransactionType;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  parent_id: string | null;
  sort_order: number;
}

/** Bank or cash account */
export interface FinanceAccount extends AuditableEntity {
  school_id: string;
  name: string;
  account_number: string | null;
  bank_name: string | null;
  type: AccountType;
  currency: string;
  initial_balance: number;
  current_balance: number;
  is_active: boolean;
}

/** Account type */
export type AccountType = 'cash' | 'bank' | 'digital_wallet' | 'other';

/** Financial report summary */
export interface FinanceReport {
  school_id: string;
  period_start: string;
  period_end: string;
  total_income: number;
  total_expense: number;
  net_balance: number;
  transaction_count: number;
  category_breakdown: FinanceCategorySummary[];
}

/** Category-wise financial summary */
export interface FinanceCategorySummary {
  category_id: string;
  category_name: string;
  type: TransactionType;
  total: number;
  count: number;
  percentage: number;
}

/** Finance dashboard overview */
export interface FinanceOverview {
  current_balance: number;
  monthly_income: number;
  monthly_expense: number;
  pending_transactions: number;
  overdue_payments: number;
  recent_transactions: FinanceTransaction[];
}

/** Transaction filter options */
export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  category_id?: string;
  account_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

