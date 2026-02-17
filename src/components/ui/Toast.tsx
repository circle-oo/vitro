import React, { useEffect, useState } from 'react';

const variantStyles: Record<string, { bg: string; color: string }> = {
  success: { bg: 'color-mix(in srgb, var(--ok) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--ok)' },
  error: { bg: 'color-mix(in srgb, var(--err) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--err)' },
  info: { bg: 'var(--go-bg, rgba(255,255,255,.72))', color: 'var(--t1)' },
};

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  variant?: 'success' | 'error' | 'info';
  onHide?: () => void;
}

export function Toast({ message, visible, duration = 2000, variant = 'info', onHide }: ToastProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide?.();
      }, duration);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [visible, duration, onHide]);

  const vs = variantStyles[variant];

  return (
    <div
      className="go"
      style={{
        position: 'fixed',
        bottom: '76px',
        right: '20px',
        zIndex: 200,
        padding: '14px 22px',
        borderRadius: '16px',
        fontSize: '13px',
        fontWeight: 500,
        color: vs.color,
        background: vs.bg,
        transform: show ? 'translateY(0)' : 'translateY(16px)',
        opacity: show ? 1 : 0,
        transition: 'all .25s cubic-bezier(.22, 1, .36, 1)',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
