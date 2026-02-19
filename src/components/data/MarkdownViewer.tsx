import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { renderInlineMarkdown, tokenizeMarkdown, type MarkdownToken } from './markdownParser';

export interface MarkdownViewerProps {
  /** Raw markdown string */
  content: string;
  className?: string;
}

const ROOT_STYLE: React.CSSProperties = {
  fontSize: '14px',
  fontFamily: 'var(--font)',
  color: 'var(--t1)',
};

const PARAGRAPH_STYLE: React.CSSProperties = {
  margin: '8px 0',
  lineHeight: 1.7,
  color: 'var(--t2)',
};

const CODE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  lineHeight: 1.6,
  padding: '14px 16px',
  borderRadius: '10px',
  background: 'rgba(var(--gl), .06)',
  color: 'var(--t2)',
  overflow: 'auto',
  margin: '10px 0',
  border: '1px solid var(--div)',
};

const CODE_LANG_STYLE: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 300,
  color: 'var(--t4)',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
  marginBottom: '8px',
};

const LIST_STYLE: React.CSSProperties = {
  margin: '8px 0',
  paddingLeft: '24px',
  lineHeight: 1.7,
  color: 'var(--t2)',
};

const LIST_ITEM_STYLE: React.CSSProperties = {
  margin: '3px 0',
};

const BLOCKQUOTE_STYLE: React.CSSProperties = {
  margin: '10px 0',
  paddingLeft: '16px',
  borderLeft: '3px solid var(--p400)',
  color: 'var(--t3)',
  fontStyle: 'italic',
  lineHeight: 1.7,
};

const HR_STYLE: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--div)',
  margin: '16px 0',
};

const TABLE_CONTAINER_STYLE: React.CSSProperties = {
  overflowX: 'auto',
  margin: '10px 0',
};

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
};

const TABLE_HEADER_CELL_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: '11px',
  fontWeight: 300,
  color: 'var(--t3)',
  borderBottom: '2px solid var(--div)',
};

const TABLE_CELL_STYLE: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--div)',
  color: 'var(--t2)',
};

const HEADING_STYLE_BY_LEVEL: Record<number, React.CSSProperties> = {
  1: {
    fontSize: '1.6em',
    fontWeight: 300,
    color: 'var(--t1)',
    margin: '20px 0 8px',
    letterSpacing: '-.3px',
    borderBottom: '1px solid var(--div)',
    paddingBottom: '6px',
  },
  2: {
    fontSize: '1.35em',
    fontWeight: 300,
    color: 'var(--t1)',
    margin: '20px 0 8px',
    letterSpacing: '-.3px',
    borderBottom: '1px solid var(--div)',
    paddingBottom: '6px',
  },
  3: {
    fontSize: '1.15em',
    fontWeight: 200,
    color: 'var(--t1)',
    margin: '14px 0 8px',
  },
  4: {
    fontSize: '1em',
    fontWeight: 200,
    color: 'var(--t1)',
    margin: '14px 0 8px',
  },
  5: {
    fontSize: '0.9em',
    fontWeight: 200,
    color: 'var(--t1)',
    margin: '14px 0 8px',
  },
  6: {
    fontSize: '0.85em',
    fontWeight: 200,
    color: 'var(--t1)',
    margin: '14px 0 8px',
  },
};

const DEFAULT_HEADING_STYLE = HEADING_STYLE_BY_LEVEL[4];

const TokenRenderer = React.memo(function TokenRenderer({ token }: { token: MarkdownToken }) {
  switch (token.type) {
    case 'heading': {
      const headingStyle = HEADING_STYLE_BY_LEVEL[token.level] ?? DEFAULT_HEADING_STYLE;
      return (
        <div style={headingStyle}>
          {renderInlineMarkdown(token.content)}
        </div>
      );
    }

    case 'paragraph':
      return (
        <p style={PARAGRAPH_STYLE}>
          {renderInlineMarkdown(token.content)}
        </p>
      );

    case 'code':
      return (
        <pre style={CODE_STYLE}>
          {!!token.lang && (
            <div style={CODE_LANG_STYLE}>
              {token.lang}
            </div>
          )}
          <code>{token.content}</code>
        </pre>
      );

    case 'list':
      const ListTag = token.ordered ? 'ol' : 'ul';
      return (
        <ListTag style={LIST_STYLE}>
          {token.items.map((item, i) => (
            <li key={i} style={LIST_ITEM_STYLE}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      );

    case 'blockquote':
      return (
        <blockquote style={BLOCKQUOTE_STYLE}>
          {renderInlineMarkdown(token.content)}
        </blockquote>
      );

    case 'hr':
      return <hr style={HR_STYLE} />;

    case 'table':
      return (
        <div style={TABLE_CONTAINER_STYLE}>
          <table style={TABLE_STYLE}>
            <thead>
              <tr>
                {token.headers?.map((h, i) => (
                  <th key={i} style={TABLE_HEADER_CELL_STYLE}>
                    {renderInlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {token.cells.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={TABLE_CELL_STYLE}>
                      {renderInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
});

TokenRenderer.displayName = 'TokenRenderer';

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const tokens = useMemo(() => tokenizeMarkdown(content), [content]);
  const renderedTokens = useMemo(
    () =>
      tokens.map((token, index) => (
        <TokenRenderer key={`${token.type}-${index}`} token={token} />
      )),
    [tokens],
  );

  return (
    <div className={cn(className)} style={ROOT_STYLE}>
      {renderedTokens}
    </div>
  );
}
