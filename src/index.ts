// ─── Layout ───
export { MeshBackground } from './components/layout/MeshBackground';
export { GlassSidebar } from './components/layout/GlassSidebar';
export { SidebarRail } from './components/layout/SidebarRail';
export { SidebarSectioned } from './components/layout/SidebarSectioned';
export { SidebarDock } from './components/layout/SidebarDock';
export { PageLayout } from './components/layout/PageLayout';
export type { MeshBackgroundProps } from './components/layout/MeshBackground';
export type { GlassSidebarProps, SidebarNavItem } from './components/layout/GlassSidebar';
export type { SidebarRailProps } from './components/layout/SidebarRail';
export type { SidebarSectionedProps, SidebarSection } from './components/layout/SidebarSectioned';
export type { SidebarDockProps } from './components/layout/SidebarDock';
export type { PageLayoutProps } from './components/layout/PageLayout';

// ─── Glass ───
export { GlassCard } from './components/glass/GlassCard';
export { GlassOverlay } from './components/glass/GlassOverlay';
export { GlassInteractive } from './components/glass/GlassInteractive';
export type { GlassCardProps } from './components/glass/GlassCard';
export type { GlassOverlayProps } from './components/glass/GlassOverlay';
export type { GlassInteractiveProps } from './components/glass/GlassInteractive';

// ─── UI ───
export { Button } from './components/ui/Button';
export { Badge } from './components/ui/Badge';
export { Input } from './components/ui/Input';
export { Checkbox } from './components/ui/Checkbox';
export { FilterChips } from './components/ui/FilterChips';
export { ProgressBar } from './components/ui/ProgressBar';
export { Toast } from './components/ui/Toast';
export { Modal } from './components/ui/Modal';
export { Tabs } from './components/ui/Tabs';
export { PageHeader } from './components/ui/PageHeader';
export { StatusDot } from './components/ui/StatusDot';
export { Kbd } from './components/ui/Kbd';
export { Select } from './components/ui/Select';
export { Textarea } from './components/ui/Textarea';
export { IconButton } from './components/ui/IconButton';
export { Switch, Toggle } from './components/ui/Switch';
export { SegmentedControl } from './components/ui/SegmentedControl';
export { BottomNav } from './components/ui/BottomNav';
export { TreeNav } from './components/ui/TreeNav';
export { Tooltip } from './components/ui/Tooltip';
export { DropdownMenu } from './components/ui/DropdownMenu';
export { Avatar } from './components/ui/Avatar';
export { AvatarGroup } from './components/ui/Avatar';
export { Skeleton, SkeletonText } from './components/ui/Skeleton';
export { Breadcrumb } from './components/ui/Breadcrumb';
export { Popover } from './components/ui/Popover';
export { RadioGroup } from './components/ui/RadioGroup';
export { Separator, Divider } from './components/ui/Separator';
export { Accordion, Collapsible } from './components/ui/Accordion';
export { DatePicker } from './components/ui/DatePicker';
export { Slider } from './components/ui/Slider';
export { TagInput } from './components/ui/TagInput';
export { Stepper, Wizard } from './components/ui/Stepper';
export { FormField } from './components/ui/FormField';
export { Combobox } from './components/ui/Combobox';
export { Pagination } from './components/ui/Pagination';
export { Alert } from './components/ui/Alert';
export { Drawer } from './components/ui/Drawer';
export { useOverlayPosition } from './components/ui/useOverlayPosition';
export type { ButtonProps } from './components/ui/Button';
export type { BadgeProps } from './components/ui/Badge';
export type { InputProps } from './components/ui/Input';
export type { CheckboxProps } from './components/ui/Checkbox';
export type { FilterChipsProps, FilterChipOption } from './components/ui/FilterChips';
export type { ProgressBarProps } from './components/ui/ProgressBar';
export type { ToastProps } from './components/ui/Toast';
export type { ModalProps } from './components/ui/Modal';
export type { TabsProps, TabsTab } from './components/ui/Tabs';
export type { PageHeaderProps } from './components/ui/PageHeader';
export type { StatusDotProps } from './components/ui/StatusDot';
export type { KbdProps } from './components/ui/Kbd';
export type { SelectProps } from './components/ui/Select';
export type { TextareaProps } from './components/ui/Textarea';
export type { IconButtonProps } from './components/ui/IconButton';
export type { SwitchProps } from './components/ui/Switch';
export type { SegmentedControlProps, SegmentedOption } from './components/ui/SegmentedControl';
export type { BottomNavProps, BottomNavItem } from './components/ui/BottomNav';
export type { TreeNavProps, TreeNavItem } from './components/ui/TreeNav';
export type { TooltipProps } from './components/ui/Tooltip';
export type { DropdownMenuProps, DropdownMenuItem, DropdownMenuGroup } from './components/ui/DropdownMenu';
export type { AvatarProps, AvatarGroupProps } from './components/ui/Avatar';
export type { SkeletonProps, SkeletonTextProps } from './components/ui/Skeleton';
export type { BreadcrumbProps, BreadcrumbItem } from './components/ui/Breadcrumb';
export type { PopoverProps } from './components/ui/Popover';
export type { RadioGroupProps, RadioOption } from './components/ui/RadioGroup';
export type { SeparatorProps } from './components/ui/Separator';
export type { AccordionProps, AccordionItem, CollapsibleProps } from './components/ui/Accordion';
export type { DatePickerProps, DatePickerSize, DatePickerVariant } from './components/ui/DatePicker';
export type { SliderProps } from './components/ui/Slider';
export type { TagInputProps } from './components/ui/TagInput';
export type { StepperProps, StepperStep, WizardProps, WizardStep } from './components/ui/Stepper';
export type { FormFieldProps } from './components/ui/FormField';
export type { ComboboxProps, ComboboxOption } from './components/ui/Combobox';
export type { PaginationProps } from './components/ui/Pagination';
export type { AlertProps } from './components/ui/Alert';
export type { DrawerProps } from './components/ui/Drawer';
export type { UseOverlayPositionOptions, UseOverlayPositionResult, OverlaySide, OverlayAlign } from './components/ui/useOverlayPosition';

