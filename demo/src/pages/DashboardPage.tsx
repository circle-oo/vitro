import React, { useMemo } from 'react';
import {
  GlassCard,
  StatCard,
  VitroSparkline,
  VitroHeatmap,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  VitroLineChart,
  Badge,
  Timeline,
  ProgressBar,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import type { NavigateRoute } from '../router';
import { formatDateTimeText } from '../dateTime';

interface DashboardPageProps {
  onNavigate?: (route: NavigateRoute) => void;
}

const trendLine = [
  { week: 'W1', output: 74, quality: 80 },
  { week: 'W2', output: 78, quality: 81 },
  { week: 'W3', output: 76, quality: 84 },
  { week: 'W4', output: 82, quality: 86 },
  { week: 'W5', output: 84, quality: 88 },
  { week: 'W6', output: 88, quality: 89 },
  { week: 'W7', output: 86, quality: 92 },
  { week: 'W8', output: 91, quality: 93 },
];

const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const start = new Date('2025-11-26');
  const values = [0, 1, 1, 2, 0, 3, 4, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0, 4, 2, 1, 3, 2, 0, 2, 4, 1, 3, 2, 1, 0, 3, 2, 4, 1, 0, 2, 3, 4, 1, 0, 2, 2, 3, 1, 0, 4, 2, 3, 1, 2, 0, 3, 4, 2, 1, 3, 0, 2, 4, 1, 2, 3, 1, 0, 2, 4, 3, 1, 2, 0, 1, 3, 4, 2, 1, 0, 2, 3, 4, 1, 0, 1, 2, 3];

  for (let i = 0; i < values.length; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: values[i] });
  }
  return entries;
})();

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };

  const requestMix = useMemo(
    () => [
      { name: tr('채팅', 'Chat', 'Chat', 'チャット'), value: 42 },
      { name: tr('도구', 'Tools', 'Outils', '道具'), value: 31 },
      { name: tr('재고', 'Inventory', 'Inventaire', '在庫'), value: 28 },
      { name: tr('레시피', 'Recipes', 'Recettes', 'レシピ'), value: 19 },
      { name: tr('운영', 'Ops', 'Opérations', '運用'), value: 15 },
    ],
    [locale],
  );
  const latencyByDay = [
    { day: tr('월', 'Mon', 'Lun', '月'), ms: 242 },
    { day: tr('화', 'Tue', 'Mar', '火'), ms: 236 },
    { day: tr('수', 'Wed', 'Mer', '水'), ms: 228 },
    { day: tr('목', 'Thu', 'Jeu', '木'), ms: 232 },
    { day: tr('금', 'Fri', 'Ven', '金'), ms: 219 },
    { day: tr('토', 'Sat', 'Sam', '土'), ms: 210 },
    { day: tr('일', 'Sun', 'Dim', '日'), ms: 216 },
  ];

  const timelineEntries = useMemo(
    () => [
      {
        time: formatDateTimeText('2026-02-17 19:18', locale),
        title: (
          <button type="button" className="demo-link-btn" onClick={() => onNavigate?.({ page: 'cooking-log', sub: 'detail', id: 'c1' })}>
            {tr('워크플로 패키지 배포', 'Workflow package shipped', 'Package workflow livré', 'ワークフローパッケージ配布')}
          </button>
        ),
        detail: tr(
          'Pantry와 Flux에 자동 라우팅 규칙 세트를 배포했습니다.',
          'Auto-routing rule set deployed to both Pantry and Flux.',
          'Jeu de règles de routage automatique déployé sur Pantry et Flux.',
          'PantryとFluxに自動ルーティングルールセットをデプロイしました。',
        ),
      },
      {
        time: formatDateTimeText('2026-02-17 16:02', locale),
        title: (
          <button type="button" className="demo-link-btn" onClick={() => onNavigate?.({ page: 'tools', sub: 'detail', id: 't2' })}>
            {tr('지연시간 목표 달성', 'Latency target reached', 'Objectif de latence atteint', 'レイテンシ目標達成')}
          </button>
        ),
        detail: tr(
          '읽기 중심 요청의 P95가 240ms 아래로 내려갔습니다.',
          'P95 fell under 240ms on read-heavy requests.',
          'Le P95 est passé sous 240 ms pour les requêtes en lecture.',
          '読み取り中心リクエストのP95が240ms以下に低下しました。',
        ),
        dotColor: 'var(--ok)',
      },
      {
        time: formatDateTimeText('2026-02-16 22:41', locale),
        title: (
          <button type="button" className="demo-link-btn" onClick={() => onNavigate?.({ page: 'settings' })}>
            {tr('메시 렌더링 패치', 'Mesh rendering patch', 'Correctif rendu mesh', 'メッシュレンダリングパッチ')}
          </button>
        ),
        detail: tr(
          '다크 모드 대비를 위한 그라디언트를 개선했습니다.',
          'Improved gradients for dark mode contrast.',
          'Dégradés améliorés pour le contraste en mode sombre.',
          'ダークモードのコントラスト用グラデーションを改善しました。',
        ),
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
    [locale, onNavigate],
  );

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('dash.title')}</h2>
          <p className="demo-page-subtitle">{tr(
            '디자인, 도구, AI 워크플로 전체 운영 상태를 요약합니다.',
            'Operational summary across design, tooling, and AI workflow surfaces.',
            'Résumé opérationnel du design, des outils et des workflows IA.',
            'デザイン、ツール、AIワークフロー全体の運用状況を要約します。',
          )}</p>
        </div>
        <Badge variant="info">{tr('실시간 스냅샷', 'Live snapshot', 'Instantané en direct', 'リアルタイムスナップショット')}</Badge>
      </div>

      <GlassCard className="demo-hero-card" hover={false}>
        <div className="demo-hero-gradient" />
        <div className="demo-hero-inner">
          <div>
            <h3 className="demo-hero-title">{tr(
              '이번 주 시스템 모멘텀이 18% 상승했습니다.',
              'System momentum is up 18% this week.',
              'Le momentum système est en hausse de 18 % cette semaine.',
              '今週のシステムモメンタムが18%上昇しました。',
            )}</h3>
            <p className="demo-hero-copy">
              {tr(
                '재구성된 Vitro 대시보드는 차트, 이벤트 컨텍스트, 상태 지표를 하나의 시각 리듬으로 통합합니다. 각 카드와 타임라인은 관련 페이지로 drill-down 됩니다.',
                'The rebuilt Vitro dashboard combines charts, event context, and status indicators in a single visual rhythm. Each card and timeline item drills down to a related page.',
                'Le tableau de bord Vitro repensé combine graphiques, contexte événementiel et indicateurs dans un rythme visuel unifié. Chaque carte renvoie à une page détaillée.',
                '再構成されたVitroダッシュボードは、チャート、イベントコンテキスト、ステータス指標を一つの視覚リズムに統合します。各カードとタイムラインは関連ページにドリルダウンできます。',
              )}
            </p>
            <div className="demo-tag-row">
              <Badge variant="primary">Pantry</Badge>
              <Badge variant="success">{tr('장애 없음', 'No incidents', 'Aucun incident', '障害なし')}</Badge>
              <Badge variant="warning">{tr(
                '작업 2건 만료 임박',
                '2 tasks due',
                '2 tâches à échéance',
                'タスク2件が期限間近',
              )}</Badge>
            </div>
          </div>

          <div className="demo-kpi-stack">
            <div className="demo-kpi-chip">
              <span>{tr('서비스 상태', 'Service health', 'État du service', 'サービス状態')}</span>
              <b>99.97%</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('P95 응답', 'P95 response', 'Réponse P95', 'P95レスポンス')}</span>
              <b>216ms</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('일일 커맨드', 'Commands/day', 'Commandes/jour', 'コマンド/日')}</span>
              <b>1,284</b>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="r4 mb">
        <GlassCard>
          <button type="button" className="demo-card-hit" onClick={() => onNavigate?.({ page: 'tools' })}>
            <StatCard label={t('dash.statTools')} value={28} delta={tr('+4 이번 분기', '+4 this quarter', '+4 ce trimestre', '+4 今四半期')} deltaType="positive">
              <VitroSparkline data={[14, 17, 20, 19, 22, 24, 28]} />
            </StatCard>
          </button>
        </GlassCard>

        <GlassCard>
          <button type="button" className="demo-card-hit" onClick={() => onNavigate?.({ page: 'sharpening' })}>
            <StatCard label={t('dash.statSharpDue')} value={2} valueColor="var(--warn)" delta={tr('UX10 + P-38', 'UX10 + P-38', 'UX10 + P-38', 'UX10 + P-38')} />
          </button>
        </GlassCard>

        <GlassCard>
          <button type="button" className="demo-card-hit" onClick={() => onNavigate?.({ page: 'cooking-log' })}>
            <StatCard label={tr('주간 요청 수', 'Weekly Requests', 'Requêtes hebdo.', '週間リクエスト数')} value="8.2k" delta="+12.4%" deltaType="positive">
              <VitroSparkline data={[55, 50, 62, 68, 64, 72, 88]} />
            </StatCard>
          </button>
        </GlassCard>

        <GlassCard>
          <button type="button" className="demo-card-hit" onClick={() => onNavigate?.({ page: 'settings' })}>
            <StatCard label={tr('에러 버짓', 'Error Budget', 'Budget erreurs', 'エラーバジェット')} value="93%" delta={tr('안정', 'Healthy', 'Sain', '安定')} deltaType="neutral" valueColor="var(--ok)" />
          </button>
        </GlassCard>
      </div>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('처리량 vs 품질', 'Throughput vs quality', 'Débit vs qualité', 'スループット vs 品質')}</div>
          <VitroLineChart
            data={trendLine}
            xKey="week"
            lines={[
              { dataKey: 'output', color: 'var(--p500)' },
              { dataKey: 'quality', color: 'var(--ok)' },
            ]}
            height={230}
          />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('활동 히트맵', 'Activity heatmap', "Carte d'activité", 'アクティビティヒートマップ')}</div>
          <VitroHeatmap data={heatmapData} summary={tr('84일, 활성 액션 238건', '84 days, 238 active actions', '84 jours, 238 actions actives', '84日間、アクティブアクション238件')} />
        </GlassCard>
      </div>

      <div className="ben mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('요청 비중과 지연시간', 'Request mix and latency', 'Répartition des requêtes et latence', 'リクエスト比率とレイテンシ')}</div>
          <div className="r2">
            <div>
              <VitroHBarChart data={requestMix} />
            </div>
            <div>
              <VitroBarChart data={latencyByDay} dataKey="ms" xKey="day" height={220} />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('릴리스 윈도우', 'Release windows', 'Fenêtres de livraison', 'リリースウィンドウ')}</div>
          <div className="demo-list">
            <div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('디자인 토큰 v3', 'Design tokens v3', 'Tokens design v3', 'デザイントークン v3')}</span>
                <span className="demo-list-value">72%</span>
              </div>
              <ProgressBar value={72} />
            </div>
            <div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('차트 래퍼', 'Chart wrappers', 'Wrappers graphiques', 'チャートラッパー')}</span>
                <span className="demo-list-value">56%</span>
              </div>
              <ProgressBar value={56} />
            </div>
            <div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('모바일 폴리시', 'Mobile polish', 'Finitions mobile', 'モバイルポリッシュ')}</span>
                <span className="demo-list-value">34%</span>
              </div>
              <ProgressBar value={34} />
            </div>
          </div>

          <div className="demo-card-title" style={{ marginTop: '18px' }}>{tr('최근 이벤트', 'Recent events', 'Événements récents', '最近のイベント')}</div>
          <Timeline entries={timelineEntries} />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('주간 수요 곡선', 'Weekly demand curve', 'Courbe de demande hebdo.', '週間需要カーブ')}</div>
        <VitroAreaChart
          data={[
            { day: tr('월', 'Mon', 'Lun', '月'), count: 220 },
            { day: tr('화', 'Tue', 'Mar', '火'), count: 280 },
            { day: tr('수', 'Wed', 'Mer', '水'), count: 260 },
            { day: tr('목', 'Thu', 'Jeu', '木'), count: 310 },
            { day: tr('금', 'Fri', 'Ven', '金'), count: 360 },
            { day: tr('토', 'Sat', 'Sam', '土'), count: 390 },
            { day: tr('일', 'Sun', 'Dim', '日'), count: 330 },
          ]}
          xKey="day"
          dataKey="count"
          height={220}
        />
      </GlassCard>
    </>
  );
}
