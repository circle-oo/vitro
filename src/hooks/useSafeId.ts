import { useId, useMemo } from 'react';

export function useSafeId(prefix?: string): string {
  const reactId = useId();
  const safeId = useMemo(() => reactId.replace(/:/g, ''), [reactId]);
  return prefix ? `${prefix}-${safeId}` : safeId;
}
