import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { GlassCard, Badge, TreeNav } from '@circle-oo/vitro';
import type { NavigateRoute } from '../router';
import { useTr } from '../useTr';

const GlassSection = lazy(() =>
  import('./library/GlassSection').then((m) => ({ default: m.GlassSection })),
);
const LayoutSection = lazy(() =>
  import('./library/LayoutSection').then((m) => ({ default: m.LayoutSection })),
);
const UISection = lazy(() =>
  import('./library/UISection').then((m) => ({ default: m.UISection })),
);
const DataSection = lazy(() =>
  import('./library/DataSection').then((m) => ({ default: m.DataSection })),
);
const ChartSection = lazy(() =>
  import('./library/ChartSection').then((m) => ({ default: m.ChartSection })),
);
const ChatSection = lazy(() =>
  import('./library/ChatSection').then((m) => ({ default: m.ChatSection })),
);
const FeedbackSection = lazy(() =>
  import('./library/FeedbackSection').then((m) => ({ default: m.FeedbackSection })),
);
const HookSection = lazy(() =>
  import('./library/HookSection').then((m) => ({ default: m.HookSection })),
);

interface LibraryPageProps {
  section?: string;
  node?: string;
  onSectionChange: (section: string, nodeId?: string) => void;
  navigate?: (route: NavigateRoute) => void;
}

const defaultSection = 'glass';

const sectionList = ['glass', 'layout', 'ui', 'data', 'chart', 'chat', 'feedback', 'hooks'] as const;
type SectionId = (typeof sectionList)[number];

function normalizeSection(raw?: string): SectionId {
  if (!raw) return defaultSection;
  if ((sectionList as readonly string[]).includes(raw)) return raw as SectionId;
  return defaultSection;
}

function pickSectionFromNode(nodeId: string): SectionId {
  const [head] = nodeId.split(':');
  return normalizeSection(head);
}

function normalizeNode(rawNode: string | undefined, fallbackSection: SectionId): string {
  if (!rawNode) return `${fallbackSection}:overview`;
  if (!rawNode.includes(':')) return `${normalizeSection(rawNode)}:overview`;
  const section = pickSectionFromNode(rawNode);
  return `${section}:${rawNode.split(':').slice(1).join(':')}`;
}

