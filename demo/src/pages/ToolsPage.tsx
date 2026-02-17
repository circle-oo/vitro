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
import { formatDateText } from '../dateTime';

interface LocalizedText {
  ko: string;
  en: string;
  [key: string]: string | undefined;
}

export interface ToolRow {
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

export const toolRows: ToolRow[] = [
  { id: 't1', icon: 'K', name: { ko: '미소노 UX10 규토 210', en: 'Misono UX10 Gyuto 210', fr: 'Misono UX10 Gyuto 210', ja: 'ミソノ UX10 牛刀 210' }, category: 'knife', condition: 'attention', edgeDue: '2026-02-18', owner: { ko: '메인', en: 'Main', fr: 'Principal', ja: 'メイン' }, lastUsed: '2026-02-16' },
  { id: 't2', icon: 'K', name: { ko: '크로마 P-38 사시미 250', en: 'Chroma P-38 Sashimi 250', fr: 'Chroma P-38 Sashimi 250', ja: 'クロマ P-38 刺身 250' }, category: 'knife', condition: 'good', edgeDue: '2026-02-23', owner: { ko: '메인', en: 'Main', fr: 'Principal', ja: 'メイン' }, lastUsed: '2026-02-17' },
  { id: 't3', icon: 'K', name: { ko: '크로마 P-19 유틸리티', en: 'Chroma P-19 Utility', fr: 'Chroma P-19 Utilitaire', ja: 'クロマ P-19 ユーティリティ' }, category: 'knife', condition: 'excellent', edgeDue: '2026-03-02', owner: { ko: '프렙', en: 'Prep', fr: 'Préparation', ja: 'プレップ' }, lastUsed: '2026-02-15' },
  { id: 't4', icon: 'P', name: { ko: '스타우브 코코트 22cm', en: 'Staub Cocotte 22cm', fr: 'Staub Cocotte 22 cm', ja: 'ストウブ ココット 22cm' }, category: 'pot', condition: 'excellent', edgeDue: '-', owner: { ko: '열원', en: 'Heat', fr: 'Chaleur', ja: '熱源' }, lastUsed: '2026-02-17' },
  { id: 't5', icon: 'P', name: { ko: '피스카스 소스팬 16cm', en: 'Fiskars Saucepan 16cm', fr: 'Casserole Fiskars 16 cm', ja: 'フィスカース ソースパン 16cm' }, category: 'pot', condition: 'good', edgeDue: '-', owner: { ko: '열원', en: 'Heat', fr: 'Chaleur', ja: '熱源' }, lastUsed: '2026-02-14' },
  { id: 't6', icon: 'T', name: { ko: '디지털 프로브 온도계', en: 'Digital Probe Thermometer', fr: 'Thermomètre sonde numérique', ja: 'デジタルプローブ温度計' }, category: 'small', condition: 'good', edgeDue: '-', owner: { ko: '도구', en: 'Tools', fr: 'Outils', ja: '道具' }, lastUsed: '2026-02-17' },
  { id: 't7', icon: 'T', name: { ko: '스케일 프로 미니', en: 'Scale Pro Mini', fr: 'Balance Pro Mini', ja: 'スケール Pro Mini' }, category: 'small', condition: 'excellent', edgeDue: '-', owner: { ko: '도구', en: 'Tools', fr: 'Outils', ja: '道具' }, lastUsed: '2026-02-13' },
  { id: 't8', icon: 'K', name: { ko: '빅토리녹스 보닝 150', en: 'Victorinox Boning 150', fr: 'Victorinox Désossage 150', ja: 'ビクトリノックス ボーニング 150' }, category: 'knife', condition: 'attention', edgeDue: '2026-02-19', owner: { ko: '백업', en: 'Backup', fr: 'Secours', ja: '予備' }, lastUsed: '2026-02-09' },
];

interface ToolsPageProps {
  onDetail?: (id: string) => void;
}

export function ToolsPage({ onDetail }: ToolsPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'knife' | 'pot' | 'small' | 'attention'>('all');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filterOptions = [
    { id: 'all' as const, label: tr('전체', 'All', 'Tous', 'すべて') },
    { id: 'knife' as const, label: tr('칼', 'Knives', 'Couteaux', '包丁') },
    { id: 'pot' as const, label: tr('냄비/팬', 'Pots', 'Casseroles', '鍋/フライパン') },
    { id: 'small' as const, label: tr('소도구', 'Small Tools', 'Petits outils', '小道具') },
    { id: 'attention' as const, label: tr('주의 필요', 'Needs Attention', 'Attention requise', '要注意') },
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
        || (row.name.fr?.toLowerCase().includes(normalized) ?? false)
        || (row.name.ja?.toLowerCase().includes(normalized) ?? false)
        || row.owner.ko.toLowerCase().includes(normalized)
        || row.owner.en.toLowerCase().includes(normalized)
        || (row.owner.fr?.toLowerCase().includes(normalized) ?? false)
        || (row.owner.ja?.toLowerCase().includes(normalized) ?? false);
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
          <p className="demo-page-subtitle">{tr('모든 도구의 연마 주기, 상태, 소유 구성을 추적합니다.', 'Track edge cycles, condition state, and ownership across every instrument.', 'Suivez les cycles d\'affûtage, l\'état et la répartition de chaque outil.', 'すべての道具の研ぎ周期、状態、所有構成を追跡します。')}</p>
        </div>
        <Badge variant="primary">{tr(`${filtered.length}개 항목`, `${filtered.length} items`, `${filtered.length} éléments`, `${filtered.length}件`)}</Badge>
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
            columns={[
              {
                key: 'name',
                header: t('tools.colName'),
                render: (row: ToolRow) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{(row.name[locale] ?? row.name.en)}</div>
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--t4)' }}>
                      {tr('담당', 'Owner', 'Responsable', '担当')}: {(row.owner[locale] ?? row.owner.en)}
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
            ]}
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
                <strong>{toolRows.length}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('주의', 'Attention', 'Attention', '注意')}</span>
                <strong>{toolRows.filter((x) => x.condition === 'attention').length}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{tr('선택됨', 'Selected', 'Sélectionnés', '選択中')}</span>
                <strong>{selectedRows.size}</strong>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('전체 준비도', 'Overall readiness', 'Disponibilité globale', '全体準備度')}</span>
                <span className="demo-list-value">{healthPct}%</span>
              </div>
              <ProgressBar value={healthPct} />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('예정된 정비', 'Upcoming maintenance', 'Entretien à venir', '予定メンテナンス')}</div>
            <Timeline
              entries={[
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
              ]}
            />
          </GlassCard>
        </div>
      </div>
    </>
  );
}
