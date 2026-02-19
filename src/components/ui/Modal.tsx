import React, { useCallback } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Portal } from './Portal';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

const LAYER_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const BACKDROP_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,.25)',
};

const PANEL_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  padding: '28px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
};

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEscapeKey(onClose, { enabled: open });
  useBodyScrollLock(open);
  const onBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div style={LAYER_STYLE}>
        <div
          style={BACKDROP_STYLE}
          onClick={onBackdropClick}
        />
        <div
          className={`go ${className ?? ''}`}
          style={PANEL_STYLE}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}
