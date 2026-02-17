import React, { useState, useCallback } from 'react';
import {
  MeshBackground,
  GlassSidebar,
  PageLayout,
  Toast,
  ThemeToggle,
  MeshToggle,
  CommandPalette,
  useTheme,
  useMesh,
  useCommandK,
  useMobile,
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

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const navIcons = [
  <Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>,
  <Icon><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></Icon>,
  <Icon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>,
  <Icon><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></Icon>,
  <Icon><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></Icon>,
  <Icon><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></Icon>,
  <Icon><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></Icon>,
  <Icon><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" /><circle cx="12" cy="12" r="3" /></Icon>,
  <Icon><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></Icon>,
];

const navLabelKeys = [
  'nav.dashboard',
  'nav.tools',
  'nav.sharpening',
  'nav.inventory',
  'nav.recipes',
  'nav.cookingLog',
  'nav.chat',
  'nav.settings',
  'nav.showcase',
];

const cmdEmojis = ['📊', '🔪', '⏱️', '📦', '📖', '📅', '💬', '⚙️', '🧩'];
const cmdShortcuts = ['G D', 'G E', 'G S', 'G P', 'G R', 'G L', 'G C', 'G T', 'G X'];

function AppInner() {
  const { mode, toggle: toggleMode } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const { t } = useLocale();
  const isMobile = useMobile();
  const [activeNav, setActiveNav] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [svc, setSvc] = useState<'pantry' | 'flux'>('pantry');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  const switchSvc = useCallback((s: 'pantry' | 'flux') => {
    setSvc(s);
    document.documentElement.dataset.svc = s;
    toast(s === 'pantry' ? '🫙 Pantry' : '⚡ Flux');
  }, [toast]);

  const navigate = useCallback((i: number) => {
    setActiveNav(i);
    setShowDetail(false);
  }, []);

  useCommandK(useCallback(() => setCmdOpen(true), []));

  const navItems = navLabelKeys.map((key, i) => ({
    icon: navIcons[i],
    label: t(key),
  }));

  const renderPage = () => {
    if (showDetail) return <DetailPage onBack={() => setShowDetail(false)} />;
    switch (activeNav) {
      case 0: return <DashboardPage />;
      case 1: return <ToolsPage onDetail={() => setShowDetail(true)} />;
      case 2: return <SharpeningPage />;
      case 3: return <InventoryPage />;
      case 4: return <RecipesPage />;
      case 5: return <CookingLogPage />;
      case 6: return <ChatPage />;
      case 7: return <SettingsPage service={svc} darkMode={mode === 'dark'} meshActive={meshActive} />;
      case 8: return <ShowcasePage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <>
      <MeshBackground />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <GlassSidebar
          service={svc}
          serviceName={svc === 'pantry' ? 'Pantry' : 'Flux'}
          serviceIcon={svc === 'pantry' ? '🫙' : '⚡'}
          items={navItems}
          activeIndex={activeNav}
          onNavigate={navigate}
          statusText={t('app.statusOk')}
          statusOk
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <PageLayout onMobileMenuOpen={() => setMobileMenuOpen(true)}>
          {renderPage()}
        </PageLayout>
      </div>

      {/* Floating Controls */}
      <div
        className="go"
        style={{
          position: 'fixed',
          bottom: isMobile ? '12px' : '20px',
          left: isMobile ? '50%' : undefined,
          right: isMobile ? undefined : '20px',
          transform: isMobile ? 'translateX(-50%)' : undefined,
          zIndex: 50,
          display: 'flex', gap: '6px', padding: '6px', borderRadius: '18px',
        }}
      >
        <ThemeToggle
          mode={mode}
          onToggle={() => { toggleMode(); toast(mode === 'light' ? t('app.toastDark') : t('app.toastLight')); }}
        />
        <CtrlBtn emoji="🫙" active={svc === 'pantry'} onClick={() => switchSvc('pantry')} />
        <CtrlBtn emoji="⚡" active={svc === 'flux'} onClick={() => switchSvc('flux')} />
        <MeshToggle
          active={meshActive}
          onToggle={() => { toggleMesh(); toast(meshActive ? '🌊 OFF' : '🌊 ON'); }}
        />
      </div>

      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        placeholder={t('app.cmdPlaceholder')}
        groups={[
          {
            label: t('app.cmdNav'),
            items: navItems.map((item, i) => ({
              id: `nav-${i}`,
              icon: cmdEmojis[i],
              label: item.label,
              shortcut: cmdShortcuts[i],
              onSelect: () => navigate(i),
            })),
          },
          {
            label: t('app.cmdActions'),
            items: [
              { id: 'sharp', icon: '✏️', label: t('app.cmdAddSharp'), shortcut: 'N S', onSelect: () => navigate(2) },
              { id: 'cook', icon: '🍳', label: t('app.cmdAddCook'), shortcut: 'N C', onSelect: () => navigate(5) },
              { id: 'tool', icon: '➕', label: t('app.cmdAddTool'), shortcut: 'N E', onSelect: () => navigate(1) },
            ],
          },
          {
            label: t('app.cmdSettings'),
            items: [
              { id: 'theme', icon: '🌙', label: t('app.cmdToggleDark'), onSelect: () => { toggleMode(); toast(mode === 'light' ? t('app.toastDark') : t('app.toastLight')); } },
              { id: 'svc', icon: '🎨', label: t('app.cmdToggleSvc'), onSelect: () => switchSvc(svc === 'pantry' ? 'flux' : 'pantry') },
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

function CtrlBtn({ emoji, active, onClick }: { emoji: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className="gi"
      onClick={onClick}
      style={{
        width: '44px', height: '44px', borderRadius: '14px', border: 'none',
        cursor: 'pointer', fontSize: '18px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
        boxShadow: active ? '0 0 0 2px var(--p500), 0 0 12px rgba(var(--gl), .22)' : undefined,
      }}
    >
      {emoji}
    </button>
  );
}