export function LibraryPage({ section, node, onSectionChange }: LibraryPageProps) {
  const tr = useTr();
  const routeSection = normalizeSection(section);
  const routeNode = useMemo(
    () => normalizeNode(node, routeSection),
    [node, routeSection],
  );
  const [activeNode, setActiveNode] = useState<string>(routeNode);
  const activeSection = pickSectionFromNode(activeNode);
  const [expanded, setExpanded] = useState<string[]>(sectionList.map((item) => item));

  useEffect(() => {
    setActiveNode((current) => {
      if (current === routeNode) return current;
      return routeNode;
    });
  }, [routeNode]);

  useEffect(() => {
    setExpanded((current) => {
      if (current.includes(activeSection)) return current;
      return [...current, activeSection];
    });
  }, [activeSection]);

  const treeItems = useMemo(
    () => [
      {
        id: 'glass',
        label: tr('글래스', 'Glass', 'Verre', 'ガラス'),
        badge: '3',
        children: [
          { id: 'glass:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'glass:card', label: 'GlassCard' },
          { id: 'glass:interactive', label: 'GlassInteractive' },
        ],
      },
      {
        id: 'layout',
        label: tr('레이아웃', 'Layout', 'Mise en page', 'レイアウト'),
        badge: '6',
        children: [
          { id: 'layout:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'layout:sidebars', label: tr('사이드바 변형', 'Sidebar variants', 'Variantes de barre latérale', 'サイドバー種類') },
          { id: 'layout:page-layout', label: 'PageLayout' },
        ],
      },
      {
        id: 'ui',
        label: 'UI',
        badge: '40',
        children: [
          { id: 'ui:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'ui:forms', label: tr('폼', 'Forms', 'Formulaires', 'フォーム') },
          { id: 'ui:navigation', label: tr('내비게이션', 'Navigation', 'Navigation', 'ナビゲーション') },
          { id: 'ui:overlay', label: 'Overlay' },
        ],
      },
      {
        id: 'data',
        label: tr('데이터', 'Data', 'Données', 'データ'),
        badge: '6',
        children: [
          { id: 'data:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'data:table', label: 'DataTable' },
          { id: 'data:viewer', label: tr('뷰어', 'Viewers', 'Visionneuses', 'ビューア') },
        ],
      },
      {
        id: 'chart',
        label: tr('차트', 'Chart', 'Graphiques', 'チャート'),
        badge: '8',
        children: [
          { id: 'chart:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'chart:line', label: tr('라인 / 바 / 영역', 'Line / Bar / Area', 'Ligne / Barres / Aire', 'ライン / バー / エリア') },
          { id: 'chart:pie', label: tr('파이 / 도넛', 'Pie / Donut', 'Secteur / Donut', '円 / ドーナツ') },
        ],
      },
      {
        id: 'chat',
        label: tr('채팅', 'Chat', 'Chat', 'チャット'),
        badge: '4',
        children: [
          { id: 'chat:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'chat:layout', label: tr('채팅 레이아웃', 'Chat layout', 'Disposition du chat', 'チャットレイアウト') },
        ],
      },
      {
        id: 'feedback',
        label: tr('피드백', 'Feedback', 'Retour', 'フィードバック'),
        badge: '5',
        children: [
          { id: 'feedback:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'feedback:dialogs', label: tr('다이얼로그', 'Dialogs', 'Dialogues', 'ダイアログ') },
        ],
      },
      {
        id: 'hooks',
        label: tr('훅', 'Hooks', 'Hooks', 'フック'),
        badge: '17',
        children: [
          { id: 'hooks:overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
          { id: 'hooks:toast', label: 'useToast' },
          { id: 'hooks:commandk', label: 'useCommandK' },
          { id: 'hooks:polling', label: 'usePolling / useAsyncAction' },
          { id: 'hooks:state', label: 'useControllableState' },
          { id: 'hooks:overlay', label: 'useDismissibleLayer / useOverlayPosition' },
        ],
      },
    ],
    [tr],
  );

  const sectionContent = useMemo(() => {
    if (activeSection === 'glass') return <GlassSection />;
    if (activeSection === 'layout') return <LayoutSection />;
    if (activeSection === 'ui') return <UISection />;
    if (activeSection === 'data') return <DataSection />;
    if (activeSection === 'chart') return <ChartSection />;
    if (activeSection === 'chat') return <ChatSection />;
    if (activeSection === 'feedback') return <FeedbackSection />;
    return <HookSection />;
  }, [activeSection]);

  const sectionLoadingFallback = useMemo(
    () => (
      <div
        className="gc demo-loading-fallback demo-loading-card demo-library-section-loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="demo-loading-content">
          <span className="demo-loading-dot" aria-hidden="true" />
          <span className="demo-loading-label">
            {tr(
              '섹션을 불러오는 중...',
              'Loading section...',
              'Chargement de la section...',
              'セクションを読み込み中...',
            )}
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

  const onTreeValueChange = useCallback((nodeId: string) => {
    setActiveNode(nodeId);
    const nextSection = pickSectionFromNode(nodeId);
    onSectionChange(nextSection, nodeId);
  }, [onSectionChange]);

  return (
    <div className="demo-library-layout">
      <GlassCard className="demo-library-banner" hover={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="warning">{tr('데모 전용', 'DEMO ONLY', 'DÉMO UNIQUEMENT', 'デモ専用')}</Badge>
          <strong>{tr('컴포넌트 라이브러리', 'Component Library', 'Bibliothèque de composants', 'コンポーネントライブラリ')}</strong>
        </div>
        <p className="demo-library-copy" style={{ marginBottom: 0 }}>
          {tr(
            'TreeNav 기반 브라우저로 전체 컴포넌트를 카테고리별로 탐색할 수 있습니다. 각 항목은 해시 URL(`#/library/:section/:nodeId`)로 공유됩니다.',
            'Browse all components by category through the TreeNav browser. Each entry is shareable via hash URL (`#/library/:section/:nodeId`).',
            'Parcourez tous les composants par catégorie via le navigateur TreeNav. Chaque entrée est partageable via l\'URL de hachage (`#/library/:section/:nodeId`).',
            'TreeNavブラウザでコンポーネントをカテゴリ別に閲覧できます。各項目はハッシュURL（`#/library/:section/:nodeId`）で共有できます。',
          )}
        </p>
      </GlassCard>

      <div className="demo-library-grid">
        <TreeNav
          className="demo-library-nav"
          items={treeItems}
          value={activeNode}
          expandedIds={expanded}
          onExpandedIdsChange={setExpanded}
          onValueChange={onTreeValueChange}
        />

        <div className="demo-library-content">
          <Suspense fallback={sectionLoadingFallback}>
            {sectionContent}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
