import React from 'react';
import {
  GlassCard,
  StatCard,
  VitroSparkline,
  VitroHeatmap,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  Badge,
  ProgressBar,
  Timeline,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';

// Stable heatmap data — generate 60 days of cooking activity
const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const values = [0, 0, 1, 2, 0, 3, 1, 0, 2, 4, 1, 0, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 3, 1, 4, 2, 0, 1, 3, 2, 4, 0, 1, 3, 2, 0, 1, 2, 3, 4, 1, 0, 2, 3, 1, 4, 2, 0, 3, 1, 2, 4, 3, 0, 1, 2, 3, 0, 4];
  const start = new Date('2025-12-20');
  for (let i = 0; i < 60; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: values[i] });
  }
  return entries;
})();

const weeklyData = [
  { week: 'W1', count: 2 },
  { week: 'W2', count: 4 },
  { week: 'W3', count: 3 },
  { week: 'W4', count: 6 },
  { week: 'W5', count: 5 },
  { week: 'W6', count: 3 },
  { week: 'W7', count: 7 },
  { week: 'W8', count: 5 },
  { week: 'W9', count: 4 },
  { week: 'W10', count: 6 },
  { week: 'W11', count: 3 },
  { week: 'W12', count: 8 },
];

const dailyUsageData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  usage: [3, 5, 2, 7, 4, 6, 1, 5, 3, 8, 2, 4, 6, 3, 7, 5, 2, 4, 6, 8, 3, 5, 7, 2, 4, 6, 3, 5, 7, 4][i],
}));

export function DashboardPage() {
  const { t } = useLocale();

  const hbarData = [
    { name: t('dash.hbar.italian'), value: 12 },
    { name: t('dash.hbar.korean'), value: 10 },
    { name: t('dash.hbar.french'), value: 7 },
    { name: t('dash.hbar.japanese'), value: 6 },
    { name: t('dash.hbar.other'), value: 2 },
  ];

  const timelineEntries = [
    {
      time: t('dash.tl.time1'),
      title: (
        <>
          {t('dash.tl.dish1')}{' '}
          <Badge variant="primary" size="sm">{t('dash.tl.tag1')}</Badge>
        </>
      ),
    },
    {
      time: t('dash.tl.time2'),
      title: (
        <>
          {t('dash.tl.dish2')}{' '}
          <Badge variant="danger" size="sm">{t('dash.tl.tag2')}</Badge>
        </>
      ),
      dotColor: 'var(--p300)',
    },
    {
      time: t('dash.tl.time3'),
      title: (
        <>
          {t('dash.tl.dish3')}{' '}
          <Badge variant="info" size="sm">{t('dash.tl.tag3')}</Badge>
        </>
      ),
      dotColor: 'var(--p200)',
      dotGlow: false,
    },
  ];

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('dash.title')}
      </div>

      {/* Stat Cards */}
      <div className="r4 mb">
        <GlassCard>
          <StatCard label={t('dash.statTools')} value={15} delta={t('dash.statToolsDelta')} deltaType="positive">
            <VitroSparkline data={[40, 55, 45, 60, 50, 75, 100]} />
          </StatCard>
        </GlassCard>
        <GlassCard>
          <StatCard label={t('dash.statSharpDue')} value={2} valueColor="var(--warn)" delta="UX10 규토 · P-38" deltaType="neutral" />
        </GlassCard>
        <GlassCard>
          <StatCard label={t('dash.statCooking')} value={5} delta={t('dash.statCookingDelta')} deltaType="positive">
            <VitroSparkline data={[60, 80, 50, 70, 90, 65, 85]} />
          </StatCard>
        </GlassCard>
        <GlassCard>
          <StatCard label={t('dash.statAlerts')} value={3} valueColor="var(--err)" delta={t('dash.statAlertsDelta')} deltaType="negative" />
        </GlassCard>
      </div>

      {/* Heatmap + Area Chart */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.heatmapLabel')}</span>
          <VitroHeatmap data={heatmapData} summary={t('dash.heatmapSummary')} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.weeklyFreq')}</span>
          <div style={{ marginTop: '8px' }}>
            <VitroAreaChart data={weeklyData} dataKey="count" xKey="week" height={200} />
          </div>
        </GlassCard>
      </div>

      {/* HBar + VBar */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.cuisineCount')}</span>
          <VitroHBarChart data={hbarData} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.toolUsage')}</span>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            {[
              { label: t('dash.miniTotal'), value: '87' },
              { label: t('dash.miniAvg'), value: '2.9' },
              { label: t('dash.miniTop'), value: t('dash.miniTopVal') },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: 'rgba(var(--gl), .04)',
                  border: '1px solid rgba(var(--gl), .06)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <VitroBarChart data={dailyUsageData} dataKey="usage" xKey="day" height={130} />
        </GlassCard>
      </div>

      {/* Timeline + Purchase Rounds */}
      <div className="ben mb">
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.recentCooks')}</span>
          <Timeline entries={timelineEntries} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">{t('dash.purchaseRound')}</span>
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>{t('dash.round1')}</span>
              <Badge variant="primary">{t('dash.inProgress')}</Badge>
            </div>
            <ProgressBar value={40} />
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px' }}>{t('dash.round1Detail')}</div>
          </div>
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>{t('dash.round2')}</span>
              <span style={{ fontSize: '11px', color: 'var(--t4)' }}>{t('dash.waiting')}</span>
            </div>
            <ProgressBar value={0} />
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px' }}>{t('dash.round2Detail')}</div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
