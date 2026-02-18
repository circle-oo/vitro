import React from 'react';
import { GlassCard, StatCard, Timeline, VitroBarChart, VitroHeatmap, Badge, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { formatDateTime } from '../../../src/utils/format';

const frequencyData = [
  { week: 'W1', cooks: 2 },
  { week: 'W2', cooks: 3 },
  { week: 'W3', cooks: 4 },
  { week: 'W4', cooks: 5 },
  { week: 'W5', cooks: 3 },
  { week: 'W6', cooks: 6 },
];

const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const start = new Date('2026-01-01');
  for (let i = 0; i < 80; i++) {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    entries.push({ date: day.toISOString().slice(0, 10), value: (i * 7 + 3) % 5 });
  }
  return entries;
})();

interface SessionRow {
  id: string;
  time: string;
  titleKey: string;
  detailKey: string;
  dotColor?: string;
  dotGlow?: boolean;
}

const sessionRows: SessionRow[] = [
  { id: 'c1', time: '2026-02-17 19:12', titleKey: 'log.entry1.title', detailKey: 'log.entry1.detail' },
  { id: 'c2', time: '2026-02-16 18:40', titleKey: 'log.entry2.title', detailKey: 'log.entry2.detail', dotColor: 'var(--p300)' },
  { id: 'c3', time: '2026-02-15 20:05', titleKey: 'log.entry3.title', detailKey: 'log.entry3.detail', dotColor: 'var(--p200)', dotGlow: false },
  { id: 'c4', time: '2026-02-14 18:22', titleKey: 'log.entry4.title', detailKey: 'log.entry4.detail', dotColor: 'var(--p100)', dotGlow: false },
];

interface CookingLogPageProps {
  onDetail?: (id: string) => void;
}

export function CookingLogPage({ onDetail }: CookingLogPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };

  return (
    <>
      <PageHeader
        title={t('log.title')}
        subtitle={tr('도구/재료 컨텍스트를 포함한 구조화된 요리 세션 타임라인입니다.', 'Structured timeline of cooking sessions with tool and ingredient context.', 'Chronologie structurée des sessions de cuisine avec contexte d\u2019ustensiles et d\u2019ingrédients.', '道具・食材のコンテキストを含む構造化された調理セッションのタイムラインです。')}
        action={<Badge variant="info">{tr('오늘 업데이트', 'Updated today', 'Mis à jour aujourd\u2019hui', '本日更新')}</Badge>}
      />

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
          <div className="demo-card-title">{tr('요리 빈도', 'Cooking frequency', 'Fréquence de cuisine', '調理頻度')}</div>
          <VitroBarChart data={frequencyData} dataKey="cooks" xKey="week" height={220} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('세션 노트', 'Session notes', 'Notes de session', 'セッションノート')}</div>
          <Timeline
            entries={sessionRows.map((entry) => ({
              time: formatDateTime(entry.time, locale),
              title: (
                <button type="button" className="demo-link-btn" onClick={() => onDetail?.(entry.id)}>
                  <strong>{t(entry.titleKey)}</strong>
                </button>
              ),
              detail: t(entry.detailKey),
              dotColor: entry.dotColor,
              dotGlow: entry.dotGlow,
            }))}
          />
        </GlassCard>
      </div>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('활동 히트맵', 'Activity heatmap', 'Carte d\u2019activité', 'アクティビティヒートマップ')}</div>
          <VitroHeatmap data={heatmapData} summary={tr('80일, 요리 세션 27회', '80 days, 27 cooking sessions', '80 jours, 27 sessions de cuisine', '80日間、調理セッション27回')} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('최근 세션 빠른 이동', 'Quick session jump', 'Accès rapide', 'クイックアクセス')}</div>
          <div className="demo-list">
            {sessionRows.map((entry) => (
              <button
                type="button"
                key={entry.id}
                className="demo-list-row demo-list-row-btn"
                onClick={() => onDetail?.(entry.id)}
              >
                <span className="demo-list-label">{t(entry.titleKey)}</span>
                <span className="demo-list-value mono">{formatDateTime(entry.time, locale)}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('회고', 'Focused reflection', 'Réflexion', '振り返り')}</div>
        <p style={{ margin: 0, color: 'var(--t2)', fontSize: '13px', lineHeight: 1.7 }}>
          {tr(
            '이번 주는 프렙과 플레이팅 속도의 일관성이 높아졌습니다. 다음 단계는 주말마다 난도 높은 메뉴를 1개씩 배치해, 선택 피로를 늘리지 않으면서 기술 깊이를 확장하는 것입니다.',
            'This week shows stronger consistency in prep and plating speed. The next step is balancing repetition with one advanced dish every weekend to expand technique depth without adding decision fatigue.',
            'Cette semaine montre une meilleure régularité dans la préparation et la vitesse de dressage. La prochaine étape consiste à alterner répétition et un plat avancé chaque week-end pour approfondir la technique sans ajouter de fatigue décisionnelle.',
            '今週は下ごしらえと盛り付けスピードの安定感が向上しました。次のステップは、毎週末に高難度メニューを1品取り入れ、選択疲れを増やさずに技術の幅を広げることです。',
          )}
        </p>
      </GlassCard>
    </>
  );
}
