import React, { useState } from 'react';
import { GlassCard, StatCard, Badge, Button, FilterChips } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

export function InventoryPage() {
  const { t } = useLocale();
  const [filter, setFilter] = useState(t('inv.filterAll'));

  const items = [
    { nameKey: 'inv.item.oliveOil', catKey: 'inv.catSeasoning', qtyKey: 'inv.qty.oliveOil', exp: '2026.08.20', status: 'danger' as const, labelKey: 'inv.statusLow' },
    { nameKey: 'inv.item.salt', catKey: 'inv.catSeasoning', qtyKey: 'inv.qty.salt', exp: '—', status: 'danger' as const, labelKey: 'inv.statusLow' },
    { nameKey: 'inv.item.butter', catKey: 'inv.catDairy', qtyKey: 'inv.qty.butter', exp: '2026.03.01', status: 'danger' as const, labelKey: 'inv.statusLow' },
    { nameKey: 'inv.item.salmon', catKey: 'inv.catProtein', qtyKey: 'inv.qty.salmon', exp: '2026.02.19', status: 'warning' as const, labelKey: 'D-2' },
    { nameKey: 'inv.item.eggs', catKey: 'inv.catProtein', qtyKey: 'inv.qty.eggs', exp: '2026.02.25', status: 'success' as const, labelKey: 'inv.statusOk' },
    { nameKey: 'inv.item.radish', catKey: 'inv.catVeg', qtyKey: 'inv.qty.radish', exp: '2026.02.22', status: 'success' as const, labelKey: 'inv.statusOk' },
    { nameKey: 'inv.item.greenOnion', catKey: 'inv.catVeg', qtyKey: 'inv.qty.greenOnion', exp: '2026.02.20', status: 'warning' as const, labelKey: 'D-3' },
  ];

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('inv.title')}
      </div>

      <div className="r4 mb">
        <GlassCard><StatCard label={t('inv.statTotal')} value={24} /></GlassCard>
        <GlassCard><StatCard label={t('inv.statExpiring')} value={2} valueColor="var(--warn)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statLow')} value={3} valueColor="var(--err)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statConsumed')} value={8} /></GlassCard>
      </div>

      <GlassCard hover={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <FilterChips
            options={[t('inv.filterAll'), t('inv.filterProtein'), t('inv.filterVeg'), t('inv.filterSeasoning'), t('inv.filterLow')]}
            value={filter}
            onChange={setFilter}
          />
          <Button variant="primary" size="sm">{t('inv.add')}</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {[t('inv.colIngredient'), t('inv.colCategory'), t('inv.colQty'), t('inv.colExpiry'), t('inv.colStatus')].map((h) => (
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
              <tr key={item.nameKey}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>
                  {t(item.nameKey)}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{t(item.catKey)}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{t(item.qtyKey)}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{item.exp}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  <Badge variant={item.status}>
                    {item.labelKey.startsWith('D-') ? item.labelKey : t(item.labelKey)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
