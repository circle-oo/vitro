import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    // Focus the confirm button on open
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === 'danger';

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
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)' }}
        onClick={onCancel}
      />
      <div
        className="go"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px',
          minWidth: '320px',
          maxWidth: '90vw',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--t1)' }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6, marginBottom: '20px' }}>
            {description}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font)',
              background: 'transparent',
              color: 'var(--t2)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font)',
              background: isDanger
                ? 'linear-gradient(135deg, #F43F5E, #E11D48)'
                : 'linear-gradient(135deg, var(--p500), var(--p600))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: isDanger ? undefined : '0 2px 8px rgba(var(--gl), .22)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
