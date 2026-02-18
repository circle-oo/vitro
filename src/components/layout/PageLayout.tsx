import React from 'react';
import { useMobile } from '../../hooks/useMediaQuery';

export interface PageLayoutProps {
  sidebarCollapsed?: boolean;
  /** Explicit desktop offset for custom sidebar widths */
  sidebarOffset?: number;
  /** Override min height for embedded previews */
  minHeight?: number | string;
  children?: React.ReactNode;
  className?: string;
  /** Mobile: render a hamburger menu button */
  onMobileMenuOpen?: () => void;
  /** Accessible label for mobile menu toggle */
  mobileMenuLabel?: string;
}

export function PageLayout({
  sidebarCollapsed = false,
  sidebarOffset,
  minHeight = '100dvh',
  children,
  className,
  onMobileMenuOpen,
  mobileMenuLabel = 'Open menu',
}: PageLayoutProps) {
  const isMobile = useMobile();
  const desktopMargin = sidebarOffset ?? (sidebarCollapsed ? 88 : 274);

  return (
    <main
      className={className}
      style={{
        marginLeft: isMobile ? 0 : `${desktopMargin}px`,
        padding: isMobile
          ? 'calc(14px + env(safe-area-inset-top, 0px)) 14px calc(88px + env(safe-area-inset-bottom, 0px))'
          : '24px 28px',
        flex: 1,
        minHeight,
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
            aria-label={mobileMenuLabel}
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
