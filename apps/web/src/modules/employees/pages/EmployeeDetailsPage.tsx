import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../repositories/useEmployeeRepository';
import { EmployeeOverview } from '../components/EmployeeOverview';
import { EmployeeProfileForm } from '../components/EmployeeProfileForm';
import { EmployeeHrForm } from '../components/EmployeeHrForm';
import { EmployeeCapabilitiesSection } from '../components/EmployeeCapabilitiesSection';
import { EmployeeDepartmentsSection } from '../components/EmployeeDepartmentsSection';
import { EmployeeStatusBadge } from '../components/EmployeeStatusBadge';
import { EmployeeStatusDialog } from '../components/EmployeeStatusDialog';
import { useEmployeeProfile, useUpdateEmployeeProfile } from '../repositories/useEmployeeProfileRepository';
import { useAuth } from '@core/auth';
import { cn } from '@budi/utils';

import type { EmploymentStatus } from '@budi/types';

type TabType = 'overview' | 'personal' | 'departments' | 'capabilities' | 'hr';

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const canManage = ['super_admin', 'school_admin'].includes(role || '');
  
  const { data: employee, isLoading } = useEmployee(id!);
  const { data: profile } = useEmployeeProfile(id!);
  const updateProfile = useUpdateEmployeeProfile();

  if (isLoading) return <div>Memuat...</div>;
  if (!employee) return <div>Guru/Staf tidak ditemukan</div>;

  const tabs = [
    { id: 'overview', label: 'Ringkasan' },
    { id: 'personal', label: 'Data Pribadi' },
    { id: 'departments', label: 'Departemen' },
    { id: 'capabilities', label: 'Kemampuan' },
  ];

  if (canManage) {
    tabs.push({ id: 'hr', label: 'Catatan SDM' });
  }

  const handleProfileSubmit = async (data: Record<string, unknown>) => {
    await updateProfile.mutateAsync({ id: employee.id, data });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/employees')} className="text-sm text-indigo-600 hover:text-indigo-900 mb-2">
            &larr; Kembali ke Daftar
          </button>
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {employee.full_name}
            </h2>
            <EmployeeStatusBadge status={employee.employment_status as EmploymentStatus} />
          </div>
          <p className="mt-1 text-sm text-gray-500">No Pegawai: {employee.employee_number || '-'}</p>
        </div>
        
        {canManage && (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsStatusDialogOpen(true)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Ubah Status
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <EmployeeOverview employee={employee} />}
        
        {activeTab === 'personal' && (
          <EmployeeProfileForm 
            initialData={profile} 
            onSubmit={handleProfileSubmit}
            isLoading={updateProfile.isPending}
          />
        )}
        
        {activeTab === 'departments' && (
          <EmployeeDepartmentsSection employeeId={employee.id} canManage={canManage} />
        )}
        
        {activeTab === 'capabilities' && (
          <EmployeeCapabilitiesSection employeeId={employee.id} canManage={canManage} />
        )}
        
        {/* Critical: HR component is only mounted when the HR tab is active, preventing premature data fetching */}
        {activeTab === 'hr' && canManage && (
          <EmployeeHrForm employeeId={employee.id} />
        )}
      </div>

      {canManage && (
        <EmployeeStatusDialog
          isOpen={isStatusDialogOpen}
          onClose={() => setIsStatusDialogOpen(false)}
          employeeId={employee.id}
          currentStatus={employee.employment_status as EmploymentStatus}
        />
      )}
    </div>
  );
}
