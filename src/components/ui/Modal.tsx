import React from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEscapeKey(onClose, { enabled: open });
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,.25)',
        }}
        onClick={onClose}
      />
      <div
        className={`go ${className ?? ''}`}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
