import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

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
  position?: ToastPosition;
  offset?: number;
  gap?: number;
  bottom?: number;
  right?: number;
}

export interface UseToastResult {
  toasts: ToastItem[];
  show: (message: string, options?: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  remove: (id: string) => void;
  clear: () => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  maxVisible?: number;
  position?: ToastPosition;
  offset?: number;
  gap?: number;
}

const variantStyles: Record<ToastVariant, { bg: string; color: string }> = {
  success: { bg: 'color-mix(in srgb, var(--ok) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--ok)' },
  error: { bg: 'color-mix(in srgb, var(--err) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--err)' },
  warning: { bg: 'color-mix(in srgb, var(--warn) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--warn)' },
  info: { bg: 'var(--go-bg, rgba(255,255,255,.72))', color: 'var(--t1)' },
};

const DEFAULT_DURATION = 2200;
const DEFAULT_MAX_VISIBLE = 3;

function createToastId() {
  return `vitro-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function useToastManager(maxVisible = DEFAULT_MAX_VISIBLE, enabled = true): UseToastResult {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    if (!enabled) return;
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer != null) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, [enabled]);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    if (!enabled) return '';
    const id = options.id ?? createToastId();
    const variant = options.variant ?? 'info';
    const duration = options.duration ?? DEFAULT_DURATION;

    setToasts((prev) => {
      const next = [...prev.filter((item) => item.id !== id), { id, message, variant, duration }];
      if (next.length <= maxVisible) return next;

      const overflow = next.slice(0, next.length - maxVisible);
      for (const item of overflow) {
        const timer = timers.current.get(item.id);
        if (timer != null) {
          window.clearTimeout(timer);
          timers.current.delete(item.id);
        }
      }
      return next.slice(-maxVisible);
    });

    const previous = timers.current.get(id);
    if (previous != null) window.clearTimeout(previous);

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);

    return id;
  }, [enabled, maxVisible]);

  const clear = useCallback(() => {
    if (!enabled) return;
    for (const timer of timers.current.values()) {
      window.clearTimeout(timer);
    }
    timers.current.clear();
    setToasts([]);
  }, [enabled]);

  useEffect(() => () => {
    if (!enabled) return;
    for (const timer of timers.current.values()) {
      window.clearTimeout(timer);
    }
    timers.current.clear();
  }, [enabled]);

  return useMemo<UseToastResult>(() => ({
    toasts,
    show,
    success: (message, options) => show(message, { ...options, variant: 'success' }),
    error: (message, options) => show(message, { ...options, variant: 'error' }),
    info: (message, options) => show(message, { ...options, variant: 'info' }),
    warning: (message, options) => show(message, { ...options, variant: 'warning' }),
    remove,
    clear,
  }), [clear, remove, show, toasts]);
}

function getViewportPositionStyle(
  position: ToastPosition,
  offset: number,
): React.CSSProperties {
  switch (position) {
    case 'top-left':
      return { top: offset, left: offset };
    case 'top-right':
      return { top: offset, right: offset };
    case 'bottom-left':
      return { bottom: offset, left: offset };
    case 'bottom-right':
    default:
      return { bottom: offset, right: offset };
  }
}

export function ToastViewport({
  toasts,
  onDismiss,
  position = 'bottom-right',
  offset = 20,
  gap = 10,
  bottom,
  right,
}: ToastViewportProps) {
  const legacyStyle = bottom != null || right != null
    ? {
      bottom: bottom ?? 20,
      right: right ?? 20,
    }
    : null;

  const placementStyle = legacyStyle ?? getViewportPositionStyle(position, offset);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 220,
        display: 'grid',
        gap,
        pointerEvents: 'none',
        maxWidth: 'min(420px, calc(100vw - 24px))',
        ...placementStyle,
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
              fontWeight: 200,
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

const ToastContext = createContext<UseToastResult | null>(null);

export function ToastProvider({
  children,
  maxVisible = DEFAULT_MAX_VISIBLE,
  position = 'bottom-right',
  offset = 20,
  gap = 10,
}: ToastProviderProps) {
  const toast = useToastManager(maxVisible);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport
        toasts={toast.toasts}
        onDismiss={toast.remove}
        position={position}
        offset={offset}
        gap={gap}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): UseToastResult {
  const context = useContext(ToastContext);
  const standalone = useToastManager(DEFAULT_MAX_VISIBLE, context == null);
  return context ?? standalone;
}
