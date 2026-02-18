import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';

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
  const [tags, setTags] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange,
  });
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const applyTags = (nextTags: string[]) => {
    setTags(nextTags);
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

  const commitInput = () => {
    const parsed = parseTagInput(input);
    if (parsed.length > 0) addTags(parsed);
    setInput('');
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
            background: 'color-mix(in srgb, var(--gi-bg) 82%, transparent)',
            border: '1px solid color-mix(in srgb, var(--gi-bd) 78%, transparent)',
            backdropFilter: 'blur(10px) saturate(150%)',
            WebkitBackdropFilter: 'blur(10px) saturate(150%)',
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
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(event) => {
          setIsComposing(false);
          setInput(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (isComposing || event.nativeEvent.isComposing) return;
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            commitInput();
            return;
          }
          if (event.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags.length - 1);
          }
        }}
        onBlur={() => {
          if (isComposing) return;
          if (input.trim()) commitInput();
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
