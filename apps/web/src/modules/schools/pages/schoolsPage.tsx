// School Management — Placeholder Page
// Foundation page for the School Management module.

import { Card, CardContent, CardHeader, Spinner } from '@shared/components';

/**
 * Placeholder page for the Schools module.
 * Full CRUD implementation will be added in Sprint 2.1.1+.
 */
export function SchoolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
        <p className="mt-2 text-sm text-gray-600">Manage school tenants in the BUDI platform.</p>
      </div>

      <Card>
        <CardHeader title="Schools" description="School management is under development" />
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-gray-500">
                School Management module foundation is ready.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                CRUD functionality will be available in the next sprint.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
