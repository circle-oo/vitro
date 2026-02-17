import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--p500), var(--p400))',
          animation: 'vitro-loading 1.2s ease-in-out infinite',
        }}
      />
      {message && (
        <div style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 500 }}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes vitro-loading {
          0%, 100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
