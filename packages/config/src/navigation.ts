// Navigation menu configuration.

import type { UserRole } from '@budi/types';

/** Navigation menu item */
export interface NavItem {
  label: string;
  path: string;
  icon: string; // Lucide icon name
  module?: string; // Module code (optional for core nav items)
  roles: UserRole[]; // Allowed roles
  children?: NavItem[]; // Sub-navigation items
}

/** Main navigation items */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['super_admin', 'school_admin', 'treasurer', 'viewer'],
  },
  {
    label: 'Finance',
    path: '/finance',
    icon: 'Wallet',
    module: 'finance',
    roles: ['super_admin', 'school_admin', 'treasurer'],
    children: [
      { label: 'Overview', path: '/finance', icon: 'BarChart3', roles: ['super_admin', 'school_admin', 'treasurer'] },
      { label: 'Transactions', path: '/finance/transactions', icon: 'ArrowLeftRight', roles: ['super_admin', 'school_admin', 'treasurer'] },
      { label: 'Categories', path: '/finance/categories', icon: 'Tags', roles: ['super_admin', 'school_admin'] },
      { label: 'Accounts', path: '/finance/accounts', icon: 'Landmark', roles: ['super_admin', 'school_admin', 'treasurer'] },
      { label: 'Reports', path: '/finance/reports', icon: 'FileBarChart', roles: ['super_admin', 'school_admin', 'treasurer', 'viewer'] },
      { label: 'Settings', path: '/finance/settings', icon: 'Settings', roles: ['super_admin', 'school_admin'] },
    ],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    roles: ['super_admin', 'school_admin'],
  },
];

/** Get navigation items filtered by role */
export function getNavItemsByRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
    ...item,
    children: item.children?.filter((child) => child.roles.includes(role)),
  }));
}

