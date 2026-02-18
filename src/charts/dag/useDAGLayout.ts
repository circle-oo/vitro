import { useMemo } from 'react';
import type { DAGEdge, DAGLayoutNode, DAGLayoutResult, DAGNode, DAGStatus } from './types';

interface UseDAGLayoutOptions {
  nodes: DAGNode[];
  direction: 'TB' | 'LR';
  compact: boolean;
}

const STATUS_FALLBACK: DAGStatus = 'pending';

interface NodeMetrics {
  width: number;
  height: number;
  gapX: number;
  gapY: number;
  margin: number;
}

function getMetrics(compact: boolean): NodeMetrics {
  if (compact) {
    return {
      width: 120,
      height: 56,
      gapX: 120,
      gapY: 56,
      margin: 24,
    };
  }

  return {
    width: 160,
    height: 70,
    gapX: 180,
    gapY: 80,
    margin: 28,
  };
}

function normalizeNodes(nodes: DAGNode[]): DAGNode[] {
  const deduped = new Map<string, DAGNode>();
  for (const node of nodes) {
    deduped.set(node.id, {
      ...node,
      depends: Array.from(new Set(node.depends ?? [])),
    });
  }
  return Array.from(deduped.values());
}

function buildEdges(nodes: DAGNode[]): DAGEdge[] {
  const ids = new Set(nodes.map((node) => node.id));
  const statusById = new Map(nodes.map((node) => [node.id, (node.status ?? STATUS_FALLBACK)]));
  const edges: DAGEdge[] = [];

  for (const node of nodes) {
    for (const dep of node.depends ?? []) {
      if (!ids.has(dep)) continue;
      edges.push({
        id: `${dep}->${node.id}`,
        source: dep,
        target: node.id,
        sourceStatus: statusById.get(dep) ?? STATUS_FALLBACK,
      });
    }
  }

  return edges;
}

function layerNodes(nodes: DAGNode[], edges: DAGEdge[]): {
  layers: string[][];
  layerById: Map<string, number>;
  hasCycle: boolean;
} {
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const node of nodes) {
    incoming.set(node.id, 0);
    outgoing.set(node.id, []);
  }

  for (const edge of edges) {
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    outgoing.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [id, indegree] of incoming.entries()) {
    if (indegree === 0) queue.push(id);
  }

  const layerById = new Map<string, number>();
  for (const node of nodes) {
    layerById.set(node.id, 0);
  }

  const processed = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    processed.add(current);

    const currentLayer = layerById.get(current) ?? 0;
    for (const next of outgoing.get(current) ?? []) {
      const nextLayer = Math.max(layerById.get(next) ?? 0, currentLayer + 1);
      layerById.set(next, nextLayer);

      const nextIn = (incoming.get(next) ?? 0) - 1;
      incoming.set(next, nextIn);
      if (nextIn === 0) queue.push(next);
    }
  }

  const hasCycle = processed.size < nodes.length;
  if (hasCycle) {
    const maxLayer = Math.max(0, ...Array.from(layerById.values()));
    for (const node of nodes) {
      if (!processed.has(node.id)) {
        layerById.set(node.id, maxLayer + 1);
      }
    }
  }

  const layersMap = new Map<number, string[]>();
  for (const node of nodes) {
    const layer = layerById.get(node.id) ?? 0;
    const bucket = layersMap.get(layer) ?? [];
    bucket.push(node.id);
    layersMap.set(layer, bucket);
  }

  const layerIndexes = Array.from(layersMap.keys()).sort((a, b) => a - b);
  const layers = layerIndexes.map((layer) => {
    const ids = layersMap.get(layer) ?? [];
    ids.sort();
    return ids;
  });

  // One-pass barycenter sort to reduce obvious edge crossings.
  const parentsById = new Map<string, string[]>();
  for (const edge of edges) {
    const arr = parentsById.get(edge.target) ?? [];
    arr.push(edge.source);
    parentsById.set(edge.target, arr);
  }

  for (let i = 1; i < layers.length; i += 1) {
    const previous = layers[i - 1];
    const prevIndex = new Map(previous.map((id, idx) => [id, idx]));

    layers[i] = [...layers[i]].sort((a, b) => {
      const parentsA = parentsById.get(a) ?? [];
      const parentsB = parentsById.get(b) ?? [];

      const centerA = parentsA.length === 0
        ? Number.POSITIVE_INFINITY
        : parentsA.reduce((sum, id) => sum + (prevIndex.get(id) ?? previous.length), 0) / parentsA.length;
      const centerB = parentsB.length === 0
        ? Number.POSITIVE_INFINITY
        : parentsB.reduce((sum, id) => sum + (prevIndex.get(id) ?? previous.length), 0) / parentsB.length;

      if (centerA === centerB) return a.localeCompare(b);
      return centerA - centerB;
    });
  }

  return { layers, layerById, hasCycle };
}

function positionNodes(
  nodes: DAGNode[],
  layers: string[][],
  layerById: Map<string, number>,
  direction: 'TB' | 'LR',
  metrics: NodeMetrics,
): Pick<DAGLayoutResult, 'nodes' | 'width' | 'height'> {
  const { width, height, gapX, gapY, margin } = metrics;
  const byId = new Map(nodes.map((node) => [node.id, node]));

  const positioned: DAGLayoutNode[] = [];

  for (const [layerIndex, layer] of layers.entries()) {
    for (const [order, nodeId] of layer.entries()) {
      const source = byId.get(nodeId);
      if (!source) continue;

      if (direction === 'TB') {
        const centerOffset = order - (layer.length - 1) / 2;
        positioned.push({
          ...source,
          status: source.status ?? STATUS_FALLBACK,
          width,
          height,
          layer: layerById.get(nodeId) ?? layerIndex,
          order,
          x: centerOffset * gapX,
          y: layerIndex * gapY,
        });
      } else {
        const centerOffset = order - (layer.length - 1) / 2;
        positioned.push({
          ...source,
          status: source.status ?? STATUS_FALLBACK,
          width,
          height,
          layer: layerById.get(nodeId) ?? layerIndex,
          order,
          x: layerIndex * gapX,
          y: centerOffset * gapY,
        });
      }
    }
  }

  if (positioned.length === 0) {
    return { nodes: [], width: margin * 2, height: margin * 2 };
  }

  const minX = Math.min(...positioned.map((node) => node.x));
  const minY = Math.min(...positioned.map((node) => node.y));

  const shifted = positioned.map((node) => ({
    ...node,
    x: node.x - minX + margin,
    y: node.y - minY + margin,
  }));

  const maxX = Math.max(...shifted.map((node) => node.x + node.width));
  const maxY = Math.max(...shifted.map((node) => node.y + node.height));

  return {
    nodes: shifted,
    width: maxX + margin,
    height: maxY + margin,
  };
}

export function useDAGLayout({
  nodes,
  direction,
  compact,
}: UseDAGLayoutOptions): DAGLayoutResult {
  return useMemo(() => {
    if (nodes.length === 0) {
      return {
        nodes: [],
        edges: [],
        width: 0,
        height: 0,
        hasCycle: false,
      };
    }

    const normalizedNodes = normalizeNodes(nodes);
    const edges = buildEdges(normalizedNodes);
    const { layers, layerById, hasCycle } = layerNodes(normalizedNodes, edges);
    const positioned = positionNodes(normalizedNodes, layers, layerById, direction, getMetrics(compact));

    return {
      nodes: positioned.nodes,
      edges,
      width: positioned.width,
      height: positioned.height,
      hasCycle,
    };
  }, [compact, direction, nodes]);
}
