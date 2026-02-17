import React, { Suspense, lazy, useMemo, useState } from 'react';
import {
  MeshBackground,
  GlassCard,
  GlassSidebar,
  SidebarRail,
  SidebarSectioned,
  SidebarDock,
  PageLayout,
  Badge,
  FilterChips,
  useTheme,
  useMesh,
} from '@circle-oo/vitro';

import { LocaleProvider, useLocale } from './i18n';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const ToolsPage = lazy(() =>
  import('./pages/ToolsPage').then((module) => ({ default: module.ToolsPage })),
);
const RecipesPage = lazy(() =>
  import('./pages/RecipesPage').then((module) => ({ default: module.RecipesPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const ShowcasePage = lazy(() =>
  import('./pages/ShowcasePage').then((module) => ({ default: module.ShowcasePage })),
);

type SidebarType = 'classic' | 'rail' | 'sectioned' | 'dock';
type NavId = 'showcase' | 'dashboard' | 'tools' | 'recipes' | 'settings';

interface NavDef {
  id: NavId;
  labelKey: string;
  icon: React.ReactNode;
}

const navDefs: NavDef[] = [
  { id: 'showcase', labelKey: 'nav.showcase', icon: <span>S</span> },
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <span>D</span> },
  { id: 'tools', labelKey: 'nav.tools', icon: <span>T</span> },
  { id: 'recipes', labelKey: 'nav.recipes', icon: <span>R</span> },
  { id: 'settings', labelKey: 'nav.settings', icon: <span>G</span> },
];

function AppInner() {
  const { locale, t } = useLocale();
  const { mode } = useTheme();
  const { active: meshActive } = useMesh();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const demoOnlyLabel = tr('DEMO 전용', 'DEMO ONLY');

  const [activeNav, setActiveNav] = useState<NavId>('showcase');
  const [sidebarType, setSidebarType] = useState<SidebarType>('classic');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarTypeOptions = [
    { id: 'classic' as const, label: tr('클래식', 'Classic') },
    { id: 'rail' as const, label: tr('레일', 'Rail') },
    { id: 'sectioned' as const, label: tr('섹션형', 'Sectioned') },
    { id: 'dock' as const, label: tr('도크형', 'Dock') },
  ];

  const currentSidebarLabel = sidebarTypeOptions.find((option) => option.id === sidebarType)?.label ?? sidebarTypeOptions[0].label;

  const sidebarItems = useMemo(
    () => navDefs.map((item) => ({ id: item.id, icon: item.icon, label: t(item.labelKey), onClick: () => setActiveNav(item.id) })),
    [t],
  );

  const activeIndex = navDefs.findIndex((item) => item.id === activeNav);
  const activeTitle = t(navDefs[Math.max(0, activeIndex)]?.labelKey ?? 'nav.showcase');

  const sectionedSidebar = useMemo(
    () => [
      { id: 'core', label: tr('핵심', 'Core'), itemIds: ['showcase', 'dashboard'] },
      { id: 'workflows', label: tr('워크플로', 'Workflows'), itemIds: ['tools', 'recipes'] },
      { id: 'system', label: tr('시스템', 'System'), itemIds: ['settings'] },
    ],
    [locale],
  );

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
      {tr('페이지를 불러오는 중...', 'Loading page...')}
    </div>
  );

  const renderPage = () => {
    if (activeNav === 'dashboard') return <DashboardPage />;
    if (activeNav === 'tools') return <ToolsPage />;
    if (activeNav === 'recipes') return <RecipesPage />;
    if (activeNav === 'settings') {
      return <SettingsPage service="pantry" darkMode={mode === 'dark'} meshActive={meshActive} />;
    }
    return <ShowcasePage />;
  };

  const sidebarOffset = sidebarType === 'rail' ? 104 : sidebarType === 'dock' ? 258 : 296;

  return (
    <>
      <MeshBackground />

      <div className="demo-root">
        {sidebarType === 'classic' && (
          <GlassSidebar
            service="pantry"
            serviceName="Vitro Demo"
            serviceIcon="V"
            items={sidebarItems}
            activeIndex={activeIndex}
            onNavigate={(index) => {
              setActiveNav(navDefs[index].id);
              setMobileMenuOpen(false);
            }}
            statusText={tr('사이드바 컴포넌트 검증 중', 'Sidebar components under validation')}
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
            onNavigate={(index) => {
              setActiveNav(navDefs[index].id);
              setMobileMenuOpen(false);
            }}
            statusText={tr('정상 동작', 'Healthy')}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {sidebarType === 'sectioned' && (
          <SidebarSectioned
            service="pantry"
            serviceName="Vitro Demo"
            serviceIcon="V"
            items={sidebarItems}
            sections={sectionedSidebar}
            activeItemId={activeNav}
            onNavigate={(itemId) => {
              setActiveNav(itemId as NavId);
              setMobileMenuOpen(false);
            }}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {sidebarType === 'dock' && (
          <SidebarDock
            service="pantry"
            serviceName="Vitro Demo"
            serviceIcon="V"
            items={sidebarItems}
            activeIndex={activeIndex}
            onNavigate={(index) => {
              setActiveNav(navDefs[index].id);
              setMobileMenuOpen(false);
            }}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        <PageLayout sidebarOffset={sidebarOffset} onMobileMenuOpen={() => setMobileMenuOpen(true)}>
          <div className="demo-shell">
            <GlassCard className="demo-demoonly-note" hover={false}>
              <div className="demo-demoonly-head">
                <Badge variant="warning">{demoOnlyLabel}</Badge>
                <span className="demo-demoonly-title">{tr('데모 쉘 안내', 'Demo shell notice')}</span>
              </div>
              <p className="demo-demoonly-copy">
                {tr(
                  '아래 사이드바 타입 전환과 샘플 페이지 라우팅은 데모 편의 기능입니다. 새 프로젝트 시작 시에는 필요한 컴포넌트만 선택해 조합하세요.',
                  'Sidebar-type switch and sample page routing below are demo conveniences. When starting a real project, compose only the components you need.',
                )}
              </p>
            </GlassCard>

            <GlassCard className="demo-workbar" hover={false}>
              <div className="demo-workbar-left">
                <div className="demo-workbar-title">
                  {tr('현재 화면', 'Active View')}: {activeTitle}
                </div>
                <div className="demo-workbar-copy">
                  {tr('사이드바 타입을 바꾸며 동일 페이지를 비교하세요.', 'Switch sidebar type and compare the same page.')}
                </div>
              </div>

              <div className="demo-workbar-right" style={{ minWidth: 'min(420px, 100%)' }}>
                <Badge variant="warning">{demoOnlyLabel}</Badge>
                <FilterChips
                  options={sidebarTypeOptions.map((option) => option.label)}
                  value={currentSidebarLabel}
                  onChange={(label) => {
                    const matched = sidebarTypeOptions.find((option) => option.label === label);
                    if (!matched) return;
                    setSidebarType(matched.id);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </GlassCard>

            <div className="demo-toolbar">
              <div className="demo-toolbar-left">
                <div className="demo-toolbar-copy">
                  {tr('사이드바는 Vitro 레이아웃 컴포넌트로 제공됩니다.', 'Sidebars are now first-class Vitro layout components.')}
                </div>
              </div>

              <div className="demo-toolbar-right">
                <Badge variant="info">{tr('사이드바 타입', 'Sidebar type')}: {currentSidebarLabel}</Badge>
                <Badge variant="success">{tr('페이지 수', 'Pages')}: {navDefs.length}</Badge>
              </div>
            </div>

            <div className="demo-content">
              <Suspense fallback={pageLoadingFallback}>
                {renderPage()}
              </Suspense>
            </div>
          </div>
        </PageLayout>
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
