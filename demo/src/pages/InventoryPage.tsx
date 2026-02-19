import React, { useCallback, useMemo, useState } from 'react';
import {
  GlassCard,
  StatCard,
  Badge,
  Button,
  FilterChips,
  VitroAreaChart,
  ProgressBar,
  SegmentedControl,
  PageHeader,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { useTr } from '../useTr';
import { formatDateText } from '@circle-oo/vitro';
import { resolveLocalized } from '@circle-oo/vitro';
import { inventoryItems } from '../data/inventory';

interface InventoryPageProps {
  onDetail?: (id: string) => void;
}

const TOTAL_STOCK = inventoryItems.length;
const LOW_STOCK_COUNT = inventoryItems.filter((item) => item.level === 'low').length;

export function InventoryPage({ onDetail }: InventoryPageProps) {
  const { t, locale } = useLocale();
  const tr = useTr();
  const [filter, setFilter] = useState<'all' | 'protein' | 'vegetable' | 'seasoning' | 'low'>('all');
  const [view, setView] = useState<'table' | 'cards'>('table');
  const consumptionData = useMemo(
    () => [
      { day: tr('월', 'Mon', 'Lun', '月'), use: 14 },
      { day: tr('화', 'Tue', 'Mar', '火'), use: 18 },
      { day: tr('수', 'Wed', 'Mer', '水'), use: 12 },
      { day: tr('목', 'Thu', 'Jeu', '木'), use: 21 },
      { day: tr('금', 'Fri', 'Ven', '金'), use: 19 },
      { day: tr('토', 'Sat', 'Sam', '土'), use: 24 },
      { day: tr('일', 'Sun', 'Dim', '日'), use: 16 },
    ],
    [locale],
  );

  const filterOptions = useMemo(
    () => [
      { id: 'all' as const, label: tr('전체', 'All', 'Tout', 'すべて') },
      { id: 'protein' as const, label: tr('단백질', 'Protein', 'Protéine', 'タンパク質') },
      { id: 'vegetable' as const, label: tr('채소', 'Vegetable', 'Légume', '野菜') },
      { id: 'seasoning' as const, label: tr('조미료', 'Seasoning', 'Assaisonnement', '調味料') },
      { id: 'low' as const, label: tr('부족', 'Low', 'Bas', '不足') },
    ],
    [tr],
  );

  const filtered = useMemo(
    () =>
      inventoryItems.filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'low') return item.level === 'low';
        if (filter === 'protein') return item.category === 'Protein';
        if (filter === 'vegetable') return item.category === 'Vegetable';
        if (filter === 'seasoning') return item.category === 'Seasoning';
        return false;
      }),
    [filter],
  );
  const tableHeaders = useMemo(
    () => [
      tr('재료', 'Ingredient', 'Ingrédient', '食材'),
      tr('카테고리', 'Category', 'Catégorie', 'カテゴリ'),
      tr('수량', 'Qty', 'Qté', '数量'),
      tr('유통기한', 'Expiry', 'Péremption', '消費期限'),
      tr('상태', 'Status', 'Statut', 'ステータス'),
    ],
    [locale],
  );

  const viewOptions = useMemo(
    () => [
      { id: 'table', label: tr('테이블', 'Table', 'Tableau', 'テーブル') },
      { id: 'cards', label: tr('카드', 'Cards', 'Cartes', 'カード') },
    ],
    [tr],
  );

  const resolveCategoryLabel = useCallback(
    (category: string) => {
      if (category === 'Protein') return tr('단백질', 'Protein', 'Protéine', 'タンパク質');
      if (category === 'Vegetable') return tr('채소', 'Vegetable', 'Légume', '野菜');
      if (category === 'Seasoning') return tr('조미료', 'Seasoning', 'Assaisonnement', '調味料');
      if (category === 'Dairy') return tr('유제품', 'Dairy', 'Produit laitier', '乳製品');
      return category;
    },
    [tr],
  );

  const renderLevelBadge = useCallback(
    (level: 'ok' | 'warn' | 'low') => {
      if (level === 'ok') return <Badge variant="success">{tr('정상', 'Healthy', 'Normal', '正常')}</Badge>;
      if (level === 'warn') return <Badge variant="warning">{tr('임박', 'Expiring', 'Bientôt', '期限間近')}</Badge>;
      return <Badge variant="danger">{tr('부족', 'Low', 'Bas', '不足')}</Badge>;
    },
    [tr],
  );

  return (
    <>
      <PageHeader
        title={t('inv.title')}
        subtitle={tr('유통기한 신호와 보충 진행률을 포함한 실시간 재고 개요입니다.', 'Live stock overview with expiry signals and replenishment progress.', 'Aperçu en temps réel des stocks avec signaux de péremption et progression du réapprovisionnement.', '消費期限シグナルと補充進捗を含むリアルタイム在庫概要。')}
      />

      <div className="r4 mb">
        <GlassCard><StatCard label={t('inv.statTotal')} value={TOTAL_STOCK} /></GlassCard>
        <GlassCard><StatCard label={t('inv.statExpiring')} value={2} valueColor="var(--warn)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statLow')} value={LOW_STOCK_COUNT} valueColor="var(--err)" /></GlassCard>
        <GlassCard><StatCard label={t('inv.statConsumed')} value={18} delta={tr('최근 7일', '7d rolling', '7j glissants', '直近7日')} /></GlassCard>
      </div>

      <div className="ben mb">
        <GlassCard hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <FilterChips
              options={filterOptions}
              value={filter}
              onChange={(id) => {
                setFilter(id as typeof filter);
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <SegmentedControl
                size="sm"
                value={view}
                onValueChange={(next) => setView(next as 'table' | 'cards')}
                options={viewOptions}
              />
              <Button variant="primary" size="sm">{t('inv.add')}</Button>
            </div>
          </div>

          {view === 'table' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {tableHeaders.map((h) => (
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
                  <tr
                    key={item.id}
                    onClick={() => onDetail?.(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>{resolveLocalized(item.name, locale)}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                      {resolveCategoryLabel(item.category)}
                    </td>
                    <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{resolveLocalized(item.qty, locale)}</td>
                    <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{formatDateText(item.expiry, locale)}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                      {renderLevelBadge(item.level)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="demo-grid-auto">
              {filtered.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="demo-unstyled-button"
                  onClick={() => onDetail?.(item.id)}
                >
                  <GlassCard hover={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                      <strong>{resolveLocalized(item.name, locale)}</strong>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--t4)' }}>{formatDateText(item.expiry, locale)}</span>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ color: 'var(--t3)' }}>{resolveLocalized(item.qty, locale)}</span>
                      {renderLevelBadge(item.level)}
                    </div>
                  </GlassCard>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        <div style={{ display: 'grid', gap: '14px' }}>
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('소비 추세', 'Consumption trend', 'Tendance de consommation', '消費トレンド')}</div>
            <VitroAreaChart data={consumptionData} dataKey="use" xKey="day" height={220} animated />
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('재주문 체크리스트', 'Reorder checklist', 'Liste de réapprovisionnement', '再注文チェックリスト')}</div>
            <div className="demo-list">
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('올리브유 리필', 'Olive oil refill', "Recharge d'huile d'olive", 'オリーブオイル補充')}</span>
                  <span className="demo-list-value">80%</span>
                </div>
                <ProgressBar value={80} />
              </div>
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('말돈 솔트 보충', 'Maldon reserve', 'Réserve de Maldon', 'マルドン塩補充')}</span>
                  <span className="demo-list-value">66%</span>
                </div>
                <ProgressBar value={66} />
              </div>
              <div>
                <div className="demo-list-row" style={{ marginBottom: '7px' }}>
                  <span className="demo-list-label">{tr('버터 재고 보강', 'Butter restock', 'Réstock de beurre', 'バター在庫補充')}</span>
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
