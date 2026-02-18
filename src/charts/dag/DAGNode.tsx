import React from 'react';
import type { DAGLayoutNode, DAGNode, DAGStatus } from './types';

interface DAGNodeCardProps {
  node: DAGLayoutNode;
  compact: boolean;
  hovered: boolean;
  dimmed: boolean;
  onNodeClick?: (id: string) => void;
  onHover: (id: string | null) => void;
  renderNode?: (node: DAGNode, isHovered: boolean) => React.ReactNode;
}

const statusAccent: Record<DAGStatus, string> = {
  completed: 'var(--ok)',
  running: 'var(--warn)',
  pending: 'var(--t4)',
  failed: 'var(--err)',
  cancelled: 'var(--t4)',
};

const statusIcon: Record<DAGStatus, string> = {
  completed: '\u25CF',
  running: '\u25D0',
  pending: '\u25CC',
  failed: '\u2715',
  cancelled: '\u2014',
};

const statusLabel: Record<DAGStatus, string> = {
  completed: 'Completed',
  running: 'Running',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

function nodeTitle(node: DAGLayoutNode): string {
  const parts = [node.label, statusLabel[node.status]];
  if (node.meta) parts.push(node.meta);
  return parts.join(' | ');
}

export const DAGNodeCard = React.memo(function DAGNodeCard({
  node,
  compact,
  hovered,
  dimmed,
  onNodeClick,
  onHover,
  renderNode,
}: DAGNodeCardProps) {
  const clickable = !!onNodeClick;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${node.label} - ${statusLabel[node.status]}`}
      data-status={node.status}
      title={nodeTitle(node)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={() => onNodeClick?.(node.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onNodeClick?.(node.id);
        }
      }}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.width,
        minHeight: node.height,
        borderRadius: 'var(--r-chip)',
        border: '1px solid var(--gi-bd)',
        borderLeft: `4px solid ${statusAccent[node.status]}`,
        background: 'var(--gi-bg)',
        color: 'var(--t1)',
        padding: compact ? '6px 10px' : '10px 14px',
        textAlign: 'center',
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
        opacity: dimmed ? 0.3 : 1,
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 8px 18px rgba(0,0,0,.10)' : 'none',
        transition: 'transform .15s var(--ease), opacity .15s var(--ease), box-shadow .15s var(--ease), border-color .15s var(--ease)',
        display: 'grid',
        gap: compact ? '3px' : '5px',
      }}
    >
      {renderNode ? (
        renderNode(node, hovered)
      ) : (
        <>
          <div
            style={{
              fontSize: compact ? '12px' : '13px',
              fontWeight: 600,
              color: 'var(--t1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {node.label}
          </div>

          <div
            style={{
              fontSize: compact ? '10px' : '11px',
              color: node.status === 'failed'
                ? 'var(--err)'
                : node.status === 'running'
                  ? 'var(--warn)'
                  : node.status === 'completed'
                    ? 'var(--ok)'
                    : 'var(--t3)',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            className={node.status === 'running' ? 'pulse' : undefined}
          >
            <span aria-hidden="true">{statusIcon[node.status]}</span>
            <span>{node.meta ?? statusLabel[node.status]}</span>
          </div>
        </>
      )}
    </div>
  );
});

DAGNodeCard.displayName = 'DAGNodeCard';
