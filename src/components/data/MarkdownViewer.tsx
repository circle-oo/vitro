import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';

interface MarkdownViewerProps {
  /** Raw markdown string */
  content: string;
  className?: string;
}

/* ── Minimal markdown → React renderer (no dependencies) ── */

interface Token {
  type: string;
  content?: string;
  items?: string[];
  ordered?: boolean;
  lang?: string;
  level?: number;
  cells?: string[][];
  headers?: string[];
}

function tokenize(md: string): Token[] {
  const tokens: Token[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fenceMatch = line.match(/^```(\w*)/);
    if (fenceMatch) {
      const lang = fenceMatch[1] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      tokens.push({ type: 'code', content: codeLines.join('\n'), lang });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      tokens.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(---|\*\*\*|___)/.test(line.trim())) {
      tokens.push({ type: 'hr' });
      i++;
      continue;
    }

    // Table (| header | header |)
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\|[\s:-]+\|/.test(lines[i + 1].trim())) {
      const headers = line.split('|').filter(Boolean).map((s) => s.trim());
      i += 2; // skip header + separator
      const cells: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        cells.push(lines[i].split('|').filter(Boolean).map((s) => s.trim()));
        i++;
      }
      tokens.push({ type: 'table', headers, cells });
      continue;
    }

    // Unordered list
    if (/^[\s]*[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\s]*[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\s]*[-*+]\s/, ''));
        i++;
      }
      tokens.push({ type: 'list', items, ordered: false });
      continue;
    }

    // Ordered list
    if (/^[\s]*\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\s]*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\s]*\d+\.\s/, ''));
        i++;
      }
      tokens.push({ type: 'list', items, ordered: true });
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      tokens.push({ type: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|```|[-*+]\s|\d+\.\s|>|---|\*\*\*|___|(\|.*\|))/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      tokens.push({ type: 'paragraph', content: paraLines.join(' ') });
    }
  }

  return tokens;
}

/** Parse inline markdown: bold, italic, code, links, images, strikethrough */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Combined regex for inline elements
  const re = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]*)\]\(([^)]+)\)|`([^`]+)`|\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[1] !== undefined) {
      // Image ![alt](src)
      parts.push(
        <img
          key={match.index}
          src={match[2]}
          alt={match[1]}
          style={{ maxWidth: '100%', borderRadius: '8px', margin: '4px 0' }}
        />
      );
    } else if (match[3] !== undefined) {
      // Link [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--p500)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {match[3]}
        </a>
      );
    } else if (match[5] !== undefined) {
      // Inline code `code`
      parts.push(
        <code
          key={match.index}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.9em',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'rgba(var(--gl), .08)',
            color: 'var(--p600)',
          }}
        >
          {match[5]}
        </code>
      );
    } else if (match[6] !== undefined) {
      // Bold **text**
      parts.push(<strong key={match.index}>{match[6]}</strong>);
    } else if (match[7] !== undefined) {
      // Italic *text*
      parts.push(<em key={match.index}>{match[7]}</em>);
    } else if (match[8] !== undefined) {
      // Strikethrough ~~text~~
      parts.push(<del key={match.index} style={{ opacity: 0.6 }}>{match[8]}</del>);
    }

    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts;
}

function TokenRenderer({ token }: { token: Token }) {
  switch (token.type) {
    case 'heading': {
      const sizes: Record<number, string> = { 1: '1.6em', 2: '1.35em', 3: '1.15em', 4: '1em', 5: '0.9em', 6: '0.85em' };
      const weights: Record<number, number> = { 1: 700, 2: 700, 3: 600, 4: 600, 5: 600, 6: 600 };
      const level = token.level ?? 1;
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
          {renderInline(token.content ?? '')}
        </div>
      );
    }

    case 'paragraph':
      return (
        <p style={{ margin: '8px 0', lineHeight: 1.7, color: 'var(--t2)' }}>
          {renderInline(token.content ?? '')}
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
          {token.lang && (
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
          {token.items?.map((item, i) => (
            <li key={i} style={{ margin: '3px 0' }}>
              {renderInline(item)}
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
          {renderInline(token.content ?? '')}
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
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {token.cells?.map((row, ri) => (
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
                      {renderInline(cell)}
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
  const tokens = useMemo(() => tokenize(content), [content]);

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
