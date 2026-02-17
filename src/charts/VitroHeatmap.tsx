import React, { useState } from 'react';

interface VitroHeatmapProps {
  data: number[][];
  rowLabels: string[];
  colLabels: string[];
  maxLevel?: number;
  className?: string;
}

const opacityLevels = [
  [0.04, 0.15, 0.30, 0.50, 0.75], // light
  [0.05, 0.15, 0.28, 0.42, 0.65], // dark
];

export function VitroHeatmap({
  data,
  rowLabels,
  colLabels,
  maxLevel = 4,
  className,
}: VitroHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const getLevel = (v: number) => Math.min(maxLevel, Math.max(0, v));

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `36px repeat(${colLabels.length}, 1fr)`,
          gap: '3px',
          marginBottom: '4px',
        }}
      >
        <span />
        {colLabels.map((c) => (
          <span key={c} style={{ fontSize: '10px', color: 'var(--t4)', textAlign: 'center' }}>
            {c}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `36px repeat(${colLabels.length}, 1fr)`,
          gap: '3px',
        }}
      >
        {data.map((row, ri) => (
          <React.Fragment key={ri}>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--t4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '4px',
              }}
            >
              {rowLabels[ri]}
            </span>
            {row.map((val, ci) => {
              const level = getLevel(val);
              return (
                <div
                  key={ci}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'transform .1s',
                    background: `rgba(var(--gl), ${opacityLevels[0][level]})`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.25)';
                    (e.currentTarget as HTMLElement).style.zIndex = '1';
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      text: `${rowLabels[ri]} ${colLabels[ci]}: ${val}`,
                    });
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.zIndex = '';
                    setTooltip(null);
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '10px',
          fontSize: '11px',
          color: 'var(--t4)',
        }}
      >
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <i
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              display: 'block',
              background: `rgba(var(--gl), ${opacityLevels[0][i]})`,
            }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            zIndex: 999,
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: 'rgba(26,31,54,.88)',
            color: '#fff',
            left: tooltip.x + 12,
            top: tooltip.y - 32,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
