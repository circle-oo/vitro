import React, { useState } from 'react';
import { GlassCard, DataTable, Badge, Button, FilterChips, Checkbox } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface Knife {
  id: string;
  name: string;
  len: string;
  catKey: string;
  status: 'owned' | 'planned';
  sharp: 'ok' | 'due' | '—';
  roundKey: string;
  icon: string;
  [key: string]: unknown;
}

const knives: Knife[] = [
  { id: '1', name: 'Misono UX10 Gyuto', len: '210mm', catKey: 'tools.catKnife', status: 'owned', sharp: 'due', roundKey: 'dash.round1', icon: '🔪' },
  { id: '2', name: 'Chroma P-38 Sashimi', len: '250mm', catKey: 'tools.catKnife', status: 'owned', sharp: 'due', roundKey: '—', icon: '🔪' },
  { id: '3', name: 'Chroma P-01 Chef', len: '250mm', catKey: 'tools.catKnife', status: 'owned', sharp: 'ok', roundKey: '—', icon: '🔪' },
  { id: '4', name: 'Chroma P-19 Utility', len: '120mm', catKey: 'tools.catKnife', status: 'owned', sharp: 'ok', roundKey: '—', icon: '🔪' },
  { id: '5', name: 'Victorinox Fibrox Boning', len: '150mm', catKey: 'tools.catKnife', status: 'planned', sharp: '—', roundKey: 'dash.round2', icon: '🔪' },
  { id: '6', name: 'Staub Cocotte', len: '22cm', catKey: 'tools.catPot', status: 'planned', sharp: '—', roundKey: 'dash.round2', icon: '🍲' },
  { id: '7', name: 'Fiskars Sauce Pan', len: '16cm', catKey: 'tools.catPot', status: 'planned', sharp: '—', roundKey: 'dash.round1', icon: '🍲' },
  { id: '8', name: 'ThermoPro', len: '—', catKey: 'tools.catSmall', status: 'planned', sharp: '—', roundKey: 'dash.round1', icon: '🌡️' },
  { id: '9', name: 'Digital Scale', len: '—', catKey: 'tools.catSmall', status: 'planned', sharp: '—', roundKey: 'dash.round1', icon: '⚖️' },
];

interface ToolsPageProps {
  onDetail?: () => void;
}

export function ToolsPage({ onDetail }: ToolsPageProps) {
  const { t } = useLocale();
  const [filter, setFilter] = useState(t('tools.filterAll'));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('tools.title')}
      </div>
      <GlassCard hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <FilterChips
            options={[t('tools.filterAll'), t('tools.filterKnife'), t('tools.filterPot'), t('tools.filterSmall')]}
            value={filter}
            onChange={setFilter}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder={t('tools.search')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontFamily: 'var(--font)',
                color: 'var(--t1)',
                outline: 'none',
                width: '140px',
                backdropFilter: 'blur(16px)',
                background: 'var(--gi-bg)',
                border: '1px solid var(--gi-bd)',
              }}
            />
            <Button variant="primary" size="sm">{t('tools.add')}</Button>
          </div>
        </div>
        <DataTable
          columns={[
            {
              key: 'name',
              header: t('tools.colName'),
              render: (row: Knife) => (
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{row.icon}</span>
                  {row.name}
                  <span className="mono">{row.len}</span>
                </div>
              ),
            },
            { key: 'catKey', header: t('tools.colCategory'), render: (row: Knife) => t(row.catKey) },
            {
              key: 'status',
              header: t('tools.colStatus'),
              render: (row: Knife) => (
                <Badge variant={row.status === 'owned' ? 'success' : 'info'}>
                  {row.status === 'owned' ? t('tools.owned') : t('tools.planned')}
                </Badge>
              ),
            },
            {
              key: 'sharp',
              header: t('tools.colSharp'),
              render: (row: Knife) =>
                row.sharp === 'ok' ? <Badge variant="success">{t('tools.sharpOk')}</Badge> :
                row.sharp === 'due' ? <Badge variant="warning">{t('tools.sharpDue')}</Badge> :
                <span style={{ color: 'var(--t4)' }}>—</span>,
            },
            {
              key: 'roundKey',
              header: t('tools.colRound'),
              render: (row: Knife) =>
                row.roundKey !== '—' ? <Badge variant="primary">{t(row.roundKey)}</Badge> :
                <span style={{ color: 'var(--t4)' }}>—</span>,
            },
            {
              key: 'action',
              header: '',
              sortable: false,
              render: () => (
                <button
                  onClick={(e) => { e.stopPropagation(); onDetail?.(); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--t2)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    fontSize: '13px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                  }}
                >
                  →
                </button>
              ),
            },
          ]}
          data={knives}
          rowKey={(r) => r.id}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          onRowClick={(row) => onDetail?.()}
        />
      </GlassCard>
    </>
  );
}
