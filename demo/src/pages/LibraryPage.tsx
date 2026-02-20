import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { GlassCard, Badge, TreeNav } from '@circle-oo/vitro';
import { useTr } from '../useTr';
import { scrollToLibraryNodeAnchor } from './library/nodeAnchors';
import {
  createLibraryTreeItems,
  librarySectionList,
  normalizeLibraryNode,
  normalizeLibrarySection,
  pickLibrarySectionFromNode,
  type LibrarySectionId,
} from './library/treeCatalog';

type LibrarySectionComponent<T extends React.ComponentType<any>> = React.LazyExoticComponent<T> & {
  preload: () => Promise<{ default: T }>;
};

function lazyWithPreload<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
): LibrarySectionComponent<T> {
  const component = lazy(loader) as LibrarySectionComponent<T>;
  component.preload = loader;
  return component;
}

const GlassSection = lazyWithPreload(() =>
  import('./library/GlassSection').then((m) => ({ default: m.GlassSection })),
);
const LayoutSection = lazyWithPreload(() =>
  import('./library/LayoutSection').then((m) => ({ default: m.LayoutSection })),
);
const UISection = lazyWithPreload(() =>
  import('./library/UISection').then((m) => ({ default: m.UISection })),
);
const DataSection = lazyWithPreload(() =>
  import('./library/DataSection').then((m) => ({ default: m.DataSection })),
);
const ChartSection = lazyWithPreload(() =>
  import('./library/ChartSection').then((m) => ({ default: m.ChartSection })),
);
const ChatSection = lazyWithPreload(() =>
  import('./library/ChatSection').then((m) => ({ default: m.ChatSection })),
);
const FeedbackSection = lazyWithPreload(() =>
  import('./library/FeedbackSection').then((m) => ({ default: m.FeedbackSection })),
);
const HookSection = lazyWithPreload(() =>
  import('./library/HookSection').then((m) => ({ default: m.HookSection })),
);

interface LibraryPageProps {
  section?: string;
  node?: string;
  onSectionChange: (section: string, nodeId?: string) => void;
}

const SECTION_COMPONENTS: Record<LibrarySectionId, LibrarySectionComponent<React.ComponentType>> = {
  glass: GlassSection,
  layout: LayoutSection,
  ui: UISection,
  data: DataSection,
  chart: ChartSection,
  chat: ChatSection,
  feedback: FeedbackSection,
  hooks: HookSection,
};

export function LibraryPage({ section, node, onSectionChange }: LibraryPageProps) {
  const tr = useTr();
  const routeSection = normalizeLibrarySection(section);
  const routeNode = useMemo(
    () => normalizeLibraryNode(node, routeSection),
    [node, routeSection],
  );
  const [activeNode, setActiveNode] = useState<string>(routeNode);
  const activeSection = pickLibrarySectionFromNode(activeNode);
  const [expanded, setExpanded] = useState<string[]>(librarySectionList.map((item) => item));
  const overviewLabel = tr('개요', 'Overview', 'Vue d\'ensemble', '概要');

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

  useEffect(() => {
    return scrollToLibraryNodeAnchor(activeNode, {
      maxAttempts: 60,
      intervalMs: 50,
    });
  }, [activeNode]);

  useEffect(() => {
    const current = SECTION_COMPONENTS[activeSection];
    void current.preload().catch(() => {});
  }, [activeSection]);

  const treeItems = useMemo(
    () => createLibraryTreeItems(tr, overviewLabel),
    [overviewLabel, tr],
  );

  const sectionContent = useMemo(() => {
    const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];
    return <ActiveSectionComponent />;
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
    const nextSection = pickLibrarySectionFromNode(nodeId);
    void SECTION_COMPONENTS[nextSection].preload().catch(() => {});
    const normalizedNode = normalizeLibraryNode(nodeId, nextSection);
    setActiveNode(normalizedNode);
    onSectionChange(nextSection, normalizedNode);
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
