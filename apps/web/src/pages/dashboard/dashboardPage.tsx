// Dashboard Page — Diagnostic Dashboard
// Composes widgets from dashboard.config.ts using a WidgetRegistry.
// Role context is gathered once and passed to widgets via props.
// Sensitive widgets are wrapped with ComponentGuard for permission gating.

import { ROLES } from '@budi/config';
import { cn } from '@budi/utils';
import { useAuth } from '@core/auth';
import { getSortedWidgets, widgetSizeToGridCols } from '@core/dashboard/dashboard.config';
import { getWidgetComponent } from '@core/dashboard/widgets';
import { ComponentGuard } from '@core/permissions';
import { useTheme } from '@core/theme';
import { useMemo } from 'react';

/**
 * Map of widget IDs that require a permission guard.
 * Only widgets listed here will be wrapped with ComponentGuard.
 * The permission key is the value.
 */
const GUARDED_WIDGETS: Record<string, string> = {
  // Examples of permission-gated widgets:
  // financeSummary: 'canManageFinance',
  // settingsSummary: 'canManageUsers',
};

// Application metadata (resolved at build time via Vite define or import.meta.env)
const APP_VERSION = '0.1.0';
const APP_ENV = import.meta.env.MODE ?? 'development';

export default function DashboardPage() {
  const { user, school, role, permissions, userSchools, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();

  // Gather context once — passed to all widgets
  const widgetContext = useMemo(() => {
    const roleConfig = role ? ROLES[role] : null;
    const roleLabel = roleConfig?.label ?? role ?? 'Tidak Diketahui';
    const roleColor = roleConfig?.color ?? '#6B7280';

    return {
      user,
      school,
      role,
      roleLabel,
      roleColor,
      permissions,
      userSchoolsCount: userSchools.length,
      appVersion: APP_VERSION,
      environment: APP_ENV,
      lastSignIn: user?.last_sign_in_at ?? null,
      theme: resolvedTheme,
      isLoading,
    };
  }, [user, school, role, permissions, userSchools, resolvedTheme, isLoading]);

  // Get sorted and filtered widgets from config
  const widgets = useMemo(() => {
    return getSortedWidgets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Memuat dasbor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {widgetContext.school?.name ? `Dasbor ${widgetContext.school.name}` : 'Dasbor'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {widgetContext.user?.full_name
            ? `Selamat datang kembali, ${widgetContext.user.full_name}`
            : 'Selamat datang di Platform Manajemen Sekolah BUDI'}
        </p>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {widgets.map((widgetDef) => {
          const WidgetComponent = getWidgetComponent(widgetDef.id);

          if (!WidgetComponent) {
            return (
              <div
                key={widgetDef.id}
                className={cn(
                  'rounded-lg border-2 border-dashed border-gray-200 p-6 text-center',
                  widgetSizeToGridCols(widgetDef.size),
                )}
              >
                <p className="text-sm text-gray-400">
                  Widget &ldquo;{widgetDef.id}&rdquo; not registered
                </p>
              </div>
            );
          }

          const guardPermission = GUARDED_WIDGETS[widgetDef.id];

          const widgetElement = (
            <div key={widgetDef.id} className={widgetSizeToGridCols(widgetDef.size)}>
              <WidgetComponent {...(widgetContext as Record<string, unknown>)} />
            </div>
          );

          // Wrap with permission guard if configured
          if (guardPermission) {
            return (
              <ComponentGuard key={widgetDef.id} permission={guardPermission}>
                {widgetElement}
              </ComponentGuard>
            );
          }

          return widgetElement;
        })}
      </div>
    </div>
  );
}
