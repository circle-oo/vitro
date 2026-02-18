export type DAGStatus = 'completed' | 'running' | 'pending' | 'failed' | 'cancelled';

export interface DAGNode {
  id: string;
  label: string;
  status?: DAGStatus;
  meta?: string;
  depends?: string[];
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  sourceStatus: DAGStatus;
}

export interface DAGLayoutNode extends DAGNode {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
  order: number;
  status: DAGStatus;
}

export interface DAGLayoutResult {
  nodes: DAGLayoutNode[];
  edges: DAGEdge[];
  width: number;
  height: number;
  hasCycle: boolean;
}
