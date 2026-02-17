import React, { useState } from 'react';
import { GlassCard, DataTable, Badge, Button, FilterChips, Checkbox } from '@circle-oo/vitro';

interface Knife {
  id: string;
  name: string;
  len: string;
  cat: string;
  status: 'owned' | 'planned';
  sharp: 'ok' | 'due' | '—';
  round: string;
  icon: string;
  [key: string]: unknown;
}

const knives: Knife[] = [
  { id: '1', name: 'Misono UX10 Gyuto', len: '210mm', cat: '칼', status: 'owned', sharp: 'due', round: '1차', icon: '🔪' },
  { id: '2', name: 'Chroma P-38 Sashimi', len: '250mm', cat: '칼', status: 'owned', sharp: 'due', round: '—', icon: '🔪' },
  { id: '3', name: 'Chroma P-01 Chef', len: '250mm', cat: '칼', status: 'owned', sharp: 'ok', round: '—', icon: '🔪' },
  { id: '4', name: 'Chroma P-19 Utility', len: '120mm', cat: '칼', status: 'owned', sharp: 'ok', round: '—', icon: '🔪' },
  { id: '5', name: 'Victorinox Fibrox Boning', len: '150mm', cat: '칼', status: 'planned', sharp: '—', round: '2차', icon: '🔪' },
  { id: '6', name: 'Staub Cocotte', len: '22cm', cat: '냄비/팬', status: 'planned', sharp: '—', round: '2차', icon: '🍲' },
  { id: '7', name: 'Fiskars Sauce Pan', len: '16cm', cat: '냄비/팬', status: 'planned', sharp: '—', round: '1차', icon: '🍲' },
  { id: '8', name: 'ThermoPro 온도계', len: '—', cat: '소도구', status: 'planned', sharp: '—', round: '1차', icon: '🌡️' },
  { id: '9', name: '디지털 저울', len: '—', cat: '소도구', status: 'planned', sharp: '—', round: '1차', icon: '⚖️' },
];

interface ToolsPageProps {
  onDetail?: () => void;
}

export function ToolsPage({ onDetail }: ToolsPageProps) {
  const [filter, setFilter] = useState('전체');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        도구 관리
      </div>
      <GlassCard hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <FilterChips
            options={['전체', '🔪 칼', '🍲 냄비/팬', '🔧 소도구']}
            value={filter}
            onChange={setFilter}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="검색..."
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
            <Button variant="primary" size="sm">+ 추가</Button>
          </div>
        </div>
        <DataTable
          columns={[
            {
              key: 'name',
              header: '이름',
              render: (row: Knife) => (
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{row.icon}</span>
                  {row.name}
                  <span className="mono">{row.len}</span>
                </div>
              ),
            },
            { key: 'cat', header: '카테고리' },
            {
              key: 'status',
              header: '상태',
              render: (row: Knife) => (
                <Badge variant={row.status === 'owned' ? 'success' : 'info'}>
                  {row.status === 'owned' ? '보유' : '구매 예정'}
                </Badge>
              ),
            },
            {
              key: 'sharp',
              header: '연마',
              render: (row: Knife) =>
                row.sharp === 'ok' ? <Badge variant="success">정상</Badge> :
                row.sharp === 'due' ? <Badge variant="warning">주기 도래</Badge> :
                <span style={{ color: 'var(--t4)' }}>—</span>,
            },
            {
              key: 'round',
              header: '라운드',
              render: (row: Knife) =>
                row.round !== '—' ? <Badge variant="primary">{row.round}</Badge> :
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
