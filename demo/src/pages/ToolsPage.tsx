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
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface LocalizedText {
  ko: string;
  en: string;
}

interface ToolRow {
  id: string;
  icon: string;
  name: LocalizedText;
  category: 'knife' | 'pot' | 'small';
  condition: 'excellent' | 'good' | 'attention';
  edgeDue: string;
  owner: LocalizedText;
  lastUsed: string;
  [key: string]: unknown;
}

const toolRows: ToolRow[] = [
  { id: 't1', icon: 'K', name: { ko: '미소노 UX10 규토 210', en: 'Misono UX10 Gyuto 210' }, category: 'knife', condition: 'attention', edgeDue: '2026-02-18', owner: { ko: '메인', en: 'Main' }, lastUsed: '2026-02-16' },
  { id: 't2', icon: 'K', name: { ko: '크로마 P-38 사시미 250', en: 'Chroma P-38 Sashimi 250' }, category: 'knife', condition: 'good', edgeDue: '2026-02-23', owner: { ko: '메인', en: 'Main' }, lastUsed: '2026-02-17' },
  { id: 't3', icon: 'K', name: { ko: '크로마 P-19 유틸리티', en: 'Chroma P-19 Utility' }, category: 'knife', condition: 'excellent', edgeDue: '2026-03-02', owner: { ko: '프렙', en: 'Prep' }, lastUsed: '2026-02-15' },
  { id: 't4', icon: 'P', name: { ko: '스타우브 코코트 22cm', en: 'Staub Cocotte 22cm' }, category: 'pot', condition: 'excellent', edgeDue: '-', owner: { ko: '열원', en: 'Heat' }, lastUsed: '2026-02-17' },
  { id: 't5', icon: 'P', name: { ko: '피스카스 소스팬 16cm', en: 'Fiskars Saucepan 16cm' }, category: 'pot', condition: 'good', edgeDue: '-', owner: { ko: '열원', en: 'Heat' }, lastUsed: '2026-02-14' },
  { id: 't6', icon: 'T', name: { ko: '디지털 프로브 온도계', en: 'Digital Probe Thermometer' }, category: 'small', condition: 'good', edgeDue: '-', owner: { ko: '도구', en: 'Tools' }, lastUsed: '2026-02-17' },
  { id: 't7', icon: 'T', name: { ko: '스케일 프로 미니', en: 'Scale Pro Mini' }, category: 'small', condition: 'excellent', edgeDue: '-', owner: { ko: '도구', en: 'Tools' }, lastUsed: '2026-02-13' },
  { id: 't8', icon: 'K', name: { ko: '빅토리녹스 보닝 150', en: 'Victorinox Boning 150' }, category: 'knife', condition: 'attention', edgeDue: '2026-02-19', owner: { ko: '백업', en: 'Backup' }, lastUsed: '2026-02-09' },
];

interface ToolsPageProps {
  onDetail?: () => void;
}

