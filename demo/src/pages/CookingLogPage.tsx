import React from 'react';
import { GlassCard, StatCard, Timeline } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

export function CookingLogPage() {
  const { t } = useLocale();

  const entries = [
    {
      time: t('log.entry1.time'),
      title: <span style={{ fontSize: '14px', fontWeight: 600 }}>{t('log.entry1.title')}</span>,
      detail: t('log.entry1.detail'),
    },
    {
      time: t('log.entry2.time'),
      title: <span style={{ fontSize: '14px', fontWeight: 600 }}>{t('log.entry2.title')}</span>,
      detail: t('log.entry2.detail'),
      dotColor: 'var(--p300)',
    },
    {
      time: t('log.entry3.time'),
      title: <span style={{ fontSize: '14px', fontWeight: 600 }}>{t('log.entry3.title')}</span>,
      detail: t('log.entry3.detail'),
      dotColor: 'var(--p200)',
      dotGlow: false,
    },
    {
      time: t('log.entry4.time'),
      title: <span style={{ fontSize: '14px', fontWeight: 600 }}>{t('log.entry4.title')}</span>,
      detail: t('log.entry4.detail'),
      dotColor: 'var(--p100)',
      dotGlow: false,
    },
  ];

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('log.title')}
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard label={t('log.statMonth')} value={12} delta={t('log.statMonthDelta')} deltaType="positive" />
        </GlassCard>
        <GlassCard>
          <StatCard label={t('log.statTopCuisine')} value={t('log.statTopCuisineVal')}>
            <span style={{ fontSize: '14px', color: 'var(--t3)' }}>{t('log.statTopCuisineCount')}</span>
          </StatCard>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <span className="lbl">{t('log.timeline')}</span>
        <Timeline entries={entries} />
      </GlassCard>
    </>
  );
}
