import React, { useMemo } from 'react';
import { GlassCard, Badge, Breadcrumb, Timeline, VitroSparkline, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { useTr } from '../useTr';
import type { NavigateRoute } from '../router';
import { inventoryItems } from '../data/inventory';
import { formatDateText, formatDateTime } from '../../../src/utils/format';

interface InventoryDetailPageProps {
  itemId: string;
  navigate?: (route: NavigateRoute) => void;
}

export function InventoryDetailPage({ itemId, navigate }: InventoryDetailPageProps) {
  const { locale } = useLocale();
  const tr = useTr();
  const item = inventoryItems.find((row) => row.id === itemId) ?? inventoryItems[0];
  const itemName = item.name[locale] ?? item.name.en;

  const categoryLabel = useMemo(() => {
    if (item.category === 'Protein') return tr('단백질', 'Protein', 'Protéine', 'タンパク質');
    if (item.category === 'Vegetable') return tr('채소', 'Vegetable', 'Légume', '野菜');
    if (item.category === 'Seasoning') return tr('조미료', 'Seasoning', 'Assaisonnement', '調味料');
    if (item.category === 'Dairy') return tr('유제품', 'Dairy', 'Produit laitier', '乳製品');
    return item.category;
  }, [item.category, tr]);

  const statusBadge = useMemo(() => {
    if (item.level === 'ok') return <Badge variant="success">{tr('정상', 'Healthy', 'Normal', '正常')}</Badge>;
    if (item.level === 'warn') return <Badge variant="warning">{tr('임박', 'Expiring', 'Bientôt', '期限間近')}</Badge>;
    return <Badge variant="danger">{tr('부족', 'Low', 'Bas', '不足')}</Badge>;
  }, [item.level, tr]);

  const stockTimeline = useMemo(
    () => [
      {
        time: formatDateTime('2026-02-17 19:24', locale),
        title: tr('요리 세션 차감', 'Cooking session deduction', 'Déduction de session', '調理セッション差引'),
        detail: tr('사시미 세션으로 200g 사용', '200g consumed in sashimi session', '200g consommés lors de la session sashimi', '刺身セッションで200g使用'),
      },
      {
        time: formatDateTime('2026-02-16 10:12', locale),
        title: tr('입고 반영', 'Inbound stock update', 'Mise à jour d\'entrée', '入庫反映'),
        detail: tr('신규 입고 +1 단위 반영', 'New inbound +1 unit updated', 'Nouvel approvisionnement +1 unité', '新規入庫 +1単位反映'),
        dotColor: 'var(--ok)',
      },
      {
        time: formatDateTime('2026-02-14 09:02', locale),
        title: tr('수동 보정', 'Manual correction', 'Correction manuelle', '手動補正'),
        detail: tr('실측 수량 기준으로 보정', 'Adjusted to measured quantity', 'Ajusté à la quantité mesurée', '実測数量に基づき補正'),
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
    [locale, tr],
  );

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Breadcrumb
          items={[
            { label: tr('재고', 'Inventory', 'Inventaire', '在庫'), onClick: () => navigate?.({ page: 'inventory' }) },
            { label: itemName, current: true },
          ]}
        />
      </div>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <PageHeader
            title={itemName}
            subtitle={tr('재고 변동, 사용 추세, 연결 레시피를 함께 확인합니다.', 'Inspect stock movement, usage trend, and linked recipes in one view.', 'Consultez les mouvements de stock, les tendances d\'utilisation et les recettes liées.', '在庫の変動、使用傾向、関連レシピをまとめて確認します。')}
            onBack={() => navigate?.({ page: 'inventory' })}
            action={statusBadge}
          />

          <div className="demo-metric-grid" style={{ marginTop: '12px' }}>
            <div className="demo-metric-item"><span>{tr('현재 수량', 'Current qty', 'Quantité actuelle', '現在の数量')}</span><strong>{(item.qty[locale] ?? item.qty.en)}</strong></div>
            <div className="demo-metric-item"><span>{tr('유통기한', 'Expiry', 'Péremption', '消費期限')}</span><strong>{formatDateText(item.expiry, locale)}</strong></div>
            <div className="demo-metric-item">
              <span>{tr('카테고리', 'Category', 'Catégorie', 'カテゴリ')}</span>
              <strong>{categoryLabel}</strong>
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div className="demo-card-title">{tr('7일 사용량 스파크라인', '7-day usage sparkline', 'Sparkline utilisation 7j', '7日間使用量')}</div>
            <VitroSparkline data={[8, 12, 7, 10, 11, 15, 9]} />
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('관련 레시피', 'Linked recipes', 'Recettes liées', '関連レシピ')}</div>
          <div className="demo-list">
            <button type="button" className="demo-list-row demo-list-row-btn" onClick={() => navigate?.({ page: 'recipes', sub: 'detail', id: 'r2' })}>
              <span className="demo-list-label">{tr('연어 사시미 + 다이콘', 'Salmon Sashimi + Daikon', 'Sashimi de saumon + Daikon', 'サーモン刺身 + 大根')}</span>
              <span className="demo-list-value">r2</span>
            </button>
            <button type="button" className="demo-list-row demo-list-row-btn" onClick={() => navigate?.({ page: 'recipes', sub: 'detail', id: 'r3' })}>
              <span className="demo-list-label">{tr('된장찌개', 'Doenjang Jjigae', 'Doenjang Jjigae', 'テンジャンチゲ')}</span>
              <span className="demo-list-value">r3</span>
            </button>
            <button type="button" className="demo-list-row demo-list-row-btn" onClick={() => navigate?.({ page: 'recipes', sub: 'detail', id: 'r1' })}>
              <span className="demo-list-label">{tr('카치오 에 페페', 'Cacio e Pepe', 'Cacio e Pepe', 'カチョ・エ・ペペ')}</span>
              <span className="demo-list-value">r1</span>
            </button>
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('재고 이력', 'Stock timeline', 'Historique du stock', '在庫履歴')}</div>
        <Timeline entries={stockTimeline} />
      </GlassCard>
    </>
  );
}
