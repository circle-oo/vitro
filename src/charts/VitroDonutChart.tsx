import React, { useMemo } from 'react';
import { type ChartDatum, type DataKeyOf } from './chartShared';
import { VitroPieChart } from './VitroPieChart';

export interface VitroDonutChartProps<T extends ChartDatum = ChartDatum> {
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

export function VitroDonutChart<T extends ChartDatum = ChartDatum>({
  data,
  nameKey,
  valueKey,
  height = 240,
  colors,
  innerRadius = '58%',
  outerRadius = '82%',
  showLegend = true,
  centerLabel,
  centerSubLabel,
}: VitroDonutChartProps<T>) {
  const total = useMemo(
    () => data.reduce((acc, row) => acc + toNumber(row[valueKey]), 0),
    [data, valueKey],
  );

  return (
    <VitroPieChart
      data={data}
      nameKey={nameKey}
      valueKey={valueKey}
      height={height}
      colors={colors}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      showLegend={showLegend}
      centerLabel={centerLabel ?? total}
      centerSubLabel={centerSubLabel}
    />
  );
}
