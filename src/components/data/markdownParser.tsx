import React from 'react';

export type MarkdownToken =
  | { type: 'heading'; level: number; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'code'; content: string; lang?: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'blockquote'; content: string }
  | { type: 'hr' }
  | { type: 'table'; headers: string[]; cells: string[][] };

const FENCE_RE = /^```(\w*)/;
const HEADING_RE = /^(#{1,6})\s+(.+)/;
const UL_RE = /^[\s]*[-*+]\s/;
const OL_RE = /^[\s]*\d+\.\s/;
const HR_RE = /^(---|\*\*\*|___)$/;
const INLINE_RE = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]*)\]\(([^)]+)\)|`([^`]+)`|\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~/g;
const URL_SCHEME_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
const SAFE_LINK_SCHEMES = new Set(['http:', 'https:', 'mailto:']);
const SAFE_IMAGE_SCHEMES = new Set(['http:', 'https:']);
const TOKEN_CACHE_LIMIT = 200;
const INLINE_RENDER_CACHE_LIMIT = 500;
const tokenCache = new Map<string, MarkdownToken[]>();
const inlineRenderCache = new Map<string, React.ReactNode[]>();

const INLINE_IMAGE_STYLE: React.CSSProperties = {
  maxWidth: '100%',
  borderRadius: '8px',
  margin: '4px 0',
};

const INLINE_LINK_STYLE: React.CSSProperties = {
  color: 'var(--p500)',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
};

const INLINE_CODE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: '0.9em',
  padding: '1px 6px',
  borderRadius: '4px',
  background: 'rgba(var(--gl), .08)',
  color: 'var(--p600)',
};

const INLINE_DEL_STYLE: React.CSSProperties = {
  opacity: 0.6,
};

function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  if (!trimmed.includes('|')) return [trimmed.trim()];
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparatorLine(line: string): boolean {
  if (!line.includes('|')) return false;
  const cells = parseTableRow(line);
  return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableStart(line: string, nextLine?: string): boolean {
  if (!nextLine || !line.includes('|')) return false;
  const headers = parseTableRow(line);
  const separators = parseTableRow(nextLine);
  return headers.length >= 2 && separators.length === headers.length && isTableSeparatorLine(nextLine);
}

function isBlockBoundary(line: string, nextLine?: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed === '' ||
    FENCE_RE.test(line) ||
    HEADING_RE.test(line) ||
    UL_RE.test(line) ||
    OL_RE.test(line) ||
    line.startsWith('>') ||
    HR_RE.test(trimmed) ||
    isTableStart(line, nextLine)
  );
}

export function tokenizeMarkdown(md: string): MarkdownToken[] {
  const cached = tokenCache.get(md);
  if (cached) return cached;

  const tokens: MarkdownToken[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const fenceMatch = line.match(FENCE_RE);
    if (fenceMatch) {
      const lang = fenceMatch[1] || undefined;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      tokens.push({ type: 'code', content: codeLines.join('\n'), lang });
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      tokens.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
      i++;
      continue;
    }

    if (HR_RE.test(line.trim())) {
      tokens.push({ type: 'hr' });
      i++;
      continue;
    }

    if (isTableStart(line, lines[i + 1])) {
      const headers = parseTableRow(line);
      i += 2; // skip header + separator
      const cells: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const row = parseTableRow(lines[i]);
        if (row.length < 2) break;
        const normalizedRow = [...row.slice(0, headers.length)];
        while (normalizedRow.length < headers.length) normalizedRow.push('');
        cells.push(normalizedRow);
        i++;
      }
      tokens.push({ type: 'table', headers, cells });
      continue;
    }

    if (UL_RE.test(line)) {
      const items: string[] = [];
      while (i < lines.length && UL_RE.test(lines[i])) {
        items.push(lines[i].replace(UL_RE, ''));
        i++;
      }
      tokens.push({ type: 'list', items, ordered: false });
      continue;
    }

    if (OL_RE.test(line)) {
      const items: string[] = [];
      while (i < lines.length && OL_RE.test(lines[i])) {
        items.push(lines[i].replace(OL_RE, ''));
        i++;
      }
      tokens.push({ type: 'list', items, ordered: true });
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      tokens.push({ type: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length && !isBlockBoundary(lines[i], lines[i + 1])) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      tokens.push({ type: 'paragraph', content: paragraphLines.join(' ') });
    }
  }

  if (tokenCache.size >= TOKEN_CACHE_LIMIT) {
    const oldestKey = tokenCache.keys().next().value;
    if (oldestKey !== undefined) tokenCache.delete(oldestKey);
  }
  tokenCache.set(md, tokens);

  return tokens;
}

function sanitizeUrl(rawUrl: string, allowedSchemes: Set<string>): string | null {
  const url = rawUrl.trim();
  if (!url) return null;
  if (url.startsWith('//')) return null;

  if (URL_SCHEME_RE.test(url)) {
    try {
      const parsed = new URL(url);
      return allowedSchemes.has(parsed.protocol) ? url : null;
    } catch {
      return null;
    }
  }

  return url;
}

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  const cached = inlineRenderCache.get(text);
  if (cached) return cached;

  const parts: React.ReactNode[] = [];
  INLINE_RE.lastIndex = 0;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[1] !== undefined) {
      const safeSrc = sanitizeUrl(match[2], SAFE_IMAGE_SCHEMES);
      if (safeSrc) {
        parts.push(
          <img
            key={match.index}
            src={safeSrc}
            alt={match[1]}
            style={INLINE_IMAGE_STYLE}
          />
        );
      } else {
        parts.push(match[1]);
      }
    } else if (match[3] !== undefined) {
      const safeHref = sanitizeUrl(match[4], SAFE_LINK_SCHEMES);
      if (safeHref) {
        parts.push(
          <a
            key={match.index}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            style={INLINE_LINK_STYLE}
          >
            {match[3]}
          </a>
        );
      } else {
        parts.push(match[3]);
      }
    } else if (match[5] !== undefined) {
      parts.push(
        <code
          key={match.index}
          style={INLINE_CODE_STYLE}
        >
          {match[5]}
        </code>
      );
    } else if (match[6] !== undefined) {
      parts.push(<strong key={match.index}>{match[6]}</strong>);
    } else if (match[7] !== undefined) {
      parts.push(<em key={match.index}>{match[7]}</em>);
    } else if (match[8] !== undefined) {
      parts.push(<del key={match.index} style={INLINE_DEL_STYLE}>{match[8]}</del>);
    }

    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  if (inlineRenderCache.size >= INLINE_RENDER_CACHE_LIMIT) {
    const oldestKey = inlineRenderCache.keys().next().value;
    if (oldestKey !== undefined) inlineRenderCache.delete(oldestKey);
  }
  inlineRenderCache.set(text, parts);

  return parts;
}
