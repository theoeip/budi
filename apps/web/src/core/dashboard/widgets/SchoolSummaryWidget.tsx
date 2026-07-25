// SchoolSummaryWidget — Displays current school context and role information

import type { SchoolProfile } from '@budi/types';
import { Card, CardContent, CardHeader } from '@shared/components';

interface SchoolSummaryWidgetProps {
  school: SchoolProfile | null;
  roleLabel: string;
  roleColor: string;
  userSchoolsCount: number;
}

export function SchoolSummaryWidget({
  school,
  roleLabel,
  roleColor,
  userSchoolsCount,
}: SchoolSummaryWidgetProps) {
  return (
    <Card>
      <CardHeader title="School Context" description="Current school and role" />
      <CardContent className="space-y-4">
        {/* Role Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Current Role</span>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: roleColor }}
          >
            {roleLabel}
          </span>
        </div>

        {/* School Info */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-3">
          {school ? (
            <>
              <DetailRow label="School Name" value={school.name} />
              <DetailRow label="School Slug" value={school.slug} />
              <DetailRow label="School ID" value={school.id.substring(0, 8) + '...'} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No school assigned</p>
          )}
        </div>

        {/* Multi-school info */}
        <div className="text-xs text-gray-500">
          {userSchoolsCount > 1
            ? `${userSchoolsCount} schools available — use School Selector to switch`
            : userSchoolsCount === 1
              ? 'Single school access'
              : 'No school memberships'}
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
