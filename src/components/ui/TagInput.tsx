import React, { useCallback, useMemo, useState } from 'react';
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

const ROOT_BASE_STYLE: React.CSSProperties = {
  padding: '8px',
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '6px',
};

const ROOT_ENABLED_STYLE: React.CSSProperties = {
  ...ROOT_BASE_STYLE,
  opacity: 1,
};

const ROOT_DISABLED_STYLE: React.CSSProperties = {
  ...ROOT_BASE_STYLE,
  opacity: 0.6,
};

const TAG_CHIP_STYLE: React.CSSProperties = {
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
};

const TAG_REMOVE_BUTTON_STYLE: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--t4)',
  cursor: 'pointer',
  lineHeight: 1,
  padding: 0,
  minHeight: 'unset',
};

const INPUT_STYLE: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--t1)',
  fontSize: '13px',
  minWidth: '120px',
  flex: 1,
  outline: 'none',
  minHeight: '28px',
};

interface TagChipProps {
  tag: string;
  index: number;
  disabled: boolean;
  onRemove: (index: number) => void;
}

const TagChip = React.memo(function TagChip({
  tag,
  index,
  disabled,
  onRemove,
}: TagChipProps) {
  const onRemoveClick = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <span style={TAG_CHIP_STYLE}>
      <span>{tag}</span>
      {!disabled && (
        <button
          type="button"
          onClick={onRemoveClick}
          aria-label={`Remove ${tag}`}
          style={TAG_REMOVE_BUTTON_STYLE}
        >
          {'\u00D7'}
        </button>
      )}
    </span>
  );
});

TagChip.displayName = 'TagChip';

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

  const rootStyle = disabled ? ROOT_DISABLED_STYLE : ROOT_ENABLED_STYLE;

  const addTags = useCallback((incoming: string[]) => {
    if (incoming.length === 0) return;
    setTags((previous) => {
      if (maxTags != null && previous.length >= maxTags) return previous;
      const next = [...previous];
      const existing = allowDuplicates
        ? null
        : new Set(previous.map((item) => item.toLowerCase()));
      let changed = false;

      for (const rawTag of incoming) {
        const tag = normalizeTag(rawTag);
        if (!tag) continue;

        if (!allowDuplicates) {
          const lower = tag.toLowerCase();
          if (existing?.has(lower)) continue;
          existing?.add(lower);
        }

        if (maxTags != null && next.length >= maxTags) break;
        next.push(tag);
        changed = true;
      }

      return changed ? next : previous;
    });
  }, [allowDuplicates, maxTags, setTags]);

  const removeTag = useCallback((index: number) => {
    setTags((previous) => {
      if (index < 0 || index >= previous.length) return previous;
      return previous.filter((_, currentIndex) => currentIndex !== index);
    });
  }, [setTags]);

  const commitInput = useCallback(() => {
    const parsed = parseTagInput(input);
    if (parsed.length > 0) addTags(parsed);
    setInput('');
  }, [addTags, input]);

  const onCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const onCompositionEnd = useCallback((event: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    setInput(event.currentTarget.value);
  }, []);

  const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing || event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitInput();
      return;
    }
    if (event.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }, [commitInput, input, isComposing, removeTag, tags.length]);

  const onInputBlur = useCallback(() => {
    if (isComposing) return;
    if (input.trim()) commitInput();
  }, [commitInput, input, isComposing]);

  const inputPlaceholder = useMemo(
    () => (tags.length === 0 ? placeholder : undefined),
    [placeholder, tags.length],
  );

  return (
    <div
      className={cn('gi', className)}
      style={rootStyle}
    >
      {tags.map((tag, index) => (
        <TagChip
          key={`${tag}-${index}`}
          tag={tag}
          index={index}
          disabled={disabled}
          onRemove={removeTag}
        />
      ))}

      <input
        type="text"
        value={input}
        disabled={disabled}
        placeholder={inputPlaceholder}
        onChange={(event) => setInput(event.target.value)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={onInputKeyDown}
        onBlur={onInputBlur}
        style={INPUT_STYLE}
      />
    </div>
  );
}
