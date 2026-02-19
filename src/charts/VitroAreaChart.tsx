import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSafeId } from '../hooks/useSafeId';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';
import { useChartAnimation } from './useChartAnimation';
import {
  CHART_AXIS_TICK_STYLE,
  CHART_GRID_STYLE,
  CHART_Y_AXIS_WIDTH,
  getChartTooltipTextStyle,
  type ChartDatum,
  type DataKeyOf,
} from './chartShared';

export interface VitroAreaChartProps<T extends ChartDatum = ChartDatum> {
  data: T[];
  dataKey: DataKeyOf<T>;
  xKey: DataKeyOf<T>;
  height?: number;
  gradientId?: string;
  animated?: boolean;
}

export function VitroAreaChart<T extends ChartDatum = ChartDatum>({
  data,
  dataKey,
  xKey,
  height = 180,
  gradientId,
  animated = false,
}: VitroAreaChartProps<T>) {
  const autoGradientId = useSafeId('vitroAreaGrad');
  const resolvedGradientId = gradientId ?? autoGradientId;
  const theme = useVitroChartTheme();
  const chartAnimation = useChartAnimation(animated, data.length);
  const tooltipTextStyle = getChartTooltipTextStyle(theme.mode);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={resolvedGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_GRID_STYLE(theme)} />
        <XAxis dataKey={xKey} tick={CHART_AXIS_TICK_STYLE(theme)} />
        <YAxis tick={CHART_AXIS_TICK_STYLE(theme)} width={CHART_Y_AXIS_WIDTH} />
        <Tooltip
          contentStyle={getTooltipStyle(theme.mode)}
          itemStyle={tooltipTextStyle.itemStyle}
          labelStyle={tooltipTextStyle.labelStyle}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={theme.primary}
          strokeWidth={2.5}
          fill={`url(#${resolvedGradientId})`}
          dot={{ r: 3, fill: theme.primary }}
          activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={chartAnimation.enabled}
          animationBegin={chartAnimation.begin}
          animationDuration={chartAnimation.duration}
          animationEasing={chartAnimation.easing}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
