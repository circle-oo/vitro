import React from 'react';
import { GlassCard, StatCard, Badge } from '@circle-oo/vitro';

const scheduleData = [
  { name: '🔪 UX10 규토', last: '2026.02.01', cycle: '14일', status: 'due' as const, next: '2026.02.15 (3일 초과)' },
  { name: '🔪 P-38 사시미', last: '2026.02.09', cycle: '14일', status: 'due' as const, next: '2026.02.23' },
  { name: '🔪 P-01 셰프', last: '2026.02.12', cycle: '14일', status: 'ok' as const, next: '2026.02.26' },
  { name: '🔪 P-19 유틸리티', last: '2026.02.12', cycle: '21일', status: 'ok' as const, next: '2026.03.05' },
];

export function SharpeningPage() {
  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        연마 트래커
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard
            label="다음 연마 예정"
            value={2}
            valueColor="var(--warn)"
            delta="UX10 규토 (18일) · P-38 사시미 (8일)"
            deltaType="neutral"
          />
        </GlassCard>
        <GlassCard>
          <StatCard label="이번 달 연마 횟수" value={4} delta="▲ +1 vs 지난달" deltaType="positive" />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <span className="lbl">연마 스케줄</span>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {['도구', '마지막 연마', '주기', '상태', '다음 예정'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.5px',
                    color: 'var(--t3)',
                    borderBottom: '1px solid var(--div)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((row) => (
              <tr key={row.name}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>
                  {row.name}
                </td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.last}
                </td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.cycle}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  <Badge variant={row.status === 'due' ? 'warning' : 'success'}>
                    {row.status === 'due' ? '주기 도래' : '정상'}
                  </Badge>
                </td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.next}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
