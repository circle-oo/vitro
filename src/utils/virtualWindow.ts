export interface VirtualWindowConfig {
  enabled: boolean;
  totalCount: number;
  viewportHeight: number;
  itemHeight: number;
  overscan: number;
  scrollTop: number;
}

export interface VirtualWindowResult {
  rowsPerViewport: number;
  start: number;
  end: number;
  topSpacerHeight: number;
  bottomSpacerHeight: number;
}

export function getVirtualWindow({
  enabled,
  totalCount,
  viewportHeight,
  itemHeight,
  overscan,
  scrollTop,
}: VirtualWindowConfig): VirtualWindowResult {
  const safeItemHeight = itemHeight > 0 ? itemHeight : 1;
  const rowsPerViewport = Math.max(1, Math.ceil(viewportHeight / safeItemHeight));

  if (!enabled || totalCount <= 0) {
    return {
      rowsPerViewport,
      start: 0,
      end: totalCount,
      topSpacerHeight: 0,
      bottomSpacerHeight: 0,
    };
  }

  const safeOverscan = Math.max(0, overscan);
  const rawStart = Math.max(0, Math.floor(scrollTop / safeItemHeight) - safeOverscan);
  const maxStart = Math.max(0, totalCount - rowsPerViewport);
  const start = Math.min(rawStart, maxStart);
  const end = Math.min(totalCount, start + rowsPerViewport + safeOverscan * 2);
  const topSpacerHeight = start * safeItemHeight;
  const bottomSpacerHeight = Math.max(0, (totalCount - end) * safeItemHeight);

  return {
    rowsPerViewport,
    start,
    end,
    topSpacerHeight,
    bottomSpacerHeight,
  };
}
