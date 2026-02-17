import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';

interface VitroAreaChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
  gradientId?: string;
}

export function VitroAreaChart({
  data,
  dataKey,
  xKey,
  height = 180,
  gradientId = 'vitroAreaGrad',
}: VitroAreaChartProps) {
  const theme = useVitroChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.text }} />
        <YAxis tick={{ fontSize: 12, fill: theme.text }} width={30} />
        <Tooltip contentStyle={getTooltipStyle(theme.mode)} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={theme.primary}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={{ r: 3, fill: theme.primary }}
          activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
