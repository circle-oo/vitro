import type { TreeNavItem } from '@circle-oo/vitro';

export const defaultLibrarySection = 'glass' as const;
export const librarySectionList = ['glass', 'layout', 'ui', 'data', 'chart', 'chat', 'feedback', 'hooks'] as const;

export type LibrarySectionId = (typeof librarySectionList)[number];

export type LibraryTranslate = (
  ko: string,
  en: string,
  fr: string,
  ja: string,
) => string;

export function normalizeLibrarySection(raw?: string): LibrarySectionId {
  if (!raw) return defaultLibrarySection;
  if ((librarySectionList as readonly string[]).includes(raw)) return raw as LibrarySectionId;
  return defaultLibrarySection;
}

export function pickLibrarySectionFromNode(nodeId: string): LibrarySectionId {
  const [head] = nodeId.split(':');
  return normalizeLibrarySection(head);
}

export function normalizeLibraryNode(rawNode: string | undefined, fallbackSection: LibrarySectionId): string {
  if (!rawNode) return `${fallbackSection}:overview`;
  if (!rawNode.includes(':')) return `${normalizeLibrarySection(rawNode)}:overview`;
  const section = pickLibrarySectionFromNode(rawNode);
  return `${section}:${rawNode.split(':').slice(1).join(':')}`;
}

export function createLibraryTreeItems(tr: LibraryTranslate, overviewLabel: string): TreeNavItem[] {
  const createSection = (
    id: string,
    label: string,
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
}
