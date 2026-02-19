import React, { useMemo } from 'react';
import { useMotionMode } from '../hooks/useMotionMode';

export interface VitroSparklineProps {
  data: number[];
  height?: number;
  className?: string;
  animated?: boolean;
}

export function VitroSparkline({
  data,
  height = 36,
  className,
  animated = true,
}: VitroSparklineProps) {
  const motionMode = useMotionMode();
  const allowMotion = animated && motionMode !== 'off';
  const enterDuration = motionMode === 'lite' ? '.2s' : '.28s';
  const heightDuration = motionMode === 'lite' ? '.24s' : '.32s';
  const normalized = useMemo(() => {
    if (data.length === 0) return [] as number[];
    const max = data.reduce((acc, value) => Math.max(acc, value, 0), 1);
    return data.map((value) => {
      const safeValue = Math.max(0, value);
      return (safeValue / max) * 100;
    });
  }, [data]);

  return (
    <div
      className={className}
      style={{
        marginTop: '14px',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '3px',
      }}
    >
      {normalized.map((percent, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: '4px 4px 0 0',
            minHeight: '4px',
            height: `${percent}%`,
            background: i === normalized.length - 1 ? 'var(--p500)' : 'rgba(var(--gl), .16)',
            transformOrigin: 'center bottom',
            animation: allowMotion ? `fi ${enterDuration} var(--ease) both` : undefined,
            animationDelay: allowMotion ? `${Math.min(i * 26, 220)}ms` : undefined,
            transition: motionMode === 'off'
              ? 'background .18s ease'
              : `height ${heightDuration} var(--ease), background .18s ease`,
          }}
        />
      ))}
    </div>
  );
}
