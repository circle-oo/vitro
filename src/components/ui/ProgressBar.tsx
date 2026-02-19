import React from 'react';
import { useMotionMode } from '../../hooks/useMotionMode';

export interface ProgressBarProps {
  value: number;
  max?: number;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  animated = true,
  className,
}: ProgressBarProps) {
  const motionMode = useMotionMode();
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const clampedValue = Math.max(0, Math.min(safeMax, value));
  const percent = (clampedValue / safeMax) * 100;
  const motionEnabled = animated && motionMode !== 'off';
  const widthTransition = motionEnabled
    ? motionMode === 'lite'
      ? 'width .34s cubic-bezier(.22, 1, .36, 1)'
      : 'width .56s cubic-bezier(.22, 1, .36, 1)'
    : 'none';

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.round(clampedValue)}
      style={{
        height: '6px',
        borderRadius: '3px',
        overflow: 'hidden',
        background: 'var(--div)',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: '3px',
          background: motionMode === 'full'
            ? 'linear-gradient(90deg, var(--p500), var(--p400), var(--p500))'
            : 'linear-gradient(90deg, var(--p500), var(--p400))',
          backgroundSize: motionMode === 'full' ? '200% 100%' : undefined,
          boxShadow: '0 0 8px rgba(var(--gl), .25)',
          width: `${percent}%`,
          transition: widthTransition,
          animation: motionMode === 'full' && motionEnabled
            ? 'vitro-skeleton-shimmer 2.4s linear infinite'
            : undefined,
          willChange: motionEnabled ? 'width' : undefined,
        }}
      />
    </div>
  );
}
