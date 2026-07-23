// Core Theme — Theme tokens and configuration
// Extends Tailwind CSS with BUDI-specific design tokens.

export const themeTokens = {
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      900: '#78350f',
    },
    danger: {
      50: '#fef2f2',
      500: '#ef4444',
      900: '#7f1d1d',
    },
  },
  spacing: {
    page: '24px',
    section: '16px',
    element: '8px',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    dropdown: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const;

export type ThemeTokens = typeof themeTokens;

// Re-export ThemeProvider and useTheme from the providers layer
// This ensures @core/theme is the canonical import path for theme consumers.
export { ThemeProvider, useTheme } from '../providers/themeProvider';
