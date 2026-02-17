import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export function Toast({ message, visible, duration = 2000, onHide }: ToastProps) {
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