export function ToolsPage({ onDetail }: ToolsPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'knife' | 'pot' | 'small' | 'attention'>('all');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filterOptions = [
    { id: 'all' as const, label: tr('전체', 'All') },
    { id: 'knife' as const, label: tr('칼', 'Knives') },
    { id: 'pot' as const, label: tr('냄비/팬', 'Pots') },
    { id: 'small' as const, label: tr('소도구', 'Small Tools') },
    { id: 'attention' as const, label: tr('주의 필요', 'Needs Attention') },
  ];

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return toolRows.filter((row) => {
      if (selectedFilter === 'knife' && row.category !== 'knife') return false;
      if (selectedFilter === 'pot' && row.category !== 'pot') return false;
      if (selectedFilter === 'small' && row.category !== 'small') return false;
      if (selectedFilter === 'attention' && row.condition !== 'attention') return false;

      return !normalized
        || row.name.ko.toLowerCase().includes(normalized)
        || row.name.en.toLowerCase().includes(normalized)
        || row.owner.ko.toLowerCase().includes(normalized)
        || row.owner.en.toLowerCase().includes(normalized);
    });
  }, [search, selectedFilter]);

  const healthPct = Math.round(
    (toolRows.filter((x) => x.condition === 'excellent' || x.condition === 'good').length / toolRows.length) * 100,
  );

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('tools.title')}</h2>
          <p className="demo-page-subtitle">{tr('모든 도구의 연마 주기, 상태, 소유 구성을 추적합니다.', 'Track edge cycles, condition state, and ownership across every instrument.')}</p>
        </div>
        <Badge variant="primary">{locale === 'ko' ? `${filtered.length}개 항목` : `${filtered.length} items`}</Badge>
      </div>

      <div className="ben">
        <GlassCard hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <FilterChips
              options={filterOptions.map((opt) => opt.label)}
              value={filterOptions.find((opt) => opt.id === selectedFilter)?.label ?? filterOptions[0].label}
              onChange={(label) => {
                const matched = filterOptions.find((opt) => opt.label === label);
                if (matched) setSelectedFilter(matched.id);
              }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            columns={[
              {
                key: 'name',
                header: t('tools.colName'),
                render: (row: ToolRow) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(var(--gl), .14)',
                        color: 'var(--p700)',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {row.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{row.name[locale]}</div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--t4)' }}>
                        {tr('담당', 'Owner')}: {row.owner[locale]}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'category',
                header: t('tools.colCategory'),
                render: (row: ToolRow) => {
                  if (row.category === 'knife') return <Badge variant="danger">{tr('칼', 'Knife')}</Badge>;
                  if (row.category === 'pot') return <Badge variant="info">{tr('냄비/팬', 'Pot/Pan')}</Badge>;
                  return <Badge variant="success">{tr('소도구', 'Small Tool')}</Badge>;
                },
              },
              {
                key: 'condition',
                header: t('tools.colStatus'),
                render: (row: ToolRow) => {
                  if (row.condition === 'excellent') return <Badge variant="success">{tr('매우 좋음', 'Excellent')}</Badge>;
                  if (row.condition === 'good') return <Badge variant="info">{tr('양호', 'Good')}</Badge>;
                  return <Badge variant="warning">{tr('주의', 'Attention')}</Badge>;
                },
              },
              {
                key: 'edgeDue',
                header: t('tools.colSharp'),
                render: (row: ToolRow) => (
                  <span className="mono" style={{ color: row.edgeDue === '-' ? 'var(--t4)' : 'var(--t2)' }}>
                    {row.edgeDue}
                  </span>
                ),
              },
              {
                key: 'lastUsed',
                header: tr('최근 사용', 'Last used'),
                render: (row: ToolRow) => <span className="mono">{row.lastUsed}</span>,
              },
              {
                key: 'action',
                header: '',
                sortable: false,
                render: () => (
                  <button className="demo-table-action" onClick={() => onDetail?.()} aria-label={tr('상세 보기 열기', 'Open detail')}>
                    {'>'}
                  </button>
                ),
              },
            ]}
            data={filtered}
            rowKey={(row) => row.id}
            selectable
            selectedKeys={selectedRows}
            onSelectionChange={setSelectedRows}
            onRowClick={() => onDetail?.()}
          />
        </GlassCard>

        <div style={{ display: 'grid', gap: '14px' }}>
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('도구 상태 요약', 'Fleet health')}</div>
            <div className="demo-metric-grid">
              <div className="demo-metric-item">
                <span>{tr('총계', 'Total')}</span>
                <strong>{toolRows.length}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('주의', 'Attention')}</span>
                <strong>{toolRows.filter((x) => x.condition === 'attention').length}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('선택됨', 'Selected')}</span>
                <strong>{selectedRows.size}</strong>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('전체 준비도', 'Overall readiness')}</span>
                <span className="demo-list-value">{healthPct}%</span>
              </div>
              <ProgressBar value={healthPct} />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('예정된 정비', 'Upcoming maintenance')}</div>
            <Timeline
              entries={[
                {
                  time: '2026-02-18',
                  title: tr('UX10 엣지 리프레시', 'UX10 edge refresh'),
                  detail: tr('3000 -> 6000 -> 가죽 스트롭', '3000 -> 6000 -> leather strop'),
                },
                {
                  time: '2026-02-19',
                  title: tr('보닝 나이프 정렬', 'Boning knife realign'),
                  detail: tr('미세 칩핑 검사 및 각도 보정', 'Micro-chipping check and angle correction'),
                  dotColor: 'var(--warn)',
                },
                {
                  time: '2026-02-23',
                  title: tr('P-38 사시미 스트롭', 'P-38 sashimi strop'),
                  detail: tr('주말 조리 전 라이트 터치업', 'Light touch-up before weekend prep'),
                  dotColor: 'var(--p300)',
                  dotGlow: false,
                },
              ]}
            />
          </GlassCard>
        </div>
      </div>
    </>
  );
}
