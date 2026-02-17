import React, { useState } from 'react';
import { GlassCard, StatCard, Badge, Button, FilterChips } from '@circle-oo/vitro';

const items = [
  { name: '올리브유 (EVO)', cat: '조미료', qty: '~50ml', exp: '2026.08.20', status: 'danger' as const, label: '부족' },
  { name: '소금 (말동)', cat: '조미료', qty: '~30g', exp: '—', status: 'danger' as const, label: '부족' },
  { name: '버터 (이즈니)', cat: '유제품', qty: '~20g', exp: '2026.03.01', status: 'danger' as const, label: '부족' },
  { name: '연어 사쿠', cat: '단백질', qty: '200g', exp: '2026.02.19', status: 'warning' as const, label: 'D-2' },
  { name: '계란', cat: '단백질', qty: '6개', exp: '2026.02.25', status: 'success' as const, label: '정상' },
  { name: '무', cat: '채소', qty: '1/2개', exp: '2026.02.22', status: 'success' as const, label: '정상' },
  { name: '대파', cat: '채소', qty: '2대', exp: '2026.02.20', status: 'warning' as const, label: 'D-3' },
];

export function InventoryPage() {
  const [filter, setFilter] = useState('전체');

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        재고
      </div>

      <div className="r4 mb">
        <GlassCard><StatCard label="총 재고" value={24} /></GlassCard>
        <GlassCard><StatCard label="유통기한 임박" value={2} valueColor="var(--warn)" /></GlassCard>
        <GlassCard><StatCard label="부족 알림" value={3} valueColor="var(--err)" /></GlassCard>
        <GlassCard><StatCard label="이번 주 소비" value={8} /></GlassCard>
      </div>

      <GlassCard hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <FilterChips
            options={['전체', '🥩 단백질', '🥬 채소', '🧂 조미료', '⚠️ 부족']}
            value={filter}
            onChange={setFilter}
          />
          <Button variant="primary" size="sm">+ 추가</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {['재료', '카테고리', '수량', '유통기한', '상태'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--t3)',
                    borderBottom: '1px solid var(--div)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>
                  {item.name}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.cat}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.qty}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.exp}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  <Badge variant={item.status}>{item.label}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
