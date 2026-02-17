import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  MeshBackground,
  GlassCard,
  Toast,
  Badge,
  CommandPalette,
  useTheme,
  useMesh,
  useCommandK,
} from '@circle-oo/vitro';

import { LocaleProvider, useLocale } from './i18n';
import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { SharpeningPage } from './pages/SharpeningPage';
import { InventoryPage } from './pages/InventoryPage';
import { RecipesPage } from './pages/RecipesPage';
import { CookingLogPage } from './pages/CookingLogPage';
import { ChatPage } from './pages/ChatPage';
import { DetailPage } from './pages/DetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShowcasePage } from './pages/ShowcasePage';

type Service = 'pantry' | 'flux';

type NavItemId =
  | 'dashboard'
  | 'tools'
  | 'sharpening'
  | 'inventory'
  | 'recipes'
  | 'log'
  | 'chat'
  | 'settings'
  | 'showcase';

type NavGroupId = 'overview' | 'ops' | 'cook' | 'assistant' | 'system';

interface NavDef {
  id: NavItemId;
  labelKey: string;
  icon: React.ReactNode;
}

interface NavGroupDef {
  id: NavGroupId;
  icon: string;
  label: { ko: string; en: string };
  items: NavItemId[];
}

const navDefs: NavDef[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <span>D</span> },
  { id: 'tools', labelKey: 'nav.tools', icon: <span>T</span> },
  { id: 'sharpening', labelKey: 'nav.sharpening', icon: <span>S</span> },
  { id: 'inventory', labelKey: 'nav.inventory', icon: <span>I</span> },
  { id: 'recipes', labelKey: 'nav.recipes', icon: <span>R</span> },
  { id: 'log', labelKey: 'nav.cookingLog', icon: <span>L</span> },
  { id: 'chat', labelKey: 'nav.chat', icon: <span>C</span> },
  { id: 'settings', labelKey: 'nav.settings', icon: <span>G</span> },
  { id: 'showcase', labelKey: 'nav.showcase', icon: <span>X</span> },
];

const navGroups: NavGroupDef[] = [
  { id: 'overview', icon: 'OV', label: { ko: '개요', en: 'Overview' }, items: ['dashboard', 'showcase'] },
  { id: 'ops', icon: 'OP', label: { ko: '운영', en: 'Operations' }, items: ['tools', 'sharpening', 'inventory'] },
  { id: 'cook', icon: 'CK', label: { ko: '조리', en: 'Cooking' }, items: ['recipes', 'log'] },
  { id: 'assistant', icon: 'AI', label: { ko: '어시스턴트', en: 'Assistant' }, items: ['chat'] },
  { id: 'system', icon: 'SY', label: { ko: '시스템', en: 'System' }, items: ['settings'] },
];

