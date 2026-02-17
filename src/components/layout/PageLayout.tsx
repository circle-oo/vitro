import React from 'react';
import { useMobile } from '../../hooks/useMediaQuery';

interface PageLayoutProps {
  sidebarCollapsed?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Mobile: render a hamburger menu button */
  onMobileMenuOpen?: () => void;
}

export function PageLayout({
  sidebarCollapsed = false,
  children,
  className,
  onMobileMenuOpen,
}: PageLayoutProps) {
  const isMobile = useMobile();

  return (
    <main
      className={className}
      style={{
        marginLeft: isMobile ? 0 : sidebarCollapsed ? '88px' : '274px',
        padding: isMobile ? '14px 14px 88px' : '24px 28px',
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left .25s cubic-bezier(.22, 1, .36, 1)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {isMobile && onMobileMenuOpen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <button
            className="gi"
            onClick={onMobileMenuOpen}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--t2)',
              fontSize: '20px',
              flexShrink: 0,
            }}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      )}
      {children}
    </main>
  );
}
