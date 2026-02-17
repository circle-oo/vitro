import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';
import {
  CHART_AXIS_TICK_STYLE,
  CHART_GRID_STYLE,
  CHART_Y_AXIS_WIDTH,
  DEFAULT_CHART_COLORS,
  type ChartDatum,
  type DataKeyOf,
} from './chartShared';

export interface LineDef<T extends ChartDatum = ChartDatum> {
  dataKey: DataKeyOf<T>;
  color?: string;
  dashed?: boolean;
}

export interface VitroLineChartProps<T extends ChartDatum = ChartDatum> {
  data: T[];
  lines: LineDef<T>[];
  xKey: DataKeyOf<T>;
  height?: number;
}

export function VitroLineChart<T extends ChartDatum = ChartDatum>({
  data,
  lines,
  xKey,
  height = 180,
}: VitroLineChartProps<T>) {
  const theme = useVitroChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid {...CHART_GRID_STYLE(theme)} />
        <XAxis dataKey={xKey} tick={CHART_AXIS_TICK_STYLE(theme)} />
        <YAxis tick={CHART_AXIS_TICK_STYLE(theme)} width={CHART_Y_AXIS_WIDTH} />
        <Tooltip
          contentStyle={getTooltipStyle(theme.mode)}
          itemStyle={{
            color: theme.mode === 'light' ? '#111827' : '#F8FAFC',
            fontSize: 12,
            fontWeight: 600,
          }}
          labelStyle={{
            color: theme.mode === 'light' ? '#6B7280' : '#CBD5E1',
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        {lines.map((line, i) => {
          const color = line.color ?? DEFAULT_CHART_COLORS[i % DEFAULT_CHART_COLORS.length];
          return (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={color}
              strokeWidth={2.5}
              strokeDasharray={line.dashed ? '6 3' : undefined}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
