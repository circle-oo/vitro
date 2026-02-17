import React, { useState } from 'react';
import { GlassCard, Badge, Button, LoadingState, EmptyState, ErrorBanner, ConfirmDialog } from '@circle-oo/vitro';
import { useLocale } from '../../i18n';

export function FeedbackSection() {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-library-stack">
      <div className="demo-library-head">
        <h3>{tr('피드백', 'Feedback', 'Retour', 'フィードバック')}</h3>
        <Badge variant="info">LoadingState, EmptyState, ErrorBanner, ConfirmDialog</Badge>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">LoadingState</div>
          <LoadingState message={tr('팬트리 시그널 동기화 중...', 'Syncing pantry signals...', 'Synchronisation des signaux Pantry...', 'Pantryシグナルを同期中...')} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">EmptyState</div>
          <EmptyState icon="📦" title={tr('항목이 없습니다', 'No items', 'Aucun élément', '項目がありません')} message={tr('첫 재료를 추가해 재고 추적을 시작하세요.', 'Add your first ingredient to begin inventory tracking.', 'Ajoutez votre premier ingrédient pour démarrer le suivi des stocks.', '最初の食材を追加して在庫追跡を開始してください。')} />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">ErrorBanner</div>
        <ErrorBanner message={tr('재고 API 타임아웃. 캐시 데이터로 재시도합니다.', 'Inventory API timeout. Retrying with cached data.', 'Timeout de l\'API inventaire. Nouvelle tentative avec les données en cache.', '在庫APIタイムアウト。キャッシュデータで再試行します。')} />
      </GlassCard>

      <GlassCard hover={false}>
        <div className="demo-card-title">ConfirmDialog</div>
        <Button variant="danger" size="sm" onClick={() => setOpen(true)}>{tr('확인 다이얼로그 열기', 'Open confirm dialog', 'Ouvrir le dialogue de confirmation', '確認ダイアログを開く')}</Button>
      </GlassCard>

      <ConfirmDialog
        open={open}
        title={tr('레시피를 삭제할까요?', 'Delete recipe?', 'Supprimer la recette ?', 'レシピを削除しますか？')}
        description={tr('이 작업은 데모 전용이며 실제로 저장되지 않습니다.', 'This action is demo-only and will not persist changes.', 'Cette action est uniquement pour la démo et ne sera pas enregistrée.', 'この操作はデモ専用で、変更は保存されません。')}
        confirmLabel={tr('삭제', 'Delete', 'Supprimer', '削除')}
        cancelLabel={tr('취소', 'Cancel', 'Annuler', 'キャンセル')}
        variant="danger"
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
}
