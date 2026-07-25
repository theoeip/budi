// UserSummaryWidget — Displays authenticated user profile information

import type { UserProfile } from '@budi/types';
import { Card, CardContent, CardHeader } from '@shared/components';

interface UserSummaryWidgetProps {
  user: UserProfile | null;
  roleLabel: string;
  roleColor: string;
}

export function UserSummaryWidget({ user, roleLabel, roleColor }: UserSummaryWidgetProps) {
  if (!user) {
    return (
      <Card>
        <CardHeader title="Current User" description="Not authenticated" />
      </Card>
    );
  }

  const userInitial = user.full_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <Card>
      <CardHeader title="Current User" description="Authenticated user profile" />
      <CardContent className="space-y-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: roleColor }}
          >
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-900 truncate">{user.full_name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-3">
          <DetailRow label="Role" value={roleLabel} />
          <DetailRow label="User ID" value={user.id.substring(0, 8) + '...'} />
          <DetailRow label="Phone" value={user.phone ?? '—'} />
          <DetailRow label="Status" value={user.is_active ? 'Active' : 'Inactive'} />
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