// ─── Feedback ───
export { LoadingState } from './components/feedback/LoadingState';
export { EmptyState } from './components/feedback/EmptyState';
export { ErrorBanner } from './components/feedback/ErrorBanner';
export { ConfirmDialog } from './components/feedback/ConfirmDialog';
export type { LoadingStateProps } from './components/feedback/LoadingState';
export type { EmptyStateProps } from './components/feedback/EmptyState';
export type { ErrorBannerProps } from './components/feedback/ErrorBanner';
export type { ConfirmDialogProps } from './components/feedback/ConfirmDialog';

// ─── Data ───
export { StatCard } from './components/data/StatCard';
export { DataTable } from './components/data/DataTable';
export { Timeline } from './components/data/Timeline';
export { JsonViewer } from './components/data/JsonViewer';
export { MarkdownViewer } from './components/data/MarkdownViewer';
export { LogViewer } from './components/data/LogViewer';
export type { StatCardProps } from './components/data/StatCard';
export type { DataTableProps, DataTableColumn } from './components/data/DataTable';
export type { TimelineProps, TimelineEntry } from './components/data/Timeline';
export type { JsonViewerProps } from './components/data/JsonViewer';
export type { MarkdownViewerProps } from './components/data/MarkdownViewer';
export type { LogViewerProps, LogColumn, LogFilterOption } from './components/data/LogViewer';

// ─── Chat ───
export { ChatLayout } from './components/chat/ChatLayout';
export { ChatBubble } from './components/chat/ChatBubble';
export { ToolCallCard } from './components/chat/ToolCallCard';
export { ChatInput } from './components/chat/ChatInput';
export type { ChatLayoutProps } from './components/chat/ChatLayout';
export type { ChatBubbleProps } from './components/chat/ChatBubble';
export type { ToolCallCardProps } from './components/chat/ToolCallCard';
export type { ChatInputProps } from './components/chat/ChatInput';

