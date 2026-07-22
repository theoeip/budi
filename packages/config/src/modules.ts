// Module registry and feature flag configuration.

/** Module configuration */
export interface ModuleConfig {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string; // Lucide icon name
  order: number; // Display order in navigation
}

/** All BUDI modules */
export const MODULES: ModuleConfig[] = [
  {
    code: 'finance',
    name: 'Finance',
    description: 'Fee management, transactions, accounting',
    isActive: true,
    icon: 'Wallet',
    order: 1,
  },
  {
    code: 'academic',
    name: 'Academic',
    description: 'Curriculum, classes, grading',
    isActive: false,
    icon: 'BookOpen',
    order: 2,
  },
  {
    code: 'student',
    name: 'Student',
    description: 'Student profile & records',
    isActive: false,
    icon: 'Users',
    order: 3,
  },
  {
    code: 'teacher',
    name: 'Teacher',
    description: 'Teacher profile & assignments',
    isActive: false,
    icon: 'GraduationCap',
    order: 4,
  },
  {
    code: 'attendance',
    name: 'Attendance',
    description: 'Student attendance tracking',
    isActive: false,
    icon: 'ClipboardCheck',
    order: 5,
  },
  {
    code: 'library',
    name: 'Library',
    description: 'Book management, borrowing',
    isActive: false,
    icon: 'Library',
    order: 6,
  },
  {
    code: 'payroll',
    name: 'Payroll',
    description: 'Employee salary management',
    isActive: false,
    icon: 'Banknote',
    order: 7,
  },
  {
    code: 'inventory',
    name: 'Inventory',
    description: 'Asset & inventory management',
    isActive: false,
    icon: 'Package',
    order: 8,
  },
  {
    code: 'ppdb',
    name: 'PPDB',
    description: 'Student admissions',
    isActive: false,
    icon: 'ClipboardList',
    order: 9,
  },
];

/** Active module codes for quick lookup */
export const ACTIVE_MODULES = MODULES.filter((m) => m.isActive).map((m) => m.code);

/** Feature flags for environment-based toggling */
export const FEATURE_FLAGS: Record<string, boolean> = {
  FINANCE: true,
  ACADEMIC: false,
  LIBRARY: false,
  ATTENDANCE: false,
  INVENTORY: false,
  PAYROLL: false,
  STUDENT: false,
  TEACHER: false,
  PPDB: false,
};

