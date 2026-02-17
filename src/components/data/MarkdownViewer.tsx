import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { renderInlineMarkdown, tokenizeMarkdown, type MarkdownToken } from './markdownParser';

export interface MarkdownViewerProps {
  /** Raw markdown string */
  content: string;
  className?: string;
}

function TokenRenderer({ token }: { token: MarkdownToken }) {
  switch (token.type) {
    case 'heading': {
      const sizes: Record<number, string> = { 1: '1.6em', 2: '1.35em', 3: '1.15em', 4: '1em', 5: '0.9em', 6: '0.85em' };
      const weights: Record<number, number> = { 1: 700, 2: 700, 3: 600, 4: 600, 5: 600, 6: 600 };
      const level = token.level;
      return (
        <div
          style={{
            fontSize: sizes[level] ?? '1em',
            fontWeight: weights[level] ?? 600,
            color: 'var(--t1)',
            margin: `${level <= 2 ? '20px' : '14px'} 0 8px`,
            letterSpacing: level <= 2 ? '-.3px' : undefined,
            borderBottom: level <= 2 ? '1px solid var(--div)' : undefined,
            paddingBottom: level <= 2 ? '6px' : undefined,
          }}
        >
          {renderInlineMarkdown(token.content)}
        </div>
      );
    }

    case 'paragraph':
      return (
        <p style={{ margin: '8px 0', lineHeight: 1.7, color: 'var(--t2)' }}>
          {renderInlineMarkdown(token.content)}
        </p>
      );

    case 'code':
      return (
        <pre
          style={{
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
          }}
        >
          {!!token.lang && (
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--t4)',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
                marginBottom: '8px',
              }}
            >
              {token.lang}
            </div>
          )}
          <code>{token.content}</code>
        </pre>
      );

    case 'list':
      const Tag = token.ordered ? 'ol' : 'ul';
      return (
        <Tag
          style={{
            margin: '8px 0',
            paddingLeft: '24px',
            lineHeight: 1.7,
            color: 'var(--t2)',
          }}
        >
          {token.items.map((item, i) => (
            <li key={i} style={{ margin: '3px 0' }}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </Tag>
      );

    case 'blockquote':
      return (
        <blockquote
          style={{
            margin: '10px 0',
            paddingLeft: '16px',
            borderLeft: '3px solid var(--p400)',
            color: 'var(--t3)',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          {renderInlineMarkdown(token.content)}
        </blockquote>
      );

    case 'hr':
      return <hr style={{ border: 'none', borderTop: '1px solid var(--div)', margin: '16px 0' }} />;

    case 'table':
      return (
        <div style={{ overflowX: 'auto', margin: '10px 0' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr>
                {token.headers?.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--t3)',
                      borderBottom: '2px solid var(--div)',
                    }}
                  >
                    {renderInlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {token.cells.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--div)',
                        color: 'var(--t2)',
                      }}
                    >
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
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const tokens = useMemo(() => tokenizeMarkdown(content), [content]);

  return (
    <div
      className={cn(className)}
      style={{
        fontSize: '14px',
        fontFamily: 'var(--font)',
        color: 'var(--t1)',
      }}
    >
      {tokens.map((token, i) => (
        <TokenRenderer key={i} token={token} />
      ))}
    </div>
  );
}
