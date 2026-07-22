// School Selector Page — For Super Admin to select a school to manage

import { useAuth } from '@core/auth';
import { Alert, Button } from '@shared/components';
import { APP_NAME } from '@shared/constants';
import { useNavigate } from 'react-router-dom';

/**
 * School Selector page for Super Admin role.
 * Displays a list of schools and allows selection.
 * TODO: Fetch schools from DB when schools table exists.
 */
export function SchoolSelectorPage() {
  const { user, userSchools, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-lg">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}</h1>
            <p className="mt-2 text-sm text-gray-600">Select a school to manage in {APP_NAME}</p>
          </div>

          {/* Schools List or Placeholder */}
          <div className="mt-8">
            {userSchools.length === 0 ? (
              <Alert
                variant="info"
                message="No schools available"
                description="Schools will appear here once they are configured in the database."
              />
            ) : (
              <div className="space-y-3">
                {userSchools.map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => {
                      // TODO: Switch school context
                      navigate('/dashboard');
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{school.slug}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
