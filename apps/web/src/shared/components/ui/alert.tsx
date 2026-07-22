// UI Alert — Notification banner for errors, success, warnings

import { cn } from '@budi/utils';
import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  description?: string;
  className?: string;
  onDismiss?: () => void;
  children?: ReactNode;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string; title: string }> = {
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
  },
};

export function Alert({ variant, message, description, className, onDismiss }: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn('flex items-start gap-3 rounded-lg border p-4', styles.container, className)}
      role="alert"
    >
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium', styles.title)}>{message}</p>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 rounded p-1 transition-colors hover:bg-black/5',
            styles.title,
          )}
          aria-label="Dismiss"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
