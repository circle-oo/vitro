import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  id?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends Required<Pick<ToastOptions, 'variant' | 'duration'>> {
  id: string;
  message: string;
}

export interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  bottom?: number;
  right?: number;
  gap?: number;
}

const variantStyles: Record<ToastVariant, { bg: string; color: string }> = {
  success: { bg: 'color-mix(in srgb, var(--ok) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--ok)' },
  error: { bg: 'color-mix(in srgb, var(--err) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--err)' },
  info: { bg: 'var(--go-bg, rgba(255,255,255,.72))', color: 'var(--t1)' },
};

const DEFAULT_DURATION = 2200;

function createToastId() {
  return `vitro-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastViewport({
  toasts,
  onDismiss,
  bottom = 20,
  right = 20,
  gap = 10,
}: ToastViewportProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right,
        bottom,
        zIndex: 220,
        display: 'grid',
        gap,
        pointerEvents: 'none',
        maxWidth: 'min(420px, calc(100vw - 24px))',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const variant = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            className="go"
            role="status"
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 500,
              color: variant.color,
              background: variant.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              pointerEvents: 'auto',
              animation: 'fi .2s var(--ease)',
            }}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                opacity: 0.65,
                padding: 0,
                minHeight: 'unset',
              }}
            >
              {'\u00D7'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export interface UseToastResult {
  toasts: ToastItem[];
  show: (message: string, options?: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  remove: (id: string) => void;
  clear: () => void;
}

export function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer != null) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    const id = options.id ?? createToastId();
    const variant = options.variant ?? 'info';
    const duration = options.duration ?? DEFAULT_DURATION;

    setToasts((prev) => [...prev.filter((item) => item.id !== id), { id, message, variant, duration }]);

    const previous = timers.current.get(id);
    if (previous != null) window.clearTimeout(previous);

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);

    return id;
  }, []);

  const clear = useCallback(() => {
    for (const timer of timers.current.values()) {
      window.clearTimeout(timer);
    }
    timers.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => () => {
    for (const timer of timers.current.values()) {
      window.clearTimeout(timer);
    }
    timers.current.clear();
  }, []);

  return useMemo<UseToastResult>(() => ({
    toasts,
    show,
    success: (message, options) => show(message, { ...options, variant: 'success' }),
    error: (message, options) => show(message, { ...options, variant: 'error' }),
    info: (message, options) => show(message, { ...options, variant: 'info' }),
    remove,
    clear,
  }), [clear, remove, show, toasts]);
}
