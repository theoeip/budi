// SystemStatusWidget — Displays application version, environment, and session info

import { Card, CardContent, CardHeader } from '@shared/components';

interface SystemStatusWidgetProps {
  /** Application version from package.json */
  appVersion: string;
  /** Current runtime environment */
  environment: string;
  /** Last sign-in timestamp */
  lastSignIn: string | null;
  /** Resolved theme mode */
  theme: string;
}

export function SystemStatusWidget({
  appVersion,
  environment,
  lastSignIn,
  theme,
}: SystemStatusWidgetProps) {
  const formattedDate = lastSignIn
    ? new Date(lastSignIn).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <Card>
      <CardHeader title="System Status" description="Application and session information" />
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatusItem
            label="Application"
            value={`BUDI v${appVersion}`}
            icon={
              <svg
                className="h-5 w-5 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            }
          />
          <StatusItem
            label="Environment"
            value={environment}
            icon={
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79"
                />
              </svg>
            }
          />
          <StatusItem
            label="Theme"
            value={theme.charAt(0).toUpperCase() + theme.slice(1)}
            icon={
              <svg
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            }
          />
          <StatusItem
            label="Last Sign In"
            value={formattedDate}
            icon={
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
