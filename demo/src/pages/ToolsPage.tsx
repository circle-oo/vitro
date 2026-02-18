import React, { useMemo, useState } from 'react';
import {
  GlassCard,
  DataTable,
  Badge,
  Button,
  FilterChips,
  Input,
  Timeline,
  ProgressBar,
  PageHeader,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { useTr } from '../useTr';
import { formatDateText } from '@circle-oo/vitro';
import { resolveLocalized } from '@circle-oo/vitro';
import { toolRows } from '../data/tools';
import type { ToolRow } from '../data/tools';

interface ToolsPageProps {
  onDetail?: (id: string) => void;
}

const TOTAL_TOOL_COUNT = toolRows.length;
const ATTENTION_TOOL_COUNT = toolRows.filter((tool) => tool.condition === 'attention').length;
const HEALTH_PCT = Math.round(
  (toolRows.filter((tool) => tool.condition === 'excellent' || tool.condition === 'good').length / TOTAL_TOOL_COUNT) * 100,
);

export function ToolsPage({ onDetail }: ToolsPageProps) {
  const { t, locale } = useLocale();
  const tr = useTr();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'knife' | 'pot' | 'small' | 'attention'>('all');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filterOptions = useMemo(
    () => [
      { id: 'all' as const, label: tr('전체', 'All', 'Tous', 'すべて') },
      { id: 'knife' as const, label: tr('칼', 'Knives', 'Couteaux', '包丁') },
      { id: 'pot' as const, label: tr('냄비/팬', 'Pots', 'Casseroles', '鍋/フライパン') },
      { id: 'small' as const, label: tr('소도구', 'Small Tools', 'Petits outils', '小道具') },
      { id: 'attention' as const, label: tr('주의 필요', 'Needs Attention', 'Attention requise', '要注意') },
    ],
    [tr],
  );

  const indexedToolRows = useMemo(
    () =>
      toolRows.map((row) => ({
        row,
        searchText: [
          row.name.ko,
          row.name.en,
          row.name.fr ?? '',
          row.name.ja ?? '',
          row.owner.ko,
          row.owner.en,
          row.owner.fr ?? '',
          row.owner.ja ?? '',
        ].join(' ').toLowerCase(),
      })),
    [],
  );

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const rows: ToolRow[] = [];

    for (const { row, searchText } of indexedToolRows) {
      if (selectedFilter === 'knife' && row.category !== 'knife') continue;
      if (selectedFilter === 'pot' && row.category !== 'pot') continue;
      if (selectedFilter === 'small' && row.category !== 'small') continue;
      if (selectedFilter === 'attention' && row.condition !== 'attention') continue;

      if (!normalized || searchText.includes(normalized)) {
        rows.push(row);
      }
    }

    return rows;
  }, [indexedToolRows, search, selectedFilter]);

  const maintenanceEntries = useMemo(
    () => [
      {
        time: formatDateText('2026-02-18', locale),
        title: tr('UX10 엣지 리프레시', 'UX10 edge refresh', 'Rafraîchissement du fil UX10', 'UX10 エッジリフレッシュ'),
        detail: tr('3000 -> 6000 -> 가죽 스트롭', '3000 -> 6000 -> leather strop', '3000 -> 6000 -> cuir à affûter', '3000→6000→革ストロップ'),
      },
      {
        time: formatDateText('2026-02-19', locale),
        title: tr('보닝 나이프 정렬', 'Boning knife realign', 'Réalignement du couteau à désosser', 'ボーニングナイフ調整'),
        detail: tr('미세 칩핑 검사 및 각도 보정', 'Micro-chipping check and angle correction', 'Vérification des micro-éclats et correction d\'angle', 'マイクロチッピング検査と角度補正'),
        dotColor: 'var(--warn)',
      },
      {
        time: formatDateText('2026-02-23', locale),
        title: tr('P-38 사시미 스트롭', 'P-38 sashimi strop', 'Cuirage P-38 sashimi', 'P-38 刺身ストロップ'),
        detail: tr('주말 조리 전 라이트 터치업', 'Light touch-up before weekend prep', 'Retouche légère avant le week-end', '週末調理前のライトタッチアップ'),
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
    [locale, tr],
  );
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: t('tools.colName'),
        render: (row: ToolRow) => (
          <div>
            <div style={{ fontWeight: 600 }}>{resolveLocalized(row.name, locale)}</div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--t4)' }}>
              {tr('담당', 'Owner', 'Responsable', '担当')}: {resolveLocalized(row.owner, locale)}
            </div>
          </div>
        ),
      },
      {
        key: 'category',
        header: t('tools.colCategory'),
        render: (row: ToolRow) => {
          if (row.category === 'knife') return <Badge variant="danger">{tr('칼', 'Knife', 'Couteau', '包丁')}</Badge>;
          if (row.category === 'pot') return <Badge variant="info">{tr('냄비/팬', 'Pot/Pan', 'Casserole', '鍋/フライパン')}</Badge>;
          return <Badge variant="success">{tr('소도구', 'Small Tool', 'Petit outil', '小道具')}</Badge>;
        },
      },
      {
        key: 'condition',
        header: t('tools.colStatus'),
        render: (row: ToolRow) => {
          if (row.condition === 'excellent') return <Badge variant="success">{tr('매우 좋음', 'Excellent', 'Excellent', '非常に良好')}</Badge>;
          if (row.condition === 'good') return <Badge variant="info">{tr('양호', 'Good', 'Bon', '良好')}</Badge>;
          return <Badge variant="warning">{tr('주의', 'Attention', 'Attention', '注意')}</Badge>;
        },
      },
      {
        key: 'edgeDue',
        header: t('tools.colSharp'),
        render: (row: ToolRow) => (
          <span className="mono" style={{ color: row.edgeDue === '-' ? 'var(--t4)' : 'var(--t2)' }}>
            {formatDateText(row.edgeDue, locale)}
          </span>
        ),
      },
      {
        key: 'lastUsed',
        header: tr('최근 사용', 'Last used', 'Dernière utilisation', '最終使用'),
        render: (row: ToolRow) => <span className="mono">{formatDateText(row.lastUsed, locale)}</span>,
      },
      {
        key: 'action',
        header: '',
        sortable: false,
        render: (row: ToolRow) => (
          <button
            className="demo-table-action"
            onClick={(event) => {
              event.stopPropagation();
              onDetail?.(row.id);
            }}
            aria-label={tr('상세 보기 열기', 'Open detail', 'Ouvrir le détail', '詳細を開く')}
          >
            {'>'}
          </button>
        ),
      },
    ],
    [locale, onDetail, t, tr],
  );

  return (
    <>
      <PageHeader
        title={t('tools.title')}
        subtitle={tr('모든 도구의 연마 주기, 상태, 소유 구성을 추적합니다.', 'Track edge cycles, condition state, and ownership across every instrument.', 'Suivez les cycles d\'affûtage, l\'état et la répartition de chaque outil.', 'すべての道具の研ぎ周期、状態、所有構成を追跡します。')}
        action={<Badge variant="primary">{tr(`${filtered.length}개 항목`, `${filtered.length} items`, `${filtered.length} éléments`, `${filtered.length}件`)}</Badge>}
      />

      <div className="ben">
        <GlassCard hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <FilterChips
              options={filterOptions}
              value={selectedFilter}
              onChange={(id) => {
                setSelectedFilter(id as typeof selectedFilter);
              }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('tools.search')}
                style={{ width: '220px' }}
              />
              <Button variant="primary" size="sm">{t('tools.add')}</Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            rowKey={(row) => row.id}
            selectable
            selectedKeys={selectedRows}
            onSelectionChange={setSelectedRows}
            onRowClick={(row) => onDetail?.(row.id)}
          />
        </GlassCard>

        <div style={{ display: 'grid', gap: '14px' }}>
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('도구 상태 요약', 'Fleet health', 'État du parc', '道具状態サマリー')}</div>
            <div className="demo-metric-grid">
              <div className="demo-metric-item">
                <span>{tr('총계', 'Total', 'Total', '合計')}</span>
                <strong>{TOTAL_TOOL_COUNT}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('주의', 'Attention', 'Attention', '注意')}</span>
                <strong>{ATTENTION_TOOL_COUNT}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('선택됨', 'Selected', 'Sélectionnés', '選択中')}</span>
                <strong>{selectedRows.size}</strong>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('전체 준비도', 'Overall readiness', 'Disponibilité globale', '全体準備度')}</span>
                <span className="demo-list-value">{HEALTH_PCT}%</span>
              </div>
              <ProgressBar value={HEALTH_PCT} />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('예정된 정비', 'Upcoming maintenance', 'Entretien à venir', '予定メンテナンス')}</div>
            <Timeline entries={maintenanceEntries} />
          </GlassCard>
        </div>
      </div>
    </>
  );
}
