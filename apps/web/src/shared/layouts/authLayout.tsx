// Auth Layout — Layout for authentication pages (login, forgot password)
// Clean, minimal layout with centered card.

import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/branding/logo.svg"
              alt="BUDI"
              className="h-12 w-auto"
              onError={(e) => {
                // Fallback if logo doesn't exist
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-3xl font-bold text-brand-600">BUDI</div>';
                }
              }}
            />
          </div>

          <div className="mt-8">{children}</div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BUDI — Business & Unified Digital Information
          </p>
        </div>
      </div>
    </div>
  );
}
