import React, { useMemo, useState } from 'react';
import {
  GlassCard,
  Badge,
  StatCard,
  DataTable,
  Timeline,
  JsonViewer,
  MarkdownViewer,
  LogViewer,
} from '@circle-oo/vitro';
import type { LogColumn, LogFilterOption } from '@circle-oo/vitro';
import { useLocale } from '../../i18n';
import { useTr } from '../../useTr';
import { formatTime } from '@circle-oo/vitro';
import { resolveLocalized } from '@circle-oo/vitro';
import { getLibraryNodeAnchorId } from './nodeAnchors';

interface Row {
  id: string;
  name: string;
  score: number;
  status: 'ok' | 'warn';
  [key: string]: unknown;
}

interface LogRow {
  ts: string;
  level: string;
  component: string;
  message: string;
  [key: string]: unknown;
}

const logLevels: LogFilterOption[] = [
  { value: 'DEBUG', label: 'DEBUG' },
  { value: 'INFO', label: 'INFO' },
  { value: 'WARN', label: 'WARN' },
  { value: 'ERROR', label: 'ERROR' },
];

const WEEKLY_NOTES = {
  ko: `## 주간 메모

- 라우트 매처 정교화
- 드릴다운 링크 추가
- 상세 뷰 컨텍스트 개선

| 지표 | 값 |
| --- | --- |
| 커버리지 | 100% |
| 경고 | 2 |
`,
  en: `## Weekly notes

- Refined route matcher
- Added drill-down links
- Improved detail view context

| Metric | Value |
| --- | --- |
| Coverage | 100% |
| Warnings | 2 |
`,
  fr: `## Notes hebdomadaires

- Matcher de route affiné
- Liens de drill-down ajoutés
- Contexte de la vue détaillée amélioré

| Indicateur | Valeur |
| --- | --- |
| Couverture | 100% |
| Alertes | 2 |
`,
  ja: `## 週間ノート

- ルートマッチャーを改善
- ドリルダウンリンクを追加
- 詳細ビューのコンテキストを改善

| 指標 | 値 |
| --- | --- |
| カバレッジ | 100% |
| 警告 | 2 |
`,
} as const;

const SESSION_JSON = {
  id: 'session-c1',
  links: ['r2', 't2', 'i1'],
  quality: { plating: 8.8, prep: 9.1, repeatability: 8.4 },
} as const;

