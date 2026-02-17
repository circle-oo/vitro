import React from 'react';
import { GlassCard, StatCard, Timeline, VitroBarChart, Badge } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

const frequencyData = [
  { week: 'W1', cooks: 2 },
  { week: 'W2', cooks: 3 },
  { week: 'W3', cooks: 4 },
  { week: 'W4', cooks: 5 },
  { week: 'W5', cooks: 3 },
  { week: 'W6', cooks: 6 },
];

export function CookingLogPage() {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('log.title')}</h2>
          <p className="demo-page-subtitle">{tr('도구/재료 컨텍스트를 포함한 구조화된 요리 세션 타임라인입니다.', 'Structured timeline of cooking sessions with tool and ingredient context.')}</p>
        </div>
        <Badge variant="info">{tr('오늘 업데이트', 'Updated today')}</Badge>
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard label={t('log.statMonth')} value={14} delta={t('log.statMonthDelta')} deltaType="positive" />
        </GlassCard>
        <GlassCard>
          <StatCard label={t('log.statTopCuisine')} value={t('log.statTopCuisineVal')}>
            <span style={{ fontSize: '13px', color: 'var(--t3)' }}>{t('log.statTopCuisineCount')}</span>
          </StatCard>
        </GlassCard>
      </div>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('요리 빈도', 'Cooking frequency')}</div>
          <VitroBarChart data={frequencyData} dataKey="cooks" xKey="week" height={220} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('세션 노트', 'Session notes')}</div>
          <Timeline
            entries={[
              {
                time: '2026-02-17 19:12',
                title: <strong>{t('log.entry1.title')}</strong>,
                detail: t('log.entry1.detail'),
              },
              {
                time: '2026-02-16 18:40',
                title: <strong>{t('log.entry2.title')}</strong>,
                detail: t('log.entry2.detail'),
                dotColor: 'var(--p300)',
              },
              {
                time: '2026-02-15 20:05',
                title: <strong>{t('log.entry3.title')}</strong>,
                detail: t('log.entry3.detail'),
                dotColor: 'var(--p200)',
                dotGlow: false,
              },
              {
                time: '2026-02-14 18:22',
                title: <strong>{t('log.entry4.title')}</strong>,
                detail: t('log.entry4.detail'),
                dotColor: 'var(--p100)',
                dotGlow: false,
              },
            ]}
          />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('회고', 'Focused reflection')}</div>
        <p style={{ margin: 0, color: 'var(--t2)', fontSize: '13px', lineHeight: 1.7 }}>
          {tr(
            '이번 주는 프렙과 플레이팅 속도의 일관성이 높아졌습니다. 다음 단계는 주말마다 난도 높은 메뉴를 1개씩 배치해, 선택 피로를 늘리지 않으면서 기술 깊이를 확장하는 것입니다.',
            'This week shows stronger consistency in prep and plating speed. The next step is balancing repetition with one advanced dish every weekend to expand technique depth without adding decision fatigue.',
          )}
        </p>
      </GlassCard>
    </>
  );
}
