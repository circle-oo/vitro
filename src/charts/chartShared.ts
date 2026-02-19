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

export interface ChartTooltipTextStyle {
  itemStyle: {
    color: string;
    fontSize: number;
    fontWeight: number;
  };
  labelStyle: {
    color: string;
    fontSize: number;
    fontWeight: number;
  };
}

export function getChartTooltipTextStyle(mode: VitroChartTheme['mode']): ChartTooltipTextStyle {
  return {
    itemStyle: {
      color: mode === 'light' ? '#111827' : '#F8FAFC',
      fontSize: 12,
      fontWeight: 300,
    },
    labelStyle: {
      color: mode === 'light' ? '#6B7280' : '#CBD5E1',
      fontSize: 11,
      fontWeight: 300,
    },
  };
}
