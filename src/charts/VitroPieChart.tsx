import React from 'react';
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getTooltipStyle, useVitroChartTheme } from './useVitroChartTheme';
import { DEFAULT_CHART_COLORS, type ChartDatum, type DataKeyOf } from './chartShared';

export interface VitroPieChartProps<T extends ChartDatum = ChartDatum> {
  data: T[];
  nameKey: DataKeyOf<T>;
  valueKey: DataKeyOf<T>;
  height?: number;
  colors?: string[];
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLegend?: boolean;
  centerLabel?: React.ReactNode;
  centerSubLabel?: React.ReactNode;
}

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export function VitroPieChart<T extends ChartDatum = ChartDatum>({
  data,
  nameKey,
  valueKey,
  height = 220,
  colors = [...DEFAULT_CHART_COLORS],
  innerRadius = 0,
  outerRadius = '80%',
  showLegend = true,
  centerLabel,
  centerSubLabel,
}: VitroPieChartProps<T>) {
  const theme = useVitroChartTheme();
  const hasCenterLabel = centerLabel != null || centerSubLabel != null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          nameKey={nameKey}
          dataKey={valueKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={String((entry as Record<string, unknown>).color ?? colors[index % colors.length])}
            />
          ))}

          {hasCenterLabel && (
            <Label
              position="center"
              content={() => (
                <g>
                  {centerLabel != null && (
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={theme.text}>
                      <tspan style={{ fontSize: 18, fontWeight: 700 }}>{String(centerLabel)}</tspan>
                    </text>
                  )}
                  {centerSubLabel != null && (
                    <text
                      x="50%"
                      y="50%"
                      dy={18}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={theme.textFaint}
                    >
                      <tspan style={{ fontSize: 11, fontWeight: 500 }}>{String(centerSubLabel)}</tspan>
                    </text>
                  )}
                </g>
              )}
            />
          )}
        </Pie>
        <Tooltip
          formatter={(val: unknown) => toNumber(val)}
          contentStyle={getTooltipStyle(theme.mode)}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: theme.text,
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

export const VittoPieChart = VitroPieChart;