function AppInner() {
  const { mode, toggle: toggleMode } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const { locale, setLocale, t } = useLocale();
  const tr = useCallback((ko: string, en: string) => (locale === 'ko' ? ko : en), [locale]);

  const [activeGroup, setActiveGroup] = useState<NavGroupId>('overview');
  const [activeNav, setActiveNav] = useState<NavItemId>('dashboard');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [svc, setSvc] = useState<Service>('pantry');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.svc = svc;
  }, [svc]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  const switchSvc = useCallback(
    (s: Service) => {
      setSvc(s);
      toast(s === 'pantry' ? tr('Pantry 팔레트 적용', 'Pantry palette applied') : tr('Flux 팔레트 적용', 'Flux palette applied'));
    },
    [toast, tr],
  );

  const groupByNav = useMemo(() => {
    const map: Record<NavItemId, NavGroupId> = {
      dashboard: 'overview',
      showcase: 'overview',
      tools: 'ops',
      sharpening: 'ops',
      inventory: 'ops',
      recipes: 'cook',
      log: 'cook',
      chat: 'assistant',
      settings: 'system',
    };
    return map;
  }, []);

  const selectGroup = useCallback(
    (groupId: NavGroupId) => {
      setActiveGroup(groupId);
      const targetGroup = navGroups.find((g) => g.id === groupId);
      if (targetGroup && !targetGroup.items.includes(activeNav)) {
        setActiveNav(targetGroup.items[0]);
      }
      setShowDetail(false);
    },
    [activeNav],
  );

  const selectNav = useCallback(
    (navId: NavItemId) => {
      setActiveNav(navId);
      setActiveGroup(groupByNav[navId]);
      setShowDetail(false);
    },
    [groupByNav],
  );

  const activeNavDef = navDefs.find((item) => item.id === activeNav) ?? navDefs[0];
  const activeTitle = t(activeNavDef.labelKey);
  const activeGroupDef = navGroups.find((group) => group.id === activeGroup) ?? navGroups[0];

  useCommandK(useCallback(() => setCmdOpen(true), []));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        const idx = Number(e.key);
        if (idx >= 1 && idx <= navGroups.length) {
          e.preventDefault();
          selectGroup(navGroups[idx - 1].id);
          return;
        }
      }

      if (e.altKey && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        const idx = Number(e.key);
        if (idx >= 1 && idx <= navDefs.length) {
          e.preventDefault();
          selectNav(navDefs[idx - 1].id);
          return;
        }
      }

      if (!e.metaKey && !e.ctrlKey && !e.altKey && (e.key === '[' || e.key === ']')) {
        const tabs = activeGroupDef.items;
        const currentIndex = tabs.indexOf(activeNav);
        if (currentIndex < 0) return;
        e.preventDefault();
        const nextIndex =
          e.key === ']'
            ? (currentIndex + 1) % tabs.length
            : (currentIndex - 1 + tabs.length) % tabs.length;
        selectNav(tabs[nextIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGroupDef, activeNav, selectGroup, selectNav]);

  const renderPage = () => {
    if (showDetail) return <DetailPage onBack={() => setShowDetail(false)} />;

    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tools':
        return <ToolsPage onDetail={() => setShowDetail(true)} />;
      case 'sharpening':
        return <SharpeningPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'log':
        return <CookingLogPage />;
      case 'chat':
        return <ChatPage />;
      case 'settings':
        return <SettingsPage service={svc} darkMode={mode === 'dark'} meshActive={meshActive} />;
      case 'showcase':
        return <ShowcasePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <MeshBackground />

      <div className="demo-root">
        <aside className="gs demo-rail" aria-label={tr('기본 내비게이션', 'Primary navigation')}>
          <div className="demo-rail-brand">{svc === 'pantry' ? 'P' : 'F'}</div>
          <div className="demo-rail-groups">
            {navGroups.map((group) => {
              const active = group.id === activeGroup;
              return (
                <button
                  key={group.id}
                  className={`demo-rail-btn ${active ? 'is-active' : ''}`}
                  onClick={() => selectGroup(group.id)}
                  aria-label={locale === 'ko' ? group.label.ko : group.label.en}
                  title={locale === 'ko' ? group.label.ko : group.label.en}
                >
                  <span className="demo-rail-idx">{group.icon}</span>
                  <span className="demo-rail-name">{locale === 'ko' ? group.label.ko : group.label.en}</span>
                </button>
              );
            })}
          </div>
          <div className="demo-rail-status">
            <span className="demo-dot" />
          </div>
        </aside>

        <main className="demo-main">
          <div className="demo-shell">
            <GlassCard className="demo-context" hover={false}>
              <div className="demo-context-head">
                <Badge variant="primary">{locale === 'ko' ? activeGroupDef.label.ko : activeGroupDef.label.en}</Badge>
                <span className="demo-context-hint">
                  {tr('Alt+1~5 그룹 이동 / Alt+Shift+1~9 페이지 이동 / [ ] 탭 순환', 'Alt+1~5 group / Alt+Shift+1~9 page / [ ] cycle tabs')}
                </span>
              </div>
              <div className="demo-context-tabs">
                {activeGroupDef.items.map((navId) => {
                  const def = navDefs.find((item) => item.id === navId);
                  if (!def) return null;
                  const active = navId === activeNav;
                  return (
                    <button
                      key={navId}
                      className={`demo-context-tab-btn ${active ? 'is-active' : ''}`}
                      onClick={() => selectNav(navId)}
                    >
                      {t(def.labelKey)}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="demo-workbar" hover={false}>
              <div className="demo-workbar-left">
                <div className="demo-workbar-title">
                  {tr('현재 화면', 'Active View')}: {activeTitle}
                </div>
                <div className="demo-workbar-copy">
                  {tr('커맨드 팔레트', 'Command palette')}: <strong>Cmd/Ctrl + K</strong>
                </div>
              </div>

              <div className="demo-workbar-right">
                <Badge variant="info">{meshActive ? tr('메시 활성', 'Mesh enabled') : tr('메시 정지', 'Mesh paused')}</Badge>
                <Badge variant="success">{mode === 'dark' ? tr('다크 모드', 'Dark mode') : tr('라이트 모드', 'Light mode')}</Badge>
              </div>
            </GlassCard>

            <div className="demo-toolbar">
              <div className="demo-toolbar-left">
                <div className="demo-toolbar-copy">
                  {tr('서비스와 언어를 빠르게 전환해 같은 화면을 비교하세요.', 'Switch service and locale to compare the same surface quickly.')}
                </div>
              </div>

              <div className="demo-toolbar-right">
                <div className="demo-service-switch">
                  <button
                    className={`demo-service-button ${svc === 'pantry' ? 'is-active' : ''}`}
                    onClick={() => switchSvc('pantry')}
                  >
                    Pantry
                  </button>
                  <button
                    className={`demo-service-button ${svc === 'flux' ? 'is-active' : ''}`}
                    onClick={() => switchSvc('flux')}
                  >
                    Flux
                  </button>
                </div>
                <div className="demo-service-switch">
                  <button
                    className={`demo-service-button ${locale === 'ko' ? 'is-active' : ''}`}
                    onClick={() => setLocale('ko')}
                  >
                    KO
                  </button>
                  <button
                    className={`demo-service-button ${locale === 'en' ? 'is-active' : ''}`}
                    onClick={() => setLocale('en')}
                  >
                    EN
                  </button>
                </div>
                <div className="demo-service-switch">
                  <button
                    className="demo-service-button"
                    onClick={() => {
                      toggleMode();
                      toast(mode === 'light' ? t('app.toastDark') : t('app.toastLight'));
                    }}
                    aria-label={tr('모드 전환', 'Toggle mode')}
                  >
                    {mode === 'light' ? tr('다크', 'Dark') : tr('라이트', 'Light')}
                  </button>
                  <button
                    className={`demo-service-button ${meshActive ? 'is-active' : ''}`}
                    onClick={() => {
                      toggleMesh();
                      toast(meshActive ? tr('메시 애니메이션 비활성화', 'Mesh animation disabled') : tr('메시 애니메이션 활성화', 'Mesh animation enabled'));
                    }}
                    aria-label={tr('메시 토글', 'Toggle mesh')}
                  >
                    {tr('메시', 'Mesh')}
                  </button>
                </div>
              </div>
            </div>

            <div className="demo-content">{renderPage()}</div>
          </div>
        </main>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        placeholder={t('app.cmdPlaceholder')}
        groups={[
          {
            label: t('app.cmdNav'),
            items: navDefs.map((item, index) => ({
              id: `nav-${item.id}`,
              icon: item.icon,
              label: t(item.labelKey),
              shortcut: `G ${index + 1}`,
              onSelect: () => selectNav(item.id),
            })),
          },
          {
            label: t('app.cmdActions'),
            items: [
              {
                id: 'new-tool',
                icon: '+',
                label: t('app.cmdAddTool'),
                shortcut: 'N T',
                onSelect: () => selectNav('tools'),
              },
              {
                id: 'new-sharpening',
                icon: '+',
                label: t('app.cmdAddSharp'),
                shortcut: 'N S',
                onSelect: () => selectNav('sharpening'),
              },
              {
                id: 'new-cook',
                icon: '+',
                label: t('app.cmdAddCook'),
                shortcut: 'N C',
                onSelect: () => selectNav('log'),
              },
            ],
          },
          {
            label: t('app.cmdSettings'),
            items: [
              {
                id: 'toggle-theme',
                icon: mode === 'light' ? 'M' : 'L',
                label: t('app.cmdToggleDark'),
                onSelect: () => {
                  toggleMode();
                  toast(mode === 'light' ? t('app.toastDark') : t('app.toastLight'));
                },
              },
              {
                id: 'toggle-service',
                icon: 'S',
                label: t('app.cmdToggleSvc'),
                onSelect: () => switchSvc(svc === 'pantry' ? 'flux' : 'pantry'),
              },
              {
                id: 'toggle-mesh',
                icon: 'W',
                label: tr('메시 배경 전환', 'Toggle mesh background'),
                onSelect: () => {
                  toggleMesh();
                  toast(meshActive ? tr('메시 애니메이션 비활성화', 'Mesh animation disabled') : tr('메시 애니메이션 활성화', 'Mesh animation enabled'));
                },
              },
            ],
          },
        ]}
      />
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
