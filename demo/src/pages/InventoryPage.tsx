import React, { useMemo, useState } from 'react';
import {
  GlassCard,
  StatCard,
  Badge,
  Button,
  FilterChips,
  VitroAreaChart,
  ProgressBar,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface LocalizedText {
  ko: string;
  en: string;
}

interface InventoryItem {
  id: string;
  name: LocalizedText;
  category: 'Protein' | 'Vegetable' | 'Seasoning' | 'Dairy';
  qty: LocalizedText;
  expiry: string;
  level: 'ok' | 'warn' | 'low';
}

const items: InventoryItem[] = [
  { id: 'i1', name: { ko: '연어 사쿠', en: 'Salmon Saku' }, category: 'Protein', qty: { ko: '200g', en: '200g' }, expiry: '2026-02-19', level: 'warn' },
  { id: 'i2', name: { ko: '계란', en: 'Eggs' }, category: 'Protein', qty: { ko: '6개', en: '6 pcs' }, expiry: '2026-02-25', level: 'ok' },
  { id: 'i3', name: { ko: '올리브유 (EVO)', en: 'Olive Oil EVO' }, category: 'Seasoning', qty: { ko: '~50ml', en: '~50ml' }, expiry: '-', level: 'low' },
  { id: 'i4', name: { ko: '말돈 소금', en: 'Maldon Salt' }, category: 'Seasoning', qty: { ko: '~30g', en: '~30g' }, expiry: '-', level: 'low' },
  { id: 'i5', name: { ko: '이즈니 버터', en: 'Isigny Butter' }, category: 'Dairy', qty: { ko: '~20g', en: '~20g' }, expiry: '2026-03-01', level: 'low' },
  { id: 'i6', name: { ko: '무', en: 'Radish' }, category: 'Vegetable', qty: { ko: '1/2개', en: '1/2 pc' }, expiry: '2026-02-22', level: 'ok' },
  { id: 'i7', name: { ko: '대파', en: 'Green Onion' }, category: 'Vegetable', qty: { ko: '2대', en: '2 stalks' }, expiry: '2026-02-20', level: 'warn' },
  { id: 'i8', name: { ko: '두부', en: 'Tofu' }, category: 'Protein', qty: { ko: '1모', en: '1 block' }, expiry: '2026-02-21', level: 'ok' },
];

const consumptionData = [
  { day: 'Mon', use: 14 },
  { day: 'Tue', use: 18 },
  { day: 'Wed', use: 12 },
  { day: 'Thu', use: 21 },
  { day: 'Fri', use: 19 },
  { day: 'Sat', use: 24 },
  { day: 'Sun', use: 16 },
];

export function InventoryPage() {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [filter, setFilter] = useState<'all' | 'protein' | 'vegetable' | 'seasoning' | 'low'>('all');

  const filterOptions = [
    { id: 'all' as const, label: tr('전체', 'All') },
    { id: 'protein' as const, label: tr('단백질', 'Protein') },
    { id: 'vegetable' as const, label: tr('채소', 'Vegetable') },
    { id: 'seasoning' as const, label: tr('조미료', 'Seasoning') },
    { id: 'low' as const, label: tr('부족', 'Low') },
  ];

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'low') return item.level === 'low';
        if (filter === 'protein') return item.category === 'Protein';
        if (filter === 'vegetable') return item.category === 'Vegetable';
        if (filter === 'seasoning') return item.category === 'Seasoning';
        return false;
      }),
    [filter],
  );

  const lowCount = items.filter((i) => i.level === 'low').length;

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('inv.title')}</h2>
          <p className="demo-page-subtitle">{tr('유통기한 신호와 보충 진행률을 포함한 실시간 재고 개요입니다.', 'Live stock overview with expiry signals and replenishment progress.')}</p>
        </div>
      </div>

      <div className="r4 mb">
        <GlassCard><StatCard label={t('inv.statTotal')} value={items.length} /></GlassCard>
        <GlassCard><StatCard label={t('inv.statExpiring')} value={2} valueColor="var(--warn)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statLow')} value={lowCount} valueColor="var(--err)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statConsumed')} value={18} delta={tr('최근 7일', '7d rolling')} /></GlassCard>
      </div>

      <div className="ben mb">
        <GlassCard hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <FilterChips
              options={filterOptions.map((opt) => opt.label)}
              value={filterOptions.find((opt) => opt.id === filter)?.label ?? filterOptions[0].label}
              onChange={(label) => {
                const matched = filterOptions.find((opt) => opt.label === label);
                if (matched) setFilter(matched.id);
              }}
            />
            <Button variant="primary" size="sm">{t('inv.add')}</Button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {[tr('재료', 'Ingredient'), tr('카테고리', 'Category'), tr('수량', 'Qty'), tr('유통기한', 'Expiry'), tr('상태', 'Status')].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '.5px',
                      color: 'var(--t3)',
                      borderBottom: '1px solid var(--div)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>{item.name[locale]}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                    {item.category === 'Protein' && tr('단백질', 'Protein')}
                    {item.category === 'Vegetable' && tr('채소', 'Vegetable')}
                    {item.category === 'Seasoning' && tr('조미료', 'Seasoning')}
                    {item.category === 'Dairy' && tr('유제품', 'Dairy')}
                  </td>
                  <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.qty[locale]}</td>
                  <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.expiry}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                    {item.level === 'ok' && <Badge variant="success">{tr('정상', 'Healthy')}</Badge>}
                    {item.level === 'warn' && <Badge variant="warning">{tr('임박', 'Expiring')}</Badge>}
                    {item.level === 'low' && <Badge variant="danger">{tr('부족', 'Low')}</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <div style={{ display: 'grid', gap: '14px' }}>
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('소비 추세', 'Consumption trend')}</div>
            <VitroAreaChart data={consumptionData} dataKey="use" xKey="day" height={220} />
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('재주문 체크리스트', 'Reorder checklist')}</div>
            <div className="demo-list">
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('올리브유 리필', 'Olive oil refill')}</span>
                  <span className="demo-list-value">80%</span>
                </div>
                <ProgressBar value={80} />
              </div>
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('말돈 솔트 보충', 'Maldon reserve')}</span>
                  <span className="demo-list-value">66%</span>
                </div>
                <ProgressBar value={66} />
              </div>
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('버터 재고 보강', 'Butter restock')}</span>
                  <span className="demo-list-value">48%</span>
                </div>
                <ProgressBar value={48} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
