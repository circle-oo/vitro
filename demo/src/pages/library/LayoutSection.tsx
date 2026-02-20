import React, { useMemo, useState } from 'react';
import {
  GlassCard,
  Badge,
  GlassSidebar,
  SidebarRail,
  SidebarSectioned,
  SidebarDock,
  PageLayout,
} from '@circle-oo/vitro';
import { useTr } from '../../useTr';
import { getLibraryNodeAnchorId } from './nodeAnchors';

export function LayoutSection() {
  const tr = useTr();

  const [active, setActive] = useState(1);
  const items = useMemo(
    () => [
      { id: 'a', label: tr('대시보드', 'Dashboard', 'Tableau de bord', 'ダッシュボード'), icon: <span>D</span> },
      { id: 'b', label: tr('도구', 'Tools', 'Outils', '道具'), icon: <span>T</span> },
      { id: 'c', label: tr('레시피', 'Recipes', 'Recettes', 'レシピ'), icon: <span>R</span> },
      { id: 'd', label: tr('설정', 'Settings', 'Paramètres', '設定'), icon: <span>G</span> },
    ],
    [tr],
  );

  const sections = useMemo(
    () => [
      { id: 'core', label: tr('코어', 'Core', 'Base', 'コア'), itemIds: ['a', 'b'] },
      { id: 'system', label: tr('시스템', 'System', 'Système', 'システム'), itemIds: ['c', 'd'] },
    ],
    [tr],
  );

  return (
    <div className="demo-library-stack" id={getLibraryNodeAnchorId('layout:overview')}>
      <div className="demo-library-head">
        <h3>{tr('레이아웃', 'Layout', 'Mise en page', 'レイアウト')}</h3>
        <Badge variant="info">{tr('MeshBackground + 사이드바 4종 + PageLayout', 'MeshBackground + 4 sidebars + PageLayout', 'MeshBackground + 4 barres latérales + PageLayout', 'MeshBackground + サイドバー4種 + PageLayout')}</Badge>
      </div>

      <GlassCard id={getLibraryNodeAnchorId('layout:mesh-background')} hover={false}>
        <div className="demo-card-title">MeshBackground</div>
        <p className="demo-library-copy">
          {tr(
            'MeshBackground는 데모 셸에 전역 적용됩니다. 이 섹션은 레이아웃 컨테이너와 사이드바 변형을 미리 보여줍니다.',
            'MeshBackground is applied globally in the demo shell. This section previews layout containers and sidebar variants.',
            'MeshBackground est appliqué globalement dans la démo. Cette section prévisualise les conteneurs de mise en page et les variantes de barre latérale.',
            'MeshBackgroundはデモシェル全体に適用されます。このセクションではレイアウトコンテナとサイドバーの種類をプレビューします。',
          )}
        </p>
      </GlassCard>

      <div className="demo-sidebar-grid">
        <div className="demo-sidebar-preview" id={getLibraryNodeAnchorId('layout:glass-sidebar')}>
          <div className="demo-card-title">GlassSidebar</div>
          <GlassSidebar
            serviceName={tr('프리뷰', 'Preview', 'Aperçu', 'プレビュー')}
            serviceIcon="V"
            items={items}
            activeIndex={active}
            onNavigate={setActive}
            statusText={tr('프리뷰 모드', 'Preview mode', 'Mode aperçu', 'プレビューモード')}
            workspaceLabel={tr('레이아웃 프리뷰', 'Layout preview', 'Aperçu de mise en page', 'レイアウトプレビュー')}
            closeMenuLabel={tr('메뉴 닫기', 'Close menu', 'Fermer le menu', 'メニューを閉じる')}
            expandSidebarLabel={tr('사이드바 펼치기', 'Expand sidebar', 'Développer la barre latérale', 'サイドバーを展開')}
            collapseSidebarLabel={tr('사이드바 접기', 'Collapse sidebar', 'Réduire la barre latérale', 'サイドバーを折りたたむ')}
            fixed={false}
          />
        </div>

        <div className="demo-sidebar-preview" id={getLibraryNodeAnchorId('layout:sidebar-rail')}>
          <div className="demo-card-title">SidebarRail</div>
          <SidebarRail
            serviceIcon="V"
            items={items}
            activeIndex={active}
            onNavigate={setActive}
            fixed={false}
          />
        </div>

        <div className="demo-sidebar-preview" id={getLibraryNodeAnchorId('layout:sidebar-sectioned')}>
          <div className="demo-card-title">SidebarSectioned</div>
          <SidebarSectioned
            serviceName={tr('프리뷰', 'Preview', 'Aperçu', 'プレビュー')}
            subtitle={tr('섹션형 사이드바', 'Sectioned sidebar', 'Barre latérale sectionnée', 'セクション型サイドバー')}
            serviceIcon="V"
            items={items}
            sections={sections}
            activeItemId={items[active]?.id}
            onNavigate={(itemId, index) => setActive(index)}
            fixed={false}
          />
        </div>

        <div className="demo-sidebar-preview" id={getLibraryNodeAnchorId('layout:sidebar-dock')}>
          <div className="demo-card-title">SidebarDock</div>
          <SidebarDock
            serviceName={tr('프리뷰', 'Preview', 'Aperçu', 'プレビュー')}
            subtitle={tr('도크 내비게이션', 'Dock navigation', 'Navigation dock', 'ドックナビゲーション')}
            serviceIcon="V"
            items={items}
            activeIndex={active}
            onNavigate={setActive}
            fixed={false}
          />
        </div>
      </div>

      <GlassCard id={getLibraryNodeAnchorId('layout:page-layout')} hover={false}>
        <div className="demo-card-title">PageLayout</div>
        <PageLayout minHeight={180} sidebarOffset={0}>
          <div style={{ padding: '10px 12px' }}>
            <strong>{tr('PageLayout 콘텐츠 영역', 'PageLayout content area', 'Zone de contenu PageLayout', 'PageLayoutコンテンツ領域')}</strong>
            <p className="demo-library-copy" style={{ marginBottom: 0 }}>
              {tr(
                '데스크톱 오프셋과 모바일 메뉴 진입을 일관되게 처리합니다.',
                'Handles desktop offsets and mobile menu entry consistently.',
                'Gère de manière cohérente les offsets desktop et l\'entrée du menu mobile.',
                'デスクトップのオフセットとモバイルメニュー導線を一貫して処理します。',
              )}
            </p>
          </div>
        </PageLayout>
      </GlassCard>
    </div>
  );
}
