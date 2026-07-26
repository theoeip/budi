// PermissionSummaryWidget — Displays permission summary for the current role

import type { RolePermissions } from '@budi/types';
import { Card, CardContent, CardHeader } from '@shared/components';

interface PermissionSummaryWidgetProps {
  permissions: RolePermissions | null;
  roleLabel: string;
}

interface PermissionEntry {
  key: string;
  label: string;
  value: boolean;
}

const PERMISSION_LABELS: Record<string, string> = {
  canManageSchools: 'Kelola Sekolah',
  canManageUsers: 'Kelola Pengguna',
  canManageFinance: 'Kelola Keuangan',
  canManageAcademic: 'Kelola Akademik',
  canViewReports: 'Lihat Laporan',
  canExportData: 'Ekspor Data',
};

export function PermissionSummaryWidget({ permissions, roleLabel }: PermissionSummaryWidgetProps) {
  if (!permissions) {
    return (
      <Card>
        <CardHeader title="Hak Akses" description="Data hak akses tidak tersedia" />
      </Card>
    );
  }

  const entries: PermissionEntry[] = Object.entries(PERMISSION_LABELS).map(([key, label]) => ({
    key,
    label,
    value: permissions[key as keyof RolePermissions] as boolean,
  }));

  const grantedCount = entries.filter((e) => e.value).length;
  const deniedCount = entries.filter((e) => !e.value).length;

  return (
    <Card>
      <CardHeader
        title="Hak Akses"
        description={`${roleLabel} — ${grantedCount} diizinkan, ${deniedCount} tidak diizinkan`}
      />
      <CardContent>
        <div className="space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.key}
              className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <span className="text-sm text-gray-700">{entry.label}</span>
              {entry.value ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Diizinkan
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tidak Diizinkan
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
