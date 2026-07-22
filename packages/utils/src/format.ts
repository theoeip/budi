// Formatting utility functions for numbers, currency, and strings.

/**
 * Format a number as currency with locale support.
 * Defaults to IDR (Indonesian Rupiah).
 */
export function formatCurrency(
  amount: number,
  currency: string = 'IDR',
  locale: string = 'id-ID',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousand separators.
 */
export function formatNumber(
  value: number,
  locale: string = 'id-ID',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a decimal as percentage.
 */
export function formatPercentage(
  value: number,
  fractionDigits: number = 1,
): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

/**
 * Truncate a string to a specified length with ellipsis.
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

