import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MeshBackground,
  GlassSidebar,
  SidebarRail,
  SidebarSectioned,
  SidebarDock,
  PageLayout,
  BottomNav,
  useTheme,
  useMesh,
  useMobile,
} from '@circle-oo/vitro';

import { LocaleProvider, useLocale } from './i18n';
import { useTr } from './useTr';
import { useRouter } from './router';
import type { DemoPageId } from './router';
import { hasConstrainedNetwork, schedulePreloadQueue } from './utils/preloadQueue';
import { useDemoMotionMode } from './hooks/useDemoMotionMode';

type PreloadableComponent<T extends React.ComponentType<any>> = React.LazyExoticComponent<T> & {
  preload: () => Promise<{ default: T }>;
};

function lazyWithPreload<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
): PreloadableComponent<T> {
  const component = lazy(loader) as PreloadableComponent<T>;
  component.preload = loader;
  return component;
}

const DashboardPage = lazyWithPreload(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const ChatPage = lazyWithPreload(() =>
  import('./pages/ChatPage').then((module) => ({ default: module.ChatPage })),
);
const ToolsPage = lazyWithPreload(() =>
  import('./pages/ToolsPage').then((module) => ({ default: module.ToolsPage })),
);
const InventoryPage = lazyWithPreload(() =>
  import('./pages/InventoryPage').then((module) => ({ default: module.InventoryPage })),
);
const RecipesPage = lazyWithPreload(() =>
  import('./pages/RecipesPage').then((module) => ({ default: module.RecipesPage })),
);
const CookingLogPage = lazyWithPreload(() =>
  import('./pages/CookingLogPage').then((module) => ({ default: module.CookingLogPage })),
);
const SharpeningPage = lazyWithPreload(() =>
  import('./pages/SharpeningPage').then((module) => ({ default: module.SharpeningPage })),
);
const SettingsPage = lazyWithPreload(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const LibraryPage = lazyWithPreload(() =>
  import('./pages/LibraryPage').then((module) => ({ default: module.LibraryPage })),
);

const ToolDetailPage = lazyWithPreload(() =>
  import('./pages/ToolDetailPage').then((module) => ({ default: module.ToolDetailPage })),
);
const InventoryDetailPage = lazyWithPreload(() =>
  import('./pages/InventoryDetailPage').then((module) => ({ default: module.InventoryDetailPage })),
);
const RecipeDetailPage = lazyWithPreload(() =>
  import('./pages/RecipeDetailPage').then((module) => ({ default: module.RecipeDetailPage })),
);
const SessionDetailPage = lazyWithPreload(() =>
  import('./pages/SessionDetailPage').then((module) => ({ default: module.SessionDetailPage })),
);
const SharpeningDetailPage = lazyWithPreload(() =>
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

const SECTION_ITEM_IDS = {
  core: navDefs.filter((item) => item.section === 'core').map((item) => item.id),
  kitchen: navDefs.filter((item) => item.section === 'kitchen').map((item) => item.id),
  system: navDefs.filter((item) => item.section === 'system').map((item) => item.id),
} as const;

const EAGER_PAGE_PRELOADERS: Array<() => Promise<unknown>> = [
  ToolsPage.preload,
  InventoryPage.preload,
  RecipesPage.preload,
  SettingsPage.preload,
];

const ROUTE_PRELOADERS: Record<DemoPageId, Array<() => Promise<unknown>>> = {
  dashboard: [DashboardPage.preload],
  chat: [ChatPage.preload],
  tools: [ToolsPage.preload, ToolDetailPage.preload],
  inventory: [InventoryPage.preload, InventoryDetailPage.preload],
  recipes: [RecipesPage.preload, RecipeDetailPage.preload],
  'cooking-log': [CookingLogPage.preload, SessionDetailPage.preload],
  sharpening: [SharpeningPage.preload, SharpeningDetailPage.preload],
  settings: [SettingsPage.preload],
  library: [LibraryPage.preload],
};

const DETAIL_PRELOADER_BY_PAGE = {
  tools: ToolDetailPage.preload,
  inventory: InventoryDetailPage.preload,
  recipes: RecipeDetailPage.preload,
  'cooking-log': SessionDetailPage.preload,
  sharpening: SharpeningDetailPage.preload,
} as const;

function AppInner() {
  const { t } = useLocale();
  const { mode, toggle: toggleTheme } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const isMobile = useMobile();
  const { route, navigate } = useRouter();
  const tr = useTr();

  const [sidebarType, setSidebarType] = useState<SidebarType>('sectioned');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const preloadedRef = useRef(new WeakSet<() => Promise<unknown>>());
  const constrainedNetworkRef = useRef(hasConstrainedNetwork());

  const preloadOnce = useCallback((preload: () => Promise<unknown>) => {
    if (preloadedRef.current.has(preload)) return;
    preloadedRef.current.add(preload);
    void preload().catch(() => {
      preloadedRef.current.delete(preload);
    });
  }, []);

  const preloadMany = useCallback(
    (preloaders: ReadonlyArray<() => Promise<unknown>>) => {
      for (const preload of preloaders) {
        preloadOnce(preload);
      }
    },
    [preloadOnce],
  );

  const preloadRoute = useCallback(
    (page: DemoPageId) => {
      preloadMany(ROUTE_PRELOADERS[page]);
    },
    [preloadMany],
  );

  const navigateDetail = useCallback(
    (page: keyof typeof DETAIL_PRELOADER_BY_PAGE, id: string) => {
      preloadOnce(DETAIL_PRELOADER_BY_PAGE[page]);
      navigate({ page, sub: 'detail', id });
    },
    [navigate, preloadOnce],
  );

  const navigatePage = useCallback(
    (id: DemoPageId) => {
      preloadRoute(id);
      navigate({ page: id });
    },
    [navigate, preloadRoute],
  );

  const goToolDetail = useCallback(
    (id: string) => {
      navigateDetail('tools', id);
    },
    [navigateDetail],
  );

  const goInventoryDetail = useCallback(
    (id: string) => {
      navigateDetail('inventory', id);
    },
    [navigateDetail],
  );

  const goRecipeDetail = useCallback(
    (id: string) => {
      navigateDetail('recipes', id);
    },
    [navigateDetail],
  );

  const goSessionDetail = useCallback(
    (id: string) => {
      navigateDetail('cooking-log', id);
    },
    [navigateDetail],
  );

  const goSharpeningDetail = useCallback(
    (id: string) => {
      navigateDetail('sharpening', id);
    },
    [navigateDetail],
  );

  const onLibrarySectionChange = useCallback(
    (section?: string, nodeId?: string) => {
      preloadRoute('library');
      navigate({ page: 'library', sub: section, id: nodeId });
    },
    [navigate, preloadRoute],
  );

  useEffect(() => {
    const eagerPreloaders = constrainedNetworkRef.current
      ? [ToolsPage.preload]
      : EAGER_PAGE_PRELOADERS;

    return schedulePreloadQueue(eagerPreloaders, preloadOnce, {
      initialDelayMs: 80,
      timeoutMs: 900,
      fallbackDelayMs: 70,
      batchSize: 2,
    });
  }, [preloadOnce]);

  useEffect(() => {
    preloadRoute(route.page);
  }, [preloadRoute, route.page]);

  useEffect(() => {
    if (constrainedNetworkRef.current) return;

    const currentIndex = navDefs.findIndex((item) => item.id === route.page);
    if (currentIndex < 0) return;

    const nearbyPages = [navDefs[currentIndex - 1], navDefs[currentIndex + 1]].filter(
      (item): item is NavDef => Boolean(item),
    );
    const nearby = nearbyPages.flatMap((item) => ROUTE_PRELOADERS[item.id]);

    if (nearby.length === 0) return;

    return schedulePreloadQueue(nearby, preloadOnce, {
      initialDelayMs: 220,
      timeoutMs: 1300,
      fallbackDelayMs: 120,
      batchSize: 1,
    });
  }, [preloadOnce, route.page]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route.page, route.sub, route.id]);

  const sidebarItems = useMemo(
    () => navDefs.map((item) => ({ id: item.id, icon: item.icon, label: t(item.labelKey) })),
    [t],
  );
  const motionMode = useDemoMotionMode({
    constrainedNetwork: constrainedNetworkRef.current,
    isMobile,
  });

  const sectionedSidebar = useMemo(
    () => [
      {
        id: 'core',
        label: tr('코어', 'Core', 'Base', 'コア'),
        itemIds: SECTION_ITEM_IDS.core,
      },
      {
        id: 'kitchen',
        label: tr('키친', 'Kitchen', 'Cuisine', 'キッチン'),
        itemIds: SECTION_ITEM_IDS.kitchen,
      },
      {
        id: 'system',
        label: tr('시스템', 'System', 'Système', 'システム'),
        itemIds: SECTION_ITEM_IDS.system,
      },
    ],
    [tr],
  );

  const activeIndex = Math.max(0, navDefs.findIndex((item) => item.id === route.page));
  const routeMotionKey = `${route.page}:${route.sub ?? ''}:${route.id ?? ''}`;

  const pageContent = useMemo(() => {
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
        node={route.id}
        onSectionChange={onLibrarySectionChange}
        navigate={navigate}
      />
    );
  }, [
    goInventoryDetail,
    goRecipeDetail,
    goSessionDetail,
    goSharpeningDetail,
    goToolDetail,
    meshActive,
    mode,
    navigate,
    onLibrarySectionChange,
    route.id,
    route.page,
    route.sub,
    sidebarType,
    toggleMesh,
    toggleTheme,
  ]);

  const pageLoadingFallback = useMemo(
    () => (
      <div
        className="gc demo-loading-fallback demo-loading-card"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="demo-loading-content">
          <span className="demo-loading-dot" aria-hidden="true" />
          <span className="demo-loading-label">
            {tr('페이지를 불러오는 중...', 'Loading page...', 'Chargement...', 'ページを読み込み中...')}
          </span>
        </div>
        <div className="demo-loading-bars" aria-hidden="true">
          <span className="demo-loading-bar" />
          <span className="demo-loading-bar" />
          <span className="demo-loading-bar" />
        </div>
      </div>
    ),
    [tr],
  );

  const sidebarOffset = sidebarType === 'rail' ? 104 : sidebarType === 'dock' ? 258 : 296;

  const bottomNavItems = useMemo(
    () => [
      { id: 'dashboard', label: tr('대시보드', 'Dashboard', 'Tableau de bord', 'ダッシュボード'), icon: <span>D</span> },
      { id: 'tools', label: tr('도구', 'Tools', 'Outils', '道具'), icon: <span>T</span> },
      { id: 'inventory', label: tr('재고', 'Inventory', 'Inventaire', '在庫'), icon: <span>I</span> },
      { id: 'recipes', label: tr('레시피', 'Recipes', 'Recettes', 'レシピ'), icon: <span>R</span> },
      { id: 'settings', label: tr('설정', 'Settings', 'Paramètres', '設定'), icon: <span>G</span> },
    ],
    [tr],
  );
  const bottomValue = bottomNavItems.some((item) => item.id === route.page) ? route.page : 'dashboard';

  return (
    <>
      <MeshBackground />

      <div className="demo-root" data-motion={motionMode}>
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
              <Suspense fallback={pageLoadingFallback}>
                <div key={routeMotionKey} className="demo-page-transition">
                  {pageContent}
                </div>
              </Suspense>
            </div>
          </div>
        </PageLayout>

        {isMobile && (
          <BottomNav
            items={bottomNavItems}
            value={bottomValue}
            onValueChange={(id) => navigatePage(id as DemoPageId)}
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
