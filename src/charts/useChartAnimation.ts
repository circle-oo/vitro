import { useMemo } from 'react';
import { useMotionMode } from '../hooks/useMotionMode';

export interface ChartAnimationConfig {
  enabled: boolean;
  duration: number;
  begin: number;
  easing: 'ease-out' | 'ease-in-out';
}

export function useChartAnimation(
  animated: boolean,
  pointCount: number,
): ChartAnimationConfig {
  const motionMode = useMotionMode();

  return useMemo(() => {
    const safePointCount = Number.isFinite(pointCount) ? Math.max(0, pointCount) : 0;
    const tooDenseToAnimate = safePointCount > 120;
    const enabled = animated && motionMode !== 'off' && !tooDenseToAnimate;
    const duration = motionMode === 'lite'
      ? 260
      : safePointCount > 60
        ? 320
        : 460;
    const begin = motionMode === 'lite' ? 0 : Math.min(90, safePointCount * 2);

    return {
      enabled,
      duration,
      begin,
      easing: motionMode === 'lite' ? 'ease-out' : 'ease-in-out',
    };
  }, [animated, motionMode, pointCount]);
}