// ─── Navigation ───
export { CommandPalette } from './components/CommandPalette';
export { ThemeToggle } from './components/ThemeToggle';
export { MeshToggle } from './components/MeshToggle';
export type { CommandPaletteProps, CommandGroup, CommandItem } from './components/CommandPalette';
export type { ThemeToggleProps } from './components/ThemeToggle';
export type { MeshToggleProps } from './components/MeshToggle';

// ─── Charts ───
export { VitroAreaChart } from './charts/VitroAreaChart';
export { VitroBarChart } from './charts/VitroBarChart';
export { VitroHBarChart } from './charts/VitroHBarChart';
export { VitroSparkline } from './charts/VitroSparkline';
export { VitroHeatmap } from './charts/VitroHeatmap';
export { VitroLineChart } from './charts/VitroLineChart';
export { VitroPieChart, VittoPieChart } from './charts/VitroPieChart';
export { VitroDonutChart } from './charts/VitroDonutChart';
export { VitroDAG } from './charts/VitroDAG';
export { useVitroChartTheme } from './charts/useVitroChartTheme';
export type { VitroAreaChartProps } from './charts/VitroAreaChart';
export type { VitroBarChartProps } from './charts/VitroBarChart';
export type { VitroHBarChartProps, HBarItem } from './charts/VitroHBarChart';
export type { VitroSparklineProps } from './charts/VitroSparkline';
export type { VitroHeatmapProps, HeatmapEntry } from './charts/VitroHeatmap';
export type { VitroLineChartProps, LineDef } from './charts/VitroLineChart';
export type { VitroPieChartProps } from './charts/VitroPieChart';
export type { VitroDonutChartProps } from './charts/VitroDonutChart';
export type { VitroDAGProps } from './charts/VitroDAG';
export type { DAGNode, DAGStatus } from './charts/dag/types';
export type { VitroChartTheme } from './charts/useVitroChartTheme';
export type { ChartDatum, DataKeyOf } from './charts/chartShared';

// ─── Hooks ───
export { useTheme } from './hooks/useTheme';
export { useMesh } from './hooks/useMesh';
export { useLocale } from './hooks/useLocale';
export { useCommandK } from './hooks/useCommandK';
export { useMediaQuery, useMobile } from './hooks/useMediaQuery';
export { useMotionMode, useReducedMotion } from './hooks/useMotionMode';
export { useClickOutside } from './hooks/useClickOutside';
export { useDebounce } from './hooks/useDebounce';
export { useEscapeKey } from './hooks/useEscapeKey';
export { useBodyScrollLock } from './hooks/useBodyScrollLock';
export { useControllableState } from './hooks/useControllableState';
export { useDismissibleLayer } from './hooks/useDismissibleLayer';
export { usePolling } from './hooks/usePolling';
export { useAsyncAction } from './hooks/useAsyncAction';
export { useToast, ToastProvider, ToastViewport } from './hooks/useToast';
export { useHashRouter, parseHashRoute, toHashPath } from './hooks/useHashRouter';
export type { ThemeMode } from './hooks/useTheme';
export type { MotionMode } from './hooks/useMotionMode';
export type { ToastVariant, ToastPosition, ToastOptions, ToastItem, UseToastResult, ToastProviderProps, ToastViewportProps } from './hooks/useToast';
export type { UseAsyncActionResult } from './hooks/useAsyncAction';
export type { UsePollingOptions } from './hooks/usePolling';
export type { UseEscapeKeyOptions } from './hooks/useEscapeKey';
export type { HashRoute, UseHashRouterOptions, UseHashRouterResult } from './hooks/useHashRouter';

// ─── Utils ───
export { cn } from './utils/cn';
export { formatDate, formatRelative, formatTime, formatDateTime, formatIsoDateTime, formatDateText } from './utils/format';
export { resolveLocalized } from './utils/locale';
export type { Locale, LocalizedText } from './utils/locale';
