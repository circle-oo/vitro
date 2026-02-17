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
} from '@circle-oo/vitro';

import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { SharpeningPage } from './pages/SharpeningPage';
import { InventoryPage } from './pages/InventoryPage';
import { RecipesPage } from './pages/RecipesPage';
import { CookingLogPage } from './pages/CookingLogPage';
import { ChatPage } from './pages/ChatPage';
import { DetailPage } from './pages/DetailPage';
import { ShowcasePage } from './pages/ShowcasePage';

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const navItems = [
  {
    icon: <Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>,
    label: '대시보드',
  },
  {
    icon: <Icon><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></Icon>,
    label: '도구 관리',
  },
  {
    icon: <Icon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>,
    label: '연마 트래커',
  },
  {
    icon: <Icon><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></Icon>,
    label: '재고',
  },
  {
    icon: <Icon><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></Icon>,
    label: '레시피',
  },
  {
    icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></Icon>,
    label: '요리 기록',
  },
  {
    icon: <Icon><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></Icon>,
    label: 'AI 채팅',
  },
  {
    icon: <Icon><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></Icon>,
    label: 'Showcase',
  },
];

export default function App() {
  const { mode, toggle: toggleMode } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const [activeNav, setActiveNav] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [svc, setSvc] = useState<'pantry' | 'flux'>('pantry');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

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
      case 7: return <ShowcasePage />;
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
          statusText="시스템 정상"
          statusOk
        />

        <PageLayout>
          {renderPage()}
        </PageLayout>
      </div>

      {/* Floating Controls */}
      <div
        className="go"
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 50,
          display: 'flex', gap: '6px', padding: '6px', borderRadius: '18px',
        }}
      >
        <ThemeToggle
          mode={mode}
          onToggle={() => { toggleMode(); toast(mode === 'light' ? '🌙 다크' : '☀️ 라이트'); }}
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
        placeholder="명령어 검색..."
        groups={[
          {
            label: '네비게이션',
            items: navItems.map((item, i) => ({
              id: `nav-${i}`,
              icon: ['📊', '🔪', '⏱️', '📦', '📖', '📅', '💬', '🧩'][i],
              label: item.label,
              shortcut: ['G D', 'G E', 'G S', 'G P', 'G R', 'G L', 'G C', 'G X'][i],
              onSelect: () => navigate(i),
            })),
          },
          {
            label: '액션',
            items: [
              { id: 'sharp', icon: '✏️', label: '연마 기록 추가', shortcut: 'N S', onSelect: () => navigate(2) },
              { id: 'cook', icon: '🍳', label: '요리 기록 추가', shortcut: 'N C', onSelect: () => navigate(5) },
              { id: 'tool', icon: '➕', label: '도구 추가', shortcut: 'N E', onSelect: () => navigate(1) },
            ],
          },
          {
            label: '설정',
            items: [
              { id: 'theme', icon: '🌙', label: '다크 모드 전환', onSelect: () => { toggleMode(); toast(mode === 'light' ? '🌙 다크' : '☀️ 라이트'); } },
              { id: 'svc', icon: '🎨', label: '서비스 테마 전환', onSelect: () => switchSvc(svc === 'pantry' ? 'flux' : 'pantry') },
            ],
          },
        ]}
      />
    </>
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
