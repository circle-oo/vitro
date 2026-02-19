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

const VARIANT_STYLES: Record<ToastVariant, { bg: string; color: string }> = {
  success: { bg: 'color-mix(in srgb, var(--ok) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--ok)' },
  error: { bg: 'color-mix(in srgb, var(--err) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--err)' },
  warning: { bg: 'color-mix(in srgb, var(--warn) 12%, var(--go-bg, rgba(255,255,255,.72)))', color: 'var(--warn)' },
  info: { bg: 'var(--go-bg, rgba(255,255,255,.72))', color: 'var(--t1)' },
};

const DEFAULT_DURATION = 2200;
const DEFAULT_MAX_VISIBLE = 3;

const VIEWPORT_BASE_STYLE: React.CSSProperties = {
  position: 'fixed',
  zIndex: 220,
  display: 'grid',
  pointerEvents: 'none',
  maxWidth: 'min(420px, calc(100vw - 24px))',
};

const TOAST_ITEM_BASE_STYLE: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '14px',
  fontSize: '13px',
  fontWeight: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  pointerEvents: 'auto',
  animation: 'fi .2s var(--ease)',
};

const TOAST_CLOSE_BUTTON_STYLE: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: 1,
  opacity: 0.65,
  padding: 0,
  minHeight: 'unset',
};

interface ToastRowProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastRow = React.memo(function ToastRow({ toast, onDismiss }: ToastRowProps) {
  const variant = VARIANT_STYLES[toast.variant];
  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      ...TOAST_ITEM_BASE_STYLE,
      color: variant.color,
      background: variant.bg,
    }),
    [variant.bg, variant.color],
  );

  const onDismissClick = useCallback(() => {
    onDismiss(toast.id);
  }, [onDismiss, toast.id]);

  return (
    <div
      className="go"
      role="status"
      style={rowStyle}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onDismissClick}
        aria-label="Dismiss notification"
        style={TOAST_CLOSE_BUTTON_STYLE}
      >
        {'\u00D7'}
      </button>
    </div>
  );
});

ToastRow.displayName = 'ToastRow';

function createToastId() {
  return `vitro-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function useToastManager(maxVisible = DEFAULT_MAX_VISIBLE, enabled = true): UseToastResult {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer == null) return;
    window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const clearAllTimers = useCallback(() => {
    for (const timer of timers.current.values()) {
      window.clearTimeout(timer);
    }
    timers.current.clear();
  }, []);

  const remove = useCallback((id: string) => {
    clearTimer(id);
    if (!enabled) return;
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, [clearTimer, enabled]);

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
        clearTimer(item.id);
      }
      return next.slice(-maxVisible);
    });

    clearTimer(id);

    const timer = window.setTimeout(() => {
      remove(id);
    }, duration);
    timers.current.set(id, timer);

    return id;
  }, [clearTimer, enabled, maxVisible, remove]);

  const clear = useCallback(() => {
    if (!enabled) return;
    clearAllTimers();
    setToasts([]);
  }, [clearAllTimers, enabled]);

  useEffect(() => () => {
    clearAllTimers();
  }, [clearAllTimers]);

  const success = useCallback<UseToastResult['success']>(
    (message, options) => show(message, { ...options, variant: 'success' }),
    [show],
  );
  const error = useCallback<UseToastResult['error']>(
    (message, options) => show(message, { ...options, variant: 'error' }),
    [show],
  );
  const info = useCallback<UseToastResult['info']>(
    (message, options) => show(message, { ...options, variant: 'info' }),
    [show],
  );
  const warning = useCallback<UseToastResult['warning']>(
    (message, options) => show(message, { ...options, variant: 'warning' }),
    [show],
  );

  return useMemo<UseToastResult>(() => ({
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove,
    clear,
  }), [clear, error, info, remove, show, success, toasts, warning]);
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
  const placementStyle = useMemo(
    () => (
      bottom != null || right != null
        ? { bottom: bottom ?? 20, right: right ?? 20 }
        : getViewportPositionStyle(position, offset)
    ),
    [bottom, offset, position, right],
  );

  const viewportStyle = useMemo<React.CSSProperties>(
    () => ({
      ...VIEWPORT_BASE_STYLE,
      gap,
      ...placementStyle,
    }),
    [gap, placementStyle],
  );

  return (
    <div
      style={viewportStyle}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
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
