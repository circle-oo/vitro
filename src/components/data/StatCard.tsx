import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionMode } from '../../hooks/useMotionMode';

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  valueColor?: string;
  children?: React.ReactNode; // sparkline slot
}

const DELTA_COLORS = {
  positive: 'var(--ok)',
  negative: 'var(--err)',
  neutral: 'var(--t3)',
} as const;

const VALUE_STYLE: React.CSSProperties = {
  fontSize: '38px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
  marginBottom: '8px',
};

const DELTA_STYLE: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 200,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

function fractionDigits(value: number): number {
  const text = String(value);
  const point = text.indexOf('.');
  if (point < 0) return 0;
  return Math.min(3, text.length - point - 1);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  valueColor,
  children,
}: StatCardProps) {
  const motionMode = useMotionMode();
  const shouldAnimateNumeric = typeof value === 'number' && motionMode !== 'off';
  const decimals = useMemo(
    () => (typeof value === 'number' ? fractionDigits(value) : 0),
    [value],
  );
  const [displayValue, setDisplayValue] = useState<number>(
    typeof value === 'number' ? value : 0,
  );
  const previousValueRef = useRef<number>(typeof value === 'number' ? value : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (typeof value !== 'number') return;

    if (!shouldAnimateNumeric) {
      previousValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const from = previousValueRef.current;
    const to = value;
    if (from === to) return;

    const durationMs = motionMode === 'lite' ? 280 : 560;
    const startedAt = performance.now();

    const step = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      const next = from + (to - from) * eased;
      setDisplayValue(next);

      if (progress >= 1) {
        previousValueRef.current = to;
        rafRef.current = null;
        return;
      }

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [motionMode, shouldAnimateNumeric, value]);

  const renderedValue = useMemo(() => {
    if (typeof value !== 'number') return value;
    const target = shouldAnimateNumeric ? displayValue : value;
    return decimals > 0 ? target.toFixed(decimals) : String(Math.round(target));
  }, [decimals, displayValue, shouldAnimateNumeric, value]);

  return (
    <>
      <span className="lbl">{label}</span>
      <div style={{ ...VALUE_STYLE, color: valueColor }}>
        {renderedValue}
      </div>
      {delta && (
        <div style={{ ...DELTA_STYLE, color: DELTA_COLORS[deltaType] }}>
          {delta}
        </div>
      )}
      {children}
    </>
  );
}
