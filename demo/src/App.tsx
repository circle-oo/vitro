import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import {
  MeshBackground,
  GlassCard,
  GlassSidebar,
  SidebarRail,
  SidebarSectioned,
  SidebarDock,
  PageLayout,
  Badge,
  BottomNav,
  useTheme,
  useMesh,
  useMobile,
} from '@circle-oo/vitro';

import { LocaleProvider, useLocale } from './i18n';
import { useRouter } from './router';
import type { DemoPageId, NavigateRoute } from './router';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const ChatPage = lazy(() =>
  import('./pages/ChatPage').then((module) => ({ default: module.ChatPage })),
);
const ToolsPage = lazy(() =>
  import('./pages/ToolsPage').then((module) => ({ default: module.ToolsPage })),
);
const InventoryPage = lazy(() =>
  import('./pages/InventoryPage').then((module) => ({ default: module.InventoryPage })),
);
const RecipesPage = lazy(() =>
  import('./pages/RecipesPage').then((module) => ({ default: module.RecipesPage })),
);
const CookingLogPage = lazy(() =>
  import('./pages/CookingLogPage').then((module) => ({ default: module.CookingLogPage })),
);
const SharpeningPage = lazy(() =>
  import('./pages/SharpeningPage').then((module) => ({ default: module.SharpeningPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const LibraryPage = lazy(() =>
  import('./pages/LibraryPage').then((module) => ({ default: module.LibraryPage })),
);

const ToolDetailPage = lazy(() =>
  import('./pages/ToolDetailPage').then((module) => ({ default: module.ToolDetailPage })),
);
const InventoryDetailPage = lazy(() =>
  import('./pages/InventoryDetailPage').then((module) => ({ default: module.InventoryDetailPage })),
);
const RecipeDetailPage = lazy(() =>
  import('./pages/RecipeDetailPage').then((module) => ({ default: module.RecipeDetailPage })),
);
const SessionDetailPage = lazy(() =>
  import('./pages/SessionDetailPage').then((module) => ({ default: module.SessionDetailPage })),
);
const SharpeningDetailPage = lazy(() =>
  import('./pages/SharpeningDetailPage').then((module) => ({ default: module.SharpeningDetailPage })),
);

type SidebarType = 'classic' | 'rail' | 'sectioned' | 'dock';

interface NavDef {
  id: DemoPageId;
  labelKey: string;
  icon: React.ReactNode;
  section: 'core' | 'kitchen' | 'system';
}

const navDefs: NavDef[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <span>D</span>, section: 'core' },
  { id: 'chat', labelKey: 'nav.chat', icon: <span>C</span>, section: 'core' },
  { id: 'tools', labelKey: 'nav.tools', icon: <span>T</span>, section: 'kitchen' },
  { id: 'inventory', labelKey: 'nav.inventory', icon: <span>I</span>, section: 'kitchen' },
  { id: 'recipes', labelKey: 'nav.recipes', icon: <span>R</span>, section: 'kitchen' },
  { id: 'cooking-log', labelKey: 'nav.cookingLog', icon: <span>L</span>, section: 'kitchen' },
  { id: 'sharpening', labelKey: 'nav.sharpening', icon: <span>S</span>, section: 'system' },
  { id: 'settings', labelKey: 'nav.settings', icon: <span>G</span>, section: 'system' },
  { id: 'library', labelKey: 'nav.library', icon: <span>B</span>, section: 'system' },
];

function AppInner() {
  const { locale, t } = useLocale();
  const { mode, toggle: toggleTheme } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const isMobile = useMobile();
  const { route, navigate } = useRouter();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };

  const [sidebarType, setSidebarType] = useState<SidebarType>('sectioned');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route.page, route.sub, route.id]);

  const sidebarItems = useMemo(
    () => navDefs.map((item) => ({ id: item.id, icon: item.icon, label: t(item.labelKey) })),
    [t],
  );

  const sectionedSidebar = useMemo(
    () => [
      {
        id: 'core',
        label: tr('코어', 'Core', 'Base', 'コア'),
        itemIds: navDefs.filter((item) => item.section === 'core').map((item) => item.id),
      },
      {
        id: 'kitchen',
        label: tr('키친', 'Kitchen', 'Cuisine', 'キッチン'),
        itemIds: navDefs.filter((item) => item.section === 'kitchen').map((item) => item.id),
      },
      {
        id: 'system',
        label: tr('시스템', 'System', 'Système', 'システム'),
        itemIds: navDefs.filter((item) => item.section === 'system').map((item) => item.id),
      },
    ],
    [locale],
  );

  const activeIndex = Math.max(0, navDefs.findIndex((item) => item.id === route.page));
  const navigatePage = (id: DemoPageId) => navigate({ page: id });
  const goToolDetail = (id: string) => navigate({ page: 'tools', sub: 'detail', id });
  const goInventoryDetail = (id: string) => navigate({ page: 'inventory', sub: 'detail', id });
  const goRecipeDetail = (id: string) => navigate({ page: 'recipes', sub: 'detail', id });
  const goSessionDetail = (id: string) => navigate({ page: 'cooking-log', sub: 'detail', id });
  const goSharpeningDetail = (id: string) => navigate({ page: 'sharpening', sub: 'detail', id });

  const renderPage = () => {
    if (route.page === 'dashboard') return <DashboardPage onNavigate={navigate} />;
    if (route.page === 'chat') return <ChatPage />;

    if (route.page === 'tools') {
      if (route.sub === 'detail') {
        return <ToolDetailPage toolId={route.id ?? 't1'} navigate={navigate} />;
      }
      return <ToolsPage onDetail={goToolDetail} />;
    }

    if (route.page === 'inventory') {
      if (route.sub === 'detail') {
        return <InventoryDetailPage itemId={route.id ?? 'i1'} navigate={navigate} />;
      }
      return <InventoryPage onDetail={goInventoryDetail} />;
    }

    if (route.page === 'recipes') {
      if (route.sub === 'detail') {
        return <RecipeDetailPage recipeId={route.id ?? 'r1'} navigate={navigate} />;
      }
      return <RecipesPage onDetail={goRecipeDetail} />;
    }

    if (route.page === 'cooking-log') {
      if (route.sub === 'detail') {
        return <SessionDetailPage sessionId={route.id ?? 'c1'} navigate={navigate} />;
      }
      return <CookingLogPage onDetail={goSessionDetail} />;
    }

    if (route.page === 'sharpening') {
      if (route.sub === 'detail') {
        return <SharpeningDetailPage scheduleId={route.id ?? 's1'} navigate={navigate} />;
      }
      return <SharpeningPage onDetail={goSharpeningDetail} />;
    }

    if (route.page === 'settings') {
      return (
        <SettingsPage
          service="pantry"
          darkMode={mode === 'dark'}
          meshActive={meshActive}
          sidebarType={sidebarType}
          onSidebarTypeChange={setSidebarType}
          onToggleTheme={toggleTheme}
          onToggleMesh={toggleMesh}
        />
      );
    }

    return (
      <LibraryPage
        section={route.sub}
        onSectionChange={(section) => navigate({ page: 'library', sub: section })}
        navigate={navigate}
      />
    );
  };

  const pageLoadingFallback = (
    <div
      className="gc"
      style={{
        minHeight: '240px',
        display: 'grid',
        placeItems: 'center',
        fontSize: '13px',
        color: 'var(--t3)',
      }}
    >
      {tr('페이지를 불러오는 중...', 'Loading page...', 'Chargement...', 'ページを読み込み中...')}
    </div>
  );

  const sidebarOffset = sidebarType === 'rail' ? 104 : sidebarType === 'dock' ? 258 : 296;

  const bottomNavItems = [
    { id: 'dashboard', label: tr('대시보드', 'Dashboard', 'Tableau de bord', 'ダッシュボード'), icon: <span>D</span> },
    { id: 'tools', label: tr('도구', 'Tools', 'Outils', '道具'), icon: <span>T</span> },
    { id: 'inventory', label: tr('재고', 'Inventory', 'Inventaire', '在庫'), icon: <span>I</span> },
    { id: 'recipes', label: tr('레시피', 'Recipes', 'Recettes', 'レシピ'), icon: <span>R</span> },
    { id: 'settings', label: tr('설정', 'Settings', 'Paramètres', '設定'), icon: <span>G</span> },
  ];
  const bottomValue = bottomNavItems.some((item) => item.id === route.page) ? route.page : 'dashboard';

  return (
    <>
      <MeshBackground />

      <div className="demo-root">
        {sidebarType === 'classic' && (
          <GlassSidebar
            service="pantry"
            serviceName="Vitro Pantry"
            serviceIcon="V"
            items={sidebarItems}
            activeIndex={activeIndex}
            onNavigate={(index) => navigatePage(navDefs[index].id)}
            statusText={tr('데모 네비게이션', 'Demo navigation', 'Navigation démo', 'デモナビゲーション')}
            workspaceLabel={tr('Vitro 워크스페이스', 'Vitro workspace', 'Espace Vitro', 'Vitroワークスペース')}
            closeMenuLabel={tr('메뉴 닫기', 'Close menu', 'Fermer le menu', 'メニューを閉じる')}
            expandSidebarLabel={tr('사이드바 펼치기', 'Expand sidebar', 'Développer la barre latérale', 'サイドバーを展開')}
            collapseSidebarLabel={tr('사이드바 접기', 'Collapse sidebar', 'Réduire la barre latérale', 'サイドバーを折りたたむ')}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {sidebarType === 'rail' && (
          <SidebarRail
            service="pantry"
            serviceIcon="V"
            items={sidebarItems}
            activeIndex={activeIndex}
            onNavigate={(index) => navigatePage(navDefs[index].id)}
            statusText={tr('정상 동작', 'Healthy', 'Opérationnel', '正常動作')}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {sidebarType === 'sectioned' && (
          <SidebarSectioned
            service="pantry"
            serviceName="Vitro Pantry"
            subtitle={tr('섹션형 사이드바', 'Sectioned sidebar', 'Barre latérale sectionnée', 'セクション型サイドバー')}
            serviceIcon="V"
            items={sidebarItems}
            sections={sectionedSidebar}
            activeItemId={route.page}
            onNavigate={(itemId) => navigatePage(itemId as DemoPageId)}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {sidebarType === 'dock' && (
          <SidebarDock
            service="pantry"
            serviceName="Vitro Pantry"
            subtitle={tr('도크 내비게이션', 'Dock navigation', 'Navigation dock', 'ドックナビゲーション')}
            serviceIcon="V"
            items={sidebarItems}
            activeIndex={activeIndex}
            onNavigate={(index) => navigatePage(navDefs[index].id)}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        <PageLayout
          sidebarOffset={sidebarOffset}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          mobileMenuLabel={tr('메뉴 열기', 'Open menu', 'Ouvrir le menu', 'メニューを開く')}
        >
          <div className="demo-shell">
            <div className="demo-content">
              <Suspense fallback={pageLoadingFallback}>{renderPage()}</Suspense>
            </div>
          </div>
        </PageLayout>

        {isMobile && (
          <BottomNav
            items={bottomNavItems}
            value={bottomValue}
            onValueChange={(id) => navigate({ page: id as DemoPageId })}
          />
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <AppInner />
    </LocaleProvider>
  );
}
