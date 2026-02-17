import React from 'react';
import { GlassCard, StatCard, Badge } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

export function SharpeningPage() {
  const { t } = useLocale();

  const scheduleData = [
    { nameKey: 'sharp.tool1', last: '2026.02.01', cycleKey: 'sharp.cycle14', status: 'due' as const, next: t('sharp.next1') },
    { nameKey: 'sharp.tool2', last: '2026.02.09', cycleKey: 'sharp.cycle14', status: 'due' as const, next: '2026.02.23' },
    { nameKey: 'sharp.tool3', last: '2026.02.12', cycleKey: 'sharp.cycle14', status: 'ok' as const, next: '2026.02.26' },
    { nameKey: 'sharp.tool4', last: '2026.02.12', cycleKey: 'sharp.cycle21', status: 'ok' as const, next: '2026.03.05' },
  ];

  const headers = [
    t('sharp.colTool'),
    t('sharp.colLast'),
    t('sharp.colCycle'),
    t('sharp.colStatus'),
    t('sharp.colNext'),
  ];

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('sharp.title')}
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard
            label={t('sharp.nextDue')}
            value={2}
            valueColor="var(--warn)"
            delta={t('sharp.nextDueDelta')}
            deltaType="neutral"
          />
        </GlassCard>
        <GlassCard>
          <StatCard label={t('sharp.monthCount')} value={4} delta={t('sharp.monthDelta')} deltaType="positive" />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <span className="lbl">{t('sharp.schedule')}</span>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {headers.map((h) => (
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
              <tr key={row.nameKey}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>
                  {t(row.nameKey)}
                </td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.last}
                </td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {t(row.cycleKey)}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  <Badge variant={row.status === 'due' ? 'warning' : 'success'}>
                    {row.status === 'due' ? t('sharp.statusDue') : t('sharp.statusOk')}
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
