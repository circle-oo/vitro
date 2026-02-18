import React, { useId } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';
import {
  CHART_AXIS_TICK_STYLE,
  CHART_GRID_STYLE,
  CHART_Y_AXIS_WIDTH,
  type ChartDatum,
  type DataKeyOf,
} from './chartShared';

export interface VitroBarChartProps<T extends ChartDatum = ChartDatum> {
  data: T[];
  dataKey: DataKeyOf<T>;
  xKey: DataKeyOf<T>;
  height?: number;
  gradientId?: string;
  animated?: boolean;
}

export function VitroBarChart<T extends ChartDatum = ChartDatum>({
  data,
  dataKey,
  xKey,
  height = 200,
  gradientId,
  animated = false,
}: VitroBarChartProps<T>) {
  const autoGradientId = useId().replace(/:/g, '');
  const resolvedGradientId = gradientId ?? `vitroBarGrad-${autoGradientId}`;
  const theme = useVitroChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <defs>
          <linearGradient id={resolvedGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={1} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_GRID_STYLE(theme)} />
        <XAxis dataKey={xKey} tick={CHART_AXIS_TICK_STYLE(theme)} />
        <YAxis tick={CHART_AXIS_TICK_STYLE(theme)} width={CHART_Y_AXIS_WIDTH} />
        <Tooltip
          contentStyle={getTooltipStyle(theme.mode)}
          itemStyle={{
            color: theme.mode === 'light' ? '#111827' : '#F8FAFC',
            fontSize: 12,
            fontWeight: 300,
          }}
          labelStyle={{
            color: theme.mode === 'light' ? '#6B7280' : '#CBD5E1',
            fontSize: 11,
            fontWeight: 300,
          }}
        />
        <Bar
          dataKey={dataKey}
          fill={`url(#${resolvedGradientId})`}
          radius={[4, 4, 0, 0]}
          isAnimationActive={animated}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
