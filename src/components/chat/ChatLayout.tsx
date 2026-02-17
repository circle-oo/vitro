import React from 'react';

export interface ChatLayoutProps {
  maxHeight?: string;
  children?: React.ReactNode;
  input?: React.ReactNode;
  className?: string;
}

export function ChatLayout({
  maxHeight = '750px',
  children,
  input,
  className,
}: ChatLayoutProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - 100px)`,
        maxHeight,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {children}
      </div>
      {input && <div style={{ marginTop: '12px' }}>{input}</div>}
    </div>
  );
}
