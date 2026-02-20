import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { GlassCard, Badge, TreeNav } from '@circle-oo/vitro';
import type { TreeNavItem } from '@circle-oo/vitro';
import { useTr } from '../useTr';
import { scrollToLibraryNodeAnchor } from './library/nodeAnchors';

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

const defaultSection = 'glass';

const sectionList = ['glass', 'layout', 'ui', 'data', 'chart', 'chat', 'feedback', 'hooks'] as const;
type SectionId = (typeof sectionList)[number];
const SECTION_COMPONENTS: Record<SectionId, LibrarySectionComponent<React.ComponentType>> = {
  glass: GlassSection,
  layout: LayoutSection,
  ui: UISection,
  data: DataSection,
  chart: ChartSection,
  chat: ChatSection,
  feedback: FeedbackSection,
  hooks: HookSection,
};

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

  const treeItems = useMemo<TreeNavItem[]>(
    () => {
      const createSection = (
        id: string,
        label: React.ReactNode,
        children: TreeNavItem[],
      ): TreeNavItem => ({
        id,
        label,
        badge: String(children.filter((item) => !item.id.endsWith(':overview')).length),
        children,
      });

      return [
        createSection('glass', tr('글래스', 'Glass', 'Verre', 'ガラス'), [
          { id: 'glass:overview', label: overviewLabel },
          { id: 'glass:card', label: 'GlassCard' },
          { id: 'glass:overlay', label: 'GlassOverlay' },
          { id: 'glass:interactive', label: 'GlassInteractive' },
        ]),
        createSection('layout', tr('레이아웃', 'Layout', 'Mise en page', 'レイアウト'), [
          { id: 'layout:overview', label: overviewLabel },
          { id: 'layout:mesh-background', label: 'MeshBackground' },
          { id: 'layout:glass-sidebar', label: 'GlassSidebar' },
          { id: 'layout:sidebar-rail', label: 'SidebarRail' },
          { id: 'layout:sidebar-sectioned', label: 'SidebarSectioned' },
          { id: 'layout:sidebar-dock', label: 'SidebarDock' },
          { id: 'layout:page-layout', label: 'PageLayout' },
        ]),
        createSection('ui', 'UI', [
          { id: 'ui:overview', label: overviewLabel },
          { id: 'ui:button', label: 'Button' },
          { id: 'ui:icon-button', label: 'IconButton' },
          { id: 'ui:badge', label: 'Badge' },
          { id: 'ui:status-dot', label: 'StatusDot' },
          { id: 'ui:kbd', label: 'Kbd' },
          { id: 'ui:page-header', label: 'PageHeader' },
          { id: 'ui:input', label: 'Input' },
          { id: 'ui:select', label: 'Select' },
          { id: 'ui:textarea', label: 'Textarea' },
          { id: 'ui:form-field', label: 'FormField' },
          { id: 'ui:combobox', label: 'Combobox' },
          { id: 'ui:date-picker', label: 'DatePicker' },
          { id: 'ui:slider', label: 'Slider' },
          { id: 'ui:tag-input', label: 'TagInput' },
          { id: 'ui:checkbox', label: 'Checkbox' },
          { id: 'ui:switch', label: 'Switch' },
          { id: 'ui:toggle', label: 'Toggle' },
          { id: 'ui:filter-chips', label: 'FilterChips' },
          { id: 'ui:segmented-control', label: 'SegmentedControl' },
          { id: 'ui:radio-group', label: 'RadioGroup' },
          { id: 'ui:tabs', label: 'Tabs' },
          { id: 'ui:breadcrumb', label: 'Breadcrumb' },
          { id: 'ui:bottom-nav', label: 'BottomNav' },
          { id: 'ui:tree-nav', label: 'TreeNav' },
          { id: 'ui:tooltip', label: 'Tooltip' },
          { id: 'ui:popover', label: 'Popover' },
          { id: 'ui:dropdown-menu', label: 'DropdownMenu' },
          { id: 'ui:toast', label: 'Toast' },
          { id: 'ui:modal', label: 'Modal' },
          { id: 'ui:drawer', label: 'Drawer' },
          { id: 'ui:separator', label: 'Separator' },
          { id: 'ui:divider', label: 'Divider' },
          { id: 'ui:accordion', label: 'Accordion' },
          { id: 'ui:collapsible', label: 'Collapsible' },
          { id: 'ui:avatar', label: 'Avatar' },
          { id: 'ui:avatar-group', label: 'AvatarGroup' },
          { id: 'ui:skeleton', label: 'Skeleton' },
          { id: 'ui:skeleton-text', label: 'SkeletonText' },
          { id: 'ui:progress-bar', label: 'ProgressBar' },
          { id: 'ui:stepper', label: 'Stepper' },
          { id: 'ui:wizard', label: 'Wizard' },
          { id: 'ui:pagination', label: 'Pagination' },
          { id: 'ui:alert', label: 'Alert' },
        ]),
        createSection('data', tr('데이터', 'Data', 'Données', 'データ'), [
          { id: 'data:overview', label: overviewLabel },
          { id: 'data:stat-card', label: 'StatCard' },
          { id: 'data:data-table', label: 'DataTable' },
          { id: 'data:timeline', label: 'Timeline' },
          { id: 'data:json-viewer', label: 'JsonViewer' },
          { id: 'data:markdown-viewer', label: 'MarkdownViewer' },
          { id: 'data:log-viewer', label: 'LogViewer' },
        ]),
        createSection('chart', tr('차트', 'Chart', 'Graphiques', 'チャート'), [
          { id: 'chart:overview', label: overviewLabel },
          { id: 'chart:vitro-area-chart', label: 'VitroAreaChart' },
          { id: 'chart:vitro-bar-chart', label: 'VitroBarChart' },
          { id: 'chart:vitro-hbar-chart', label: 'VitroHBarChart' },
          { id: 'chart:vitro-line-chart', label: 'VitroLineChart' },
          { id: 'chart:vitro-pie-chart', label: 'VitroPieChart' },
          { id: 'chart:vitto-pie-chart', label: 'VittoPieChart (alias)' },
          { id: 'chart:vitro-donut-chart', label: 'VitroDonutChart' },
          { id: 'chart:vitro-sparkline', label: 'VitroSparkline' },
          { id: 'chart:vitro-heatmap', label: 'VitroHeatmap' },
          { id: 'chart:vitro-dag', label: 'VitroDAG' },
        ]),
        createSection('chat', tr('채팅', 'Chat', 'Chat', 'チャット'), [
          { id: 'chat:overview', label: overviewLabel },
          { id: 'chat:chat-layout', label: 'ChatLayout' },
          { id: 'chat:chat-bubble', label: 'ChatBubble' },
          { id: 'chat:tool-call-card', label: 'ToolCallCard' },
          { id: 'chat:chat-input', label: 'ChatInput' },
        ]),
        createSection('feedback', tr('피드백', 'Feedback', 'Retour', 'フィードバック'), [
          { id: 'feedback:overview', label: overviewLabel },
          { id: 'feedback:loading-state', label: 'LoadingState' },
          { id: 'feedback:empty-state', label: 'EmptyState' },
          { id: 'feedback:error-banner', label: 'ErrorBanner' },
          { id: 'feedback:alert', label: 'Alert' },
          { id: 'feedback:confirm-dialog', label: 'ConfirmDialog' },
        ]),
        createSection('hooks', tr('훅', 'Hooks', 'Hooks', 'フック'), [
          { id: 'hooks:overview', label: overviewLabel },
          { id: 'hooks:theme-toggle', label: 'ThemeToggle' },
          { id: 'hooks:mesh-toggle', label: 'MeshToggle' },
          { id: 'hooks:command-palette', label: 'CommandPalette' },
          { id: 'hooks:use-theme', label: 'useTheme / useMesh / useLocale' },
          { id: 'hooks:use-command-k', label: 'useCommandK' },
          { id: 'hooks:use-media-query', label: 'useMediaQuery / useMobile' },
          { id: 'hooks:use-motion-mode', label: 'useMotionMode / useReducedMotion' },
          { id: 'hooks:use-click-outside', label: 'useClickOutside' },
          { id: 'hooks:use-debounce', label: 'useDebounce' },
          { id: 'hooks:use-escape-key', label: 'useEscapeKey' },
          { id: 'hooks:use-body-scroll-lock', label: 'useBodyScrollLock' },
          { id: 'hooks:use-controllable-state', label: 'useControllableState' },
          { id: 'hooks:use-dismissible-layer', label: 'useDismissibleLayer' },
          { id: 'hooks:use-overlay-position', label: 'useOverlayPosition' },
          { id: 'hooks:use-polling', label: 'usePolling / useAsyncAction' },
          { id: 'hooks:use-toast', label: 'useToast / ToastProvider / ToastViewport' },
          { id: 'hooks:use-hash-router', label: 'useHashRouter / parseHashRoute / toHashPath' },
          { id: 'hooks:resolve-localized', label: 'resolveLocalized' },
          { id: 'hooks:cn', label: 'cn' },
          { id: 'hooks:format-date', label: 'formatDate / formatRelative' },
          { id: 'hooks:format-date-time', label: 'formatDateTime / formatIsoDateTime / formatDateText' },
        ]),
      ];
    },
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
    const nextSection = pickSectionFromNode(nodeId);
    void SECTION_COMPONENTS[nextSection].preload().catch(() => {});
    const normalizedNode = normalizeNode(nodeId, nextSection);
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
