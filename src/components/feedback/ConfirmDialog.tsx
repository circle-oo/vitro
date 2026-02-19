import React, { useCallback, useEffect, useRef } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Portal } from '../ui/Portal';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
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
  minWidth: '320px',
  maxWidth: '90vw',
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 300,
  marginBottom: '8px',
  color: 'var(--t1)',
};

const DESCRIPTION_STYLE: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--t2)',
  lineHeight: 1.6,
  marginBottom: '20px',
};

const ACTIONS_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
};

const CANCEL_BUTTON_STYLE: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '13px',
  fontWeight: 300,
  fontFamily: 'var(--font)',
  background: 'transparent',
  color: 'var(--t2)',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
};

const CONFIRM_BUTTON_BASE_STYLE: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '13px',
  fontWeight: 300,
  fontFamily: 'var(--font)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
};

const CONFIRM_BUTTON_DEFAULT_STYLE: React.CSSProperties = {
  ...CONFIRM_BUTTON_BASE_STYLE,
  background: 'linear-gradient(135deg, var(--p500), var(--p600))',
  boxShadow: '0 2px 8px rgba(var(--gl), .22)',
};

const CONFIRM_BUTTON_DANGER_STYLE: React.CSSProperties = {
  ...CONFIRM_BUTTON_BASE_STYLE,
  background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEscapeKey(onCancel, { enabled: open });
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    // Focus the confirm button on open
    confirmRef.current?.focus();
  }, [open]);
  const onBackdropClick = useCallback(() => {
    onCancel();
  }, [onCancel]);

  if (!open) return null;

  const isDanger = variant === 'danger';
  const confirmButtonStyle = isDanger ? CONFIRM_BUTTON_DANGER_STYLE : CONFIRM_BUTTON_DEFAULT_STYLE;

  return (
    <Portal>
      <div style={LAYER_STYLE}>
        <div
          style={BACKDROP_STYLE}
          onClick={onBackdropClick}
        />
        <div
          className="go"
          style={PANEL_STYLE}
        >
          <div style={TITLE_STYLE}>
            {title}
          </div>
          {description && (
            <div style={DESCRIPTION_STYLE}>
              {description}
            </div>
          )}
          <div style={ACTIONS_STYLE}>
            <button
              type="button"
              onClick={onCancel}
              style={CANCEL_BUTTON_STYLE}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              ref={confirmRef}
              onClick={onConfirm}
              style={confirmButtonStyle}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
