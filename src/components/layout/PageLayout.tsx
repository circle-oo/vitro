import React from 'react';

interface PageLayoutProps {
  sidebarCollapsed?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  sidebarCollapsed = false,
  children,
  className,
}: PageLayoutProps) {
  return (
    <main
      className={className}
      style={{
        marginLeft: sidebarCollapsed ? '88px' : '274px',
        padding: '24px 28px',
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left .25s cubic-bezier(.22, 1, .36, 1)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </main>
  );
}
