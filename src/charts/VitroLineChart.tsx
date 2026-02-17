import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';

const defaultColors = ['var(--p500)', '#F59E0B', '#10B981', '#F43F5E', '#8B5CF6'];

interface LineDef {
  dataKey: string;
  color?: string;
  dashed?: boolean;
}

interface VitroLineChartProps {
  data: Record<string, unknown>[];
  lines: LineDef[];
  xKey: string;
  height?: number;
}

export function VitroLineChart({ data, lines, xKey, height = 180 }: VitroLineChartProps) {
  const theme = useVitroChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.text }} />
        <YAxis tick={{ fontSize: 12, fill: theme.text }} width={30} />
        <Tooltip contentStyle={getTooltipStyle(theme.mode)} />
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color ?? defaultColors[i % defaultColors.length]}
            strokeWidth={2.5}
            strokeDasharray={line.dashed ? '6 3' : undefined}
            dot={{ r: 3, fill: line.color ?? defaultColors[i % defaultColors.length] }}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
