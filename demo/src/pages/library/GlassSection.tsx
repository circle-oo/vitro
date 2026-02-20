import React from 'react';
import { GlassCard, GlassOverlay, GlassInteractive, Badge, Button } from '@circle-oo/vitro';
import { useTr } from '../../useTr';
import { getLibraryNodeAnchorId } from './nodeAnchors';

export function GlassSection() {
  const tr = useTr();

  return (
    <div className="demo-library-stack" id={getLibraryNodeAnchorId('glass:overview')}>
      <div className="demo-library-head">
        <h3>{tr('글래스', 'Glass', 'Verre', 'ガラス')}</h3>
        <Badge variant="info">{tr('컴포넌트 3개', '3 components', '3 composants', '3コンポーネント')}</Badge>
      </div>

      <div className="r2">
        <GlassCard id={getLibraryNodeAnchorId('glass:card')} hover={false}>
          <div className="demo-card-title">GlassCard</div>
          <p className="demo-library-copy">{tr('팬트리 카드와 셸의 기본 컨테이너입니다.', 'Default container for pantry cards and shells.', 'Conteneur par défaut pour les cartes et conteneurs Pantry.', 'Pantryカードとシェルの基本コンテナです。')}</p>
          <Button size="sm">{tr('액션', 'Action', 'Action', 'アクション')}</Button>
        </GlassCard>

        <GlassOverlay id={getLibraryNodeAnchorId('glass:overlay')}>
          <div style={{ padding: '14px' }}>
            <div className="demo-card-title">GlassOverlay</div>
            <p className="demo-library-copy">{tr('모달과 플로팅 레이어를 위한 오버레이 표면입니다.', 'Overlay surface for modals and floating layers.', 'Surface de superposition pour les modales et couches flottantes.', 'モーダルとフローティングレイヤー向けのオーバーレイ面です。')}</p>
          </div>
        </GlassOverlay>
      </div>

      <GlassInteractive id={getLibraryNodeAnchorId('glass:interactive')}>
        <div style={{ padding: '14px' }}>
          <div className="demo-card-title">GlassInteractive</div>
          <p className="demo-library-copy">{tr('깊이감과 포인터 반응이 있는 인터랙티브 글래스 표면입니다.', 'Interactive glass surface with depth and pointer response.', 'Surface de verre interactive avec profondeur et réponse au pointeur.', '奥行き感とポインタ応答を備えたインタラクティブガラス面です。')}</p>
        </div>
      </GlassInteractive>
    </div>
  );
}
