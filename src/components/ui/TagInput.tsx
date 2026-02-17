import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  allowDuplicates?: boolean;
  className?: string;
}

function normalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ');
}

function parseTagInput(input: string): string[] {
  return input
    .split(/[,\n]/g)
    .map(normalizeTag)
    .filter(Boolean);
}

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Add tag and press Enter',
  maxTags,
  disabled = false,
  allowDuplicates = false,
  className,
}: TagInputProps) {
  const isControlled = value != null;
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const [input, setInput] = useState('');
  const tags = isControlled ? value : internalTags;

  const applyTags = (nextTags: string[]) => {
    if (!isControlled) setInternalTags(nextTags);
    onChange?.(nextTags);
  };

  const addTags = (incoming: string[]) => {
    if (incoming.length === 0) return;
    let next = [...tags];

    for (const rawTag of incoming) {
      const tag = normalizeTag(rawTag);
      if (!tag) continue;
      if (!allowDuplicates && next.some((item) => item.toLowerCase() === tag.toLowerCase())) continue;
      if (maxTags != null && next.length >= maxTags) break;
      next.push(tag);
    }

    if (next.length !== tags.length) applyTags(next);
  };

  const removeTag = (index: number) => {
    applyTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn('gi', className)}
      style={{
        padding: '8px',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '999px',
            background: 'rgba(var(--gl), .14)',
            color: 'var(--t2)',
            fontSize: '12px',
            padding: '4px 8px',
          }}
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag}`}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--t4)',
                cursor: 'pointer',
                lineHeight: 1,
                padding: 0,
                minHeight: 'unset',
              }}
            >
              {'\u00D7'}
            </button>
          )}
        </span>
      ))}

      <input
        type="text"
        value={input}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : undefined}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTags(parseTagInput(input));
            setInput('');
            return;
          }
          if (event.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags.length - 1);
          }
        }}
        onBlur={() => {
          if (input.trim()) {
            addTags(parseTagInput(input));
            setInput('');
          }
        }}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--t1)',
          fontSize: '13px',
          minWidth: '120px',
          flex: 1,
          outline: 'none',
          minHeight: '28px',
        }}
      />
    </div>
  );
}
