import React from 'react';
import type { DAGEdge, DAGLayoutNode, DAGStatus } from './types';

interface DAGEdgePathProps {
  edge: DAGEdge;
  source: DAGLayoutNode;
  target: DAGLayoutNode;
  direction: 'TB' | 'LR';
  markerId: string;
  dimmed: boolean;
}

const edgeColor: Record<DAGStatus, string> = {
  completed: 'var(--ok)',
  running: 'var(--warn)',
  pending: 'var(--t4)',
  failed: 'var(--err)',
  cancelled: 'var(--t4)',
};

function toBezierPath(
  source: DAGLayoutNode,
  target: DAGLayoutNode,
  direction: 'TB' | 'LR',
): string {
  if (direction === 'TB') {
    const sx = source.x + source.width / 2;
    const sy = source.y + source.height;
    const tx = target.x + target.width / 2;
    const ty = target.y;
    const cp = Math.max(20, (ty - sy) * 0.5);

    return `M ${sx} ${sy} C ${sx} ${sy + cp}, ${tx} ${ty - cp}, ${tx} ${ty}`;
  }

  const sx = source.x + source.width;
  const sy = source.y + source.height / 2;
  const tx = target.x;
  const ty = target.y + target.height / 2;
  const cp = Math.max(20, (tx - sx) * 0.5);

  return `M ${sx} ${sy} C ${sx + cp} ${sy}, ${tx - cp} ${ty}, ${tx} ${ty}`;
}

export const DAGEdgePath = React.memo(function DAGEdgePath({
  edge,
  source,
  target,
  direction,
  markerId,
  dimmed,
}: DAGEdgePathProps) {
  const running = edge.sourceStatus === 'running';

  return (
    <path
      d={toBezierPath(source, target, direction)}
      fill="none"
      stroke={edgeColor[edge.sourceStatus]}
      strokeWidth={1.5}
      markerEnd={`url(#${markerId})`}
      style={{
        opacity: dimmed ? 0.25 : 0.96,
        transition: 'opacity .15s var(--ease), stroke .15s var(--ease)',
        strokeDasharray: running ? '6 3' : undefined,
        animation: running ? 'vitro-dag-dash 1s linear infinite' : undefined,
      }}
      aria-hidden="true"
    />
  );
});

DAGEdgePath.displayName = 'DAGEdgePath';
