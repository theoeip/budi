import React from 'react';


interface CrudDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function CrudDrawer({ isOpen, onClose, title, children, footer }: CrudDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Slide-over panel */}
            <div className="pointer-events-auto w-screen max-w-md flex h-full flex-col bg-white shadow-xl">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                  {title}
                </h2>
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex flex-shrink-0 justify-end px-4 py-4 border-t border-gray-200 gap-3">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
