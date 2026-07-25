// Dashboard Layout — Reusable authenticated application shell
// Responsible ONLY for layout structure: Header, Sidebar, Content.
// Does NOT know which page is being rendered.
// Navigation is generated from @budi/config/navigation via PermissionService.

import { NAV_ITEMS, type NavItem } from '@budi/config';
import { cn } from '@budi/utils';
import { useAuth } from '@core/auth';
import { useTheme } from '@core/theme';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { permissionService } from '../../services/permissionService';

interface DashboardLayoutProps {
  children: ReactNode;
}

// ============================================================
// Icon Resolution
// ============================================================

function resolveIcon(iconName: string): ReactNode {
  const iconSize = 'h-5 w-5';
  const svgProps = { className: cn(iconSize, 'flex-shrink-0'), 'aria-hidden': true as const };

  switch (iconName) {
    case 'LayoutDashboard':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      );
    case 'Wallet':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
      );
    case 'Settings':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'BarChart3':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      );
    case 'ArrowLeftRight':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      );
    case 'Tags':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      );
    case 'Landmark':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
      );
    case 'FileBarChart':
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      );
    default:
      return (
        <svg {...svgProps} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      );
  }
}

// ============================================================
// Navigation Filtering via PermissionService
// ============================================================

function filterNavItems(items: NavItem[], role: string | null): NavItem[] {
  if (!role) return [];
  return items
    .filter((item) => permissionService.hasAnyRole(role as never, item.roles))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        permissionService.hasAnyRole(role as never, child.roles),
      ),
    }));
}

// ============================================================
// Sidebar Component
// ============================================================

interface SidebarProps {
  navItems: NavItem[];
  currentPath: string;
  onItemClick?: () => void;
}

function Sidebar({ navItems, currentPath, onItemClick }: SidebarProps) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
        const hasActiveChild = item.children?.some(
          (child) => currentPath === child.path || currentPath.startsWith(child.path + '/'),
        );

        return (
          <div key={item.path}>
            <Link
              to={item.path}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive || hasActiveChild
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              {resolveIcon(item.icon)}
              <span>{item.label}</span>
            </Link>

            {item.children && item.children.length > 0 && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                {item.children.map((child) => {
                  const isChildActive = currentPath === child.path;
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={onItemClick}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isChildActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      )}
                    >
                      {resolveIcon(child.icon)}
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ============================================================
// User Menu Dropdown Component
// ============================================================

interface UserMenuProps {
  userInitial: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

function UserMenu({ userInitial, userName, userRole, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {userInitial}
        </div>
        <svg
          className={cn('h-4 w-4 text-gray-500 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs capitalize text-gray-500">{userRole.replace(/_/g, ' ')}</p>
            </div>
            <div className="p-2">
              {/* Profile placeholder */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Profile
              </button>

              {/* Preferences placeholder */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
                Preferences
              </button>

              {/* Settings placeholder */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </button>

              <hr className="my-2 border-gray-100" />

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Header Icon Placeholders
// ============================================================

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {resolvedTheme === 'light' ? (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )}
    </button>
  );
}

function NotificationBell() {
  return (
    <button
      type="button"
      className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      aria-label="Notifications"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
    </button>
  );
}

function SchoolSelectorPlaceholder() {
  const { school } = useAuth();

  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      title="School Selector (coming soon)"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
        />
      </svg>
      <span className="hidden sm:inline">{school?.name ?? 'Select School'}</span>
    </button>
  );
}

// ============================================================
// Dashboard Layout
// ============================================================

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = useMemo(() => filterNavItems(NAV_ITEMS, role), [role]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() ?? 'U';
  const displayRole = role?.replace(/_/g, ' ') ?? '';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ============================================================
           Sidebar (Desktop)
           ============================================================ */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            B
          </div>
          <span className="text-lg font-bold text-gray-900">BUDI</span>
        </div>

        {/* Navigation */}
        <Sidebar navItems={navItems} currentPath={location.pathname} />
      </aside>

      {/* ============================================================
           Main Content Area
           ============================================================ */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* ============================================================
             Header
             ============================================================ */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Left: Mobile menu toggle + School Selector */}
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>

              {/* School Selector (desktop) */}
              <SchoolSelectorPlaceholder />
            </div>

            {/* Right: Theme toggle, Notifications, User menu */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
              <UserMenu
                userInitial={userInitial}
                userName={user?.full_name ?? 'User'}
                userRole={displayRole}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* ============================================================
             Content
             ============================================================ */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* ============================================================
           Mobile Sidebar Overlay
           ============================================================ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 flex w-72 max-w-[calc(100vw-3rem)] flex-col bg-white shadow-xl">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  B
                </div>
                <span className="text-lg font-bold text-gray-900">BUDI</span>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Navigation */}
            <Sidebar
              navItems={navItems}
              currentPath={location.pathname}
              onItemClick={() => setIsSidebarOpen(false)}
            />

            {/* Drawer User Info */}
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs capitalize text-gray-500">{displayRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
