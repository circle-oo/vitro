import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';

interface VitroBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
  gradientId?: string;
}

export function VitroBarChart({
  data,
  dataKey,
  xKey,
  height = 200,
  gradientId = 'vitroBarGrad',
}: VitroBarChartProps) {
  const theme = useVitroChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={1} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.text }} />
        <YAxis tick={{ fontSize: 12, fill: theme.text }} width={30} />
        <Tooltip contentStyle={getTooltipStyle(theme.mode)} />
        <Bar dataKey={dataKey} fill={`url(#${gradientId})`} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
