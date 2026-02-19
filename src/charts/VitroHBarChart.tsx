import React from 'react';
import { useMotionMode } from '../hooks/useMotionMode';

export interface HBarItem {
  name: string;
  value: number;
}

export interface VitroHBarChartProps {
  data: HBarItem[];
  className?: string;
  animated?: boolean;
}

export function VitroHBarChart({
  data,
  className,
  animated = true,
}: VitroHBarChartProps) {
  const motionMode = useMotionMode();
  const allowMotion = animated && motionMode !== 'off';
  const enterDuration = motionMode === 'lite' ? '.2s' : '.28s';
  const growDuration = motionMode === 'lite' ? '.34s' : '.45s';
  const widthDuration = motionMode === 'lite' ? '.42s' : '.6s';
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const max = sorted[0]?.value ?? 1;

  return (
    <div className={className}>
      {sorted.map((item, index) => (
        <div
          key={item.name}
          style={{
            marginBottom: '12px',
            animation: allowMotion ? `fi ${enterDuration} var(--ease) both` : undefined,
            animationDelay: allowMotion ? `${Math.min(index * 34, 220)}ms` : undefined,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--t2)' }}>{item.name}</span>
            <span style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 300 }}>
              {item.value}
            </span>
          </div>
          <div
            style={{
              height: '22px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'rgba(var(--gl), .06)',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, var(--p400), var(--p500))',
                width: `${(item.value / max) * 100}%`,
                transition: motionMode === 'off'
                  ? 'background .16s ease'
                  : `width ${widthDuration} cubic-bezier(.22, 1, .36, 1), background .16s ease`,
                transformOrigin: 'left center',
                animation: allowMotion ? `vitro-grow-x ${growDuration} var(--ease) both` : undefined,
                animationDelay: allowMotion ? `${Math.min(index * 34 + 40, 260)}ms` : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
