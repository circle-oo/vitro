import React, { useEffect, useId, useMemo } from 'react';
import { cn } from '../utils/cn';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { DAGLegend } from './dag/DAGLegend';
import { DAGEdgePath } from './dag/DAGEdge';
import { DAGNodeCard } from './dag/DAGNode';
import { useDAGInteraction } from './dag/useDAGInteraction';
import { useDAGLayout } from './dag/useDAGLayout';
import type { DAGNode } from './dag/types';

export interface VitroDAGProps {
  nodes: DAGNode[];
  height?: number;
  className?: string;
  onNodeClick?: (id: string) => void;
  onNodeHover?: (id: string | null) => void;
  renderNode?: (node: DAGNode, isHovered: boolean) => React.ReactNode;
  direction?: 'TB' | 'LR';
  compact?: boolean;
  showLegend?: boolean;
}

const DEFAULT_HEIGHT = 240;

export function VitroDAG({
  nodes,
  height = DEFAULT_HEIGHT,
  className,
  onNodeClick,
  onNodeHover,
  renderNode,
  direction = 'TB',
  compact = false,
  showLegend = true,
}: VitroDAGProps) {
  const markerId = useId().replace(/:/g, '');
  const mobile = useMediaQuery('(max-width: 768px)');

  const compactMode = compact || mobile || nodes.length >= 100;
  const legendVisible = showLegend && !mobile;

  const layout = useDAGLayout({
    nodes,
    compact: compactMode,
    direction,
  });

  useEffect(() => {
    if (layout.hasCycle) {
      console.warn('[VitroDAG] Cyclic dependencies detected. Nodes in cycles were pushed to the last layer.');
    }
  }, [layout.hasCycle]);

  const {
    hoveredNodeId,
    setHovered,
    highlightedNodeIds,
    highlightedEdgeIds,
  } = useDAGInteraction({
    edges: layout.edges,
    onNodeHover,
  });

  const nodesById = useMemo(
    () => new Map(layout.nodes.map((node) => [node.id, node])),
    [layout.nodes],
  );

  if (nodes.length === 0) {
    return null;
  }

  const graphHeight = Math.max(layout.height, height - (legendVisible ? 34 : 0));

  return (
    <div className={cn(className)} style={{ display: 'grid', gap: legendVisible ? '10px' : undefined }}>
      <div
        className="gc nh"
        style={{
          padding: 0,
          height,
          overflow: 'auto',
        }}
      >
        <div
          className="vitro-dag"
          style={{
            position: 'relative',
            minWidth: Math.max(320, layout.width),
            minHeight: graphHeight,
          }}
        >
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: graphHeight,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <defs>
              <marker
                id={markerId}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 6 3.5 L 0 7 z" fill="var(--t4)" />
              </marker>
            </defs>

            {layout.edges.map((edge) => {
              const source = nodesById.get(edge.source);
              const target = nodesById.get(edge.target);
              if (!source || !target) return null;

              const dimmed = hoveredNodeId != null && !highlightedEdgeIds.has(edge.id);

              return (
                <DAGEdgePath
                  key={edge.id}
                  edge={edge}
                  source={source}
                  target={target}
                  direction={direction}
                  markerId={markerId}
                  dimmed={dimmed}
                />
              );
            })}
          </svg>

          {layout.nodes.map((node) => {
            const hovered = node.id === hoveredNodeId;
            const dimmed = hoveredNodeId != null && !highlightedNodeIds.has(node.id);

            return (
              <DAGNodeCard
                key={node.id}
                node={node}
                compact={compactMode}
                hovered={hovered}
                dimmed={dimmed}
                onNodeClick={onNodeClick}
                onHover={setHovered}
                renderNode={renderNode}
              />
            );
          })}
        </div>
      </div>

      {legendVisible && <DAGLegend />}
    </div>
  );
}
