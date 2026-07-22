// Dashboard Page — Main application dashboard
// Placeholder page showing the basic layout. Will be built out with actual content.

import { useAuth } from '@core/auth';

export default function DashboardPage() {
  const { user, school } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {school?.name ? `Welcome, ${school.name}` : 'Dashboard'}
        </h1>
        <p className="mt-2 text-gray-600">
          {user ? `Logged in as ${user.full_name}` : 'BUDI School Management Platform'}
        </p>
      </div>

      {/* Quick Stats Placeholder */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Income" value="—" color="green" />
        <StatCard title="Total Expense" value="—" color="red" />
        <StatCard title="Pending" value="—" color="yellow" />
        <StatCard title="Balance" value="—" color="blue" />
      </div>

      {/* Placeholder Content */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">Dashboard content will be implemented in future versions.</p>
        <p className="mt-2 text-sm text-gray-400">
          Finance module is the active module — check /finance for financial overview.
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  color: 'green' | 'red' | 'yellow' | 'blue';
}

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

