import { useCallback, useMemo, useState } from 'react';
import type { DAGEdge } from './types';

const EMPTY_NODES = new Set<string>();
const EMPTY_EDGES = new Set<string>();

interface UseDAGInteractionOptions {
  edges: DAGEdge[];
  onNodeHover?: (id: string | null) => void;
}

export function useDAGInteraction({ edges, onNodeHover }: UseDAGInteractionOptions) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const adjacency = useMemo(() => {
    const nodesById = new Map<string, Set<string>>();
    const edgesById = new Map<string, Set<string>>();

    const ensureNodeSet = (id: string) => {
      const existing = nodesById.get(id);
      if (existing) return existing;
      const next = new Set<string>([id]);
      nodesById.set(id, next);
      return next;
    };

    const ensureEdgeSet = (id: string) => {
      const existing = edgesById.get(id);
      if (existing) return existing;
      const next = new Set<string>();
      edgesById.set(id, next);
      return next;
    };

    for (const edge of edges) {
      const sourceNodes = ensureNodeSet(edge.source);
      const targetNodes = ensureNodeSet(edge.target);
      sourceNodes.add(edge.target);
      targetNodes.add(edge.source);

      ensureEdgeSet(edge.source).add(edge.id);
      ensureEdgeSet(edge.target).add(edge.id);
    }

    return { nodesById, edgesById };
  }, [edges]);

  const highlight = useMemo(() => {
    if (!hoveredNodeId) {
      return {
        nodes: EMPTY_NODES,
        edges: EMPTY_EDGES,
      };
    }

    return {
      nodes: adjacency.nodesById.get(hoveredNodeId) ?? new Set<string>([hoveredNodeId]),
      edges: adjacency.edgesById.get(hoveredNodeId) ?? EMPTY_EDGES,
    };
  }, [adjacency, hoveredNodeId]);

  const setHovered = useCallback((id: string | null) => {
    setHoveredNodeId(id);
    onNodeHover?.(id);
  }, [onNodeHover]);

  return {
    hoveredNodeId,
    setHovered,
    highlightedNodeIds: highlight.nodes,
    highlightedEdgeIds: highlight.edges,
  };
}
