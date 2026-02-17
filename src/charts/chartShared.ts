import type { VitroChartTheme } from './useVitroChartTheme';

export type ChartDatum = Record<string, unknown>;
export type DataKeyOf<T extends ChartDatum> = Extract<keyof T, string>;

export const DEFAULT_CHART_COLORS = ['var(--p500)', '#10B981', '#06B6D4', '#F43F5E', '#8B5CF6', '#F59E0B'] as const;

export const CHART_GRID_STYLE = (theme: VitroChartTheme) => ({
  strokeDasharray: '4 4',
  stroke: theme.grid,
  opacity: 0.3,
});

export const CHART_AXIS_TICK_STYLE = (theme: VitroChartTheme) => ({
  fontSize: 12,
  fill: theme.text,
});

export const CHART_Y_AXIS_WIDTH = 30;
