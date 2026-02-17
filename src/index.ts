// ─── Layout ───
export { MeshBackground } from './components/layout/MeshBackground';
export { GlassSidebar } from './components/layout/GlassSidebar';
export { PageLayout } from './components/layout/PageLayout';

// ─── Glass ───
export { GlassCard } from './components/glass/GlassCard';
export { GlassOverlay } from './components/glass/GlassOverlay';
export { GlassInteractive } from './components/glass/GlassInteractive';

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

// ─── Feedback ───
export { LoadingState } from './components/feedback/LoadingState';
export { EmptyState } from './components/feedback/EmptyState';
export { ErrorBanner } from './components/feedback/ErrorBanner';
export { ConfirmDialog } from './components/feedback/ConfirmDialog';

// ─── Data ───
export { StatCard } from './components/data/StatCard';
export { DataTable } from './components/data/DataTable';
export { Timeline } from './components/data/Timeline';
export { JsonViewer } from './components/data/JsonViewer';
export { MarkdownViewer } from './components/data/MarkdownViewer';
export { LogViewer } from './components/data/LogViewer';
export type { LogColumn, LogFilterOption } from './components/data/LogViewer';

// ─── Chat ───
export { ChatLayout } from './components/chat/ChatLayout';
export { ChatBubble } from './components/chat/ChatBubble';
export { ToolCallCard } from './components/chat/ToolCallCard';
export { ChatInput } from './components/chat/ChatInput';

// ─── Navigation ───
export { CommandPalette } from './components/CommandPalette';
export { ThemeToggle } from './components/ThemeToggle';
export { MeshToggle } from './components/MeshToggle';

// ─── Charts ───
export { VitroAreaChart } from './charts/VitroAreaChart';
export { VitroBarChart } from './charts/VitroBarChart';
export { VitroHBarChart } from './charts/VitroHBarChart';
export { VitroSparkline } from './charts/VitroSparkline';
export { VitroHeatmap } from './charts/VitroHeatmap';
export { VitroLineChart } from './charts/VitroLineChart';
export { useVitroChartTheme } from './charts/useVitroChartTheme';

// ─── Hooks ───
export { useTheme } from './hooks/useTheme';
export { useMesh } from './hooks/useMesh';
export { useCommandK } from './hooks/useCommandK';
export { useMediaQuery, useMobile } from './hooks/useMediaQuery';

// ─── Utils ───
export { cn } from './utils/cn';
export { formatDate, formatRelative } from './utils/format';