export function DataSection() {
  const { locale } = useLocale();
  const tr = useTr();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const rows = useMemo<Row[]>(
    () => [
      { id: 'd1', name: tr('Pantry 파이프라인', 'Pantry pipeline', 'Pipeline Pantry', 'Pantryパイプライン'), score: 92, status: 'ok' },
      { id: 'd2', name: tr('레시피 동기화', 'Recipe sync', 'Synchronisation recettes', 'レシピ同期'), score: 78, status: 'warn' },
      { id: 'd3', name: tr('재고 매처', 'Inventory matcher', 'Matcher inventaire', '在庫マッチャー'), score: 87, status: 'ok' },
      { id: 'd4', name: tr('세션 집계기', 'Session aggregator', 'Agrégateur de session', 'セッション集約器'), score: 84, status: 'ok' },
      { id: 'd5', name: tr('로그 리텐션', 'Log retention', 'Rétention des logs', 'ログ保持'), score: 74, status: 'warn' },
      { id: 'd6', name: tr('알림 라우터', 'Alert router', 'Routeur d\'alertes', 'アラートルーター'), score: 89, status: 'ok' },
      { id: 'd7', name: tr('재고 예측기', 'Inventory forecaster', 'Prévision inventaire', '在庫予測器'), score: 81, status: 'ok' },
      { id: 'd8', name: tr('이벤트 싱크', 'Event sync', 'Sync des événements', 'イベント同期'), score: 76, status: 'warn' },
    ],
    [tr],
  );
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage],
  );

  const logs = useMemo<LogRow[]>(
    () => [
      { ts: formatTime('19:01:11', locale), level: 'INFO', component: 'router', message: tr('해시 라우트 동기화 완료', 'hash route synced', 'route hash synchronisée', 'ハッシュルート同期完了') },
      { ts: formatTime('19:01:34', locale), level: 'WARN', component: 'inventory', message: tr('재고 추정 오차 5% 초과', 'stock estimate drift > 5%', 'dérive estimée du stock > 5 %', '在庫推定誤差が5%超') },
      { ts: formatTime('19:02:00', locale), level: 'ERROR', component: 'chat', message: tr('도구 타임아웃, 재시도 예약', 'tool timeout retry scheduled', 'nouvelle tentative après timeout outil', 'ツールタイムアウト再試行を予約') },
      { ts: formatTime('19:02:14', locale), level: 'DEBUG', component: 'cache', message: tr('캐시 히트율 94%', 'cache hit ratio 94%', 'taux de hit cache 94 %', 'キャッシュヒット率94%') },
    ],
    [locale, tr],
  );

  const logColumns = useMemo<LogColumn<LogRow>[]>(
    () => [
      { key: 'ts', header: tr('시간', 'TIME', 'HEURE', '時間'), mono: true, width: '90px' },
      { key: 'level', header: tr('레벨', 'LEVEL', 'NIVEAU', 'レベル'), width: '90px' },
      { key: 'component', header: tr('컴포넌트', 'COMPONENT', 'COMPOSANT', 'コンポーネント'), mono: true, width: '120px' },
      { key: 'message', header: tr('메시지', 'MESSAGE', 'MESSAGE', 'メッセージ'), mono: true },
    ],
    [tr],
  );

  const timelineEntries = useMemo(
    () => [
      { time: formatTime('19:01', locale), title: tr('라우터 업데이트', 'Router update', 'Mise à jour du routeur', 'ルーター更新'), detail: tr('해시 내비게이션 리스너 재연결', 'Hash navigation listener reattached', 'Écouteur de navigation hash réattaché', 'ハッシュナビゲーションリスナー再接続') },
      { time: formatTime('19:03', locale), title: tr('재고 동기화', 'Inventory sync', 'Sync inventaire', '在庫同期'), detail: tr('부족 배지 재계산', 'Low stock badge recalculated', 'Badge stock bas recalculé', '在庫不足バッジ再計算'), dotColor: 'var(--warn)' },
      { time: formatTime('19:04', locale), title: tr('스냅샷 저장', 'Snapshot saved', 'Snapshot enregistré', 'スナップショット保存'), detail: tr('데모 상태 직렬화 완료', 'Demo state serialized', 'État de démo sérialisé', 'デモ状態をシリアライズ'), dotColor: 'var(--ok)' },
    ],
    [locale, tr],
  );

  const markdownContent = useMemo(
    () => resolveLocalized(WEEKLY_NOTES, locale),
    [locale],
  );

  const tableColumns = useMemo(
    () => [
      { key: 'name', header: tr('이름', 'Name', 'Nom', '名前') },
      { key: 'score', header: tr('점수', 'Score', 'Score', 'スコア') },
      {
        key: 'status',
        header: tr('상태', 'Status', 'Statut', '状態'),
        render: (row: Row) => (
          <Badge variant={row.status === 'ok' ? 'success' : 'warning'}>
            {row.status === 'ok' ? tr('정상', 'ok', 'ok', 'ok') : tr('주의', 'warn', 'alerte', '注意')}
          </Badge>
        ),
      },
    ],
    [tr],
  );

  return (
    <div className="demo-library-stack" id={getLibraryNodeAnchorId('data:overview')}>
      <div className="demo-library-head">
        <h3>{tr('데이터', 'Data', 'Données', 'データ')}</h3>
        <Badge variant="info">{tr('StatCard, DataTable, Timeline, JsonViewer, MarkdownViewer, LogViewer', 'StatCard, DataTable, Timeline, JsonViewer, MarkdownViewer, LogViewer', 'StatCard, DataTable, Timeline, JsonViewer, MarkdownViewer, LogViewer', 'StatCard, DataTable, Timeline, JsonViewer, MarkdownViewer, LogViewer')}</Badge>
      </div>

      <div className="r2">
        <GlassCard id={getLibraryNodeAnchorId('data:stat-card')} hover={false}>
          <StatCard label={tr('활성 파이프라인', 'Active pipelines', 'Pipelines actifs', 'アクティブパイプライン')} value={8} delta={tr('+2 이번 주', '+2 this week', '+2 cette semaine', '+2 今週')} deltaType="positive" />
        </GlassCard>
        <GlassCard hover={false}>
          <StatCard label={tr('경고 신호', 'Warn signals', 'Signaux d\'alerte', '警告シグナル')} value={2} valueColor="var(--warn)" />
        </GlassCard>
      </div>

      <GlassCard id={getLibraryNodeAnchorId('data:data-table')} hover={false}>
        <div className="demo-card-title">DataTable</div>
        <DataTable
          columns={tableColumns}
          data={pagedRows}
          rowKey={(row) => row.id}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          pagination={{
            page: safePage,
            totalPages,
            onChange: setPage,
          }}
        />
      </GlassCard>

      <div className="r2">
        <GlassCard id={getLibraryNodeAnchorId('data:timeline')} hover={false}>
          <div className="demo-card-title">{tr('타임라인', 'Timeline', 'Chronologie', 'タイムライン')}</div>
          <Timeline entries={timelineEntries} />
        </GlassCard>

        <GlassCard id={getLibraryNodeAnchorId('data:json-viewer')} hover={false}>
          <div className="demo-card-title">JsonViewer</div>
          <JsonViewer data={SESSION_JSON} />
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard id={getLibraryNodeAnchorId('data:markdown-viewer')} hover={false}>
          <div className="demo-card-title">MarkdownViewer</div>
          <MarkdownViewer content={markdownContent} />
        </GlassCard>

        <GlassCard id={getLibraryNodeAnchorId('data:log-viewer')} hover={false}>
          <div className="demo-card-title">LogViewer</div>
          <LogViewer
            title={tr('데모 로그', 'Demo logs', 'Journaux de démo', 'デモログ')}
            data={logs}
            columns={logColumns}
            levelField="level"
            levelOptions={logLevels}
            searchFields={['component', 'message']}
          />
        </GlassCard>
      </div>
    </div>
  );
}
