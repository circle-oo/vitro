import React, { useDeferredValue, useState, useEffect, useMemo, useRef, useCallback, useId } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { trapTabKey } from '../utils/focus';

export interface CommandItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  keywords?: string[];
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: string;
}

interface IndexedItem extends CommandItem {
  index: number;
}

interface SearchIndexedItem extends CommandItem {
  searchText: string;
}

const LAYER_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '15vh',
};

const BACKDROP_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,.25)',
};

const DIALOG_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '520px',
  maxWidth: '90vw',
  maxHeight: '400px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '16px 20px',
  fontSize: '16px',
  fontFamily: 'var(--font)',
  background: 'transparent',
  border: 'none',
  color: 'var(--t1)',
  outline: 'none',
  borderBottom: '1px solid var(--div)',
};

const LISTBOX_STYLE: React.CSSProperties = {
  padding: '8px',
  overflowY: 'auto',
  flex: 1,
};

const EMPTY_STYLE: React.CSSProperties = {
  padding: '18px 14px',
  fontSize: '13px',
  color: 'var(--t3)',
};

const GROUP_LABEL_STYLE: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '10px',
  fontWeight: 300,
  textTransform: 'uppercase',
  letterSpacing: '.8px',
  color: 'var(--t4)',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'background .1s',
  gap: '10px',
  textAlign: 'left',
  border: 'none',
  fontFamily: 'var(--font)',
};

const ITEM_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  color: 'var(--p700)',
  background: 'rgba(var(--gl), .10)',
};

const ITEM_INACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  color: 'var(--t2)',
  background: 'transparent',
};

const ITEM_CONTENT_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const ITEM_ICON_STYLE: React.CSSProperties = {
  fontSize: '16px',
  opacity: 0.6,
  width: '20px',
  textAlign: 'center',
};

const ITEM_SHORTCUT_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t4)',
  padding: '2px 8px',
  borderRadius: '6px',
  background: 'var(--div)',
};

interface CommandPaletteRowProps {
  item: IndexedItem;
  active: boolean;
  itemId: string;
  onRunItem: (item: CommandItem) => void;
  onSetActive: (index: number) => void;
  onSetItemRef: (index: number, element: HTMLButtonElement | null) => void;
}

const CommandPaletteRow = React.memo(function CommandPaletteRow({
  item,
  active,
  itemId,
  onRunItem,
  onSetActive,
  onSetItemRef,
}: CommandPaletteRowProps) {
  return (
    <button
      id={itemId}
      ref={(element) => {
        onSetItemRef(item.index, element);
      }}
      type="button"
      role="option"
      aria-selected={active}
      onClick={() => onRunItem(item)}
      onMouseEnter={() => onSetActive(item.index)}
      onFocus={() => onSetActive(item.index)}
      style={active ? ITEM_ACTIVE_STYLE : ITEM_INACTIVE_STYLE}
    >
      <div style={ITEM_CONTENT_STYLE}>
        {item.icon && (
          <span style={ITEM_ICON_STYLE}>
            {item.icon}
          </span>
        )}
        {item.label}
      </div>
      {item.shortcut && (
        <span style={ITEM_SHORTCUT_STYLE}>
          {item.shortcut}
        </span>
      )}
    </button>
  );
});

export function CommandPalette({
  open,
  onClose,
  groups,
  placeholder = 'Search...',
  emptyText = 'No commands found.',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId().replace(/:/g, '');
  useBodyScrollLock(open);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => inputRef.current?.focus());
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2) window.cancelAnimationFrame(raf2);
      };
    }
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const deferredQuery = useDeferredValue(normalizedQuery);

  const indexedGroups = useMemo(
    () =>
      groups.map((group) => ({
        label: group.label,
        items: group.items.map<SearchIndexedItem>((item) => ({
          ...item,
          searchText: [
            item.label,
            item.shortcut ?? '',
            ...(item.keywords ?? []),
          ]
            .join(' ')
            .toLowerCase(),
        })),
      })),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    let nextIndex = 0;
    return indexedGroups
      .map((group) => {
        const items = group.items
          .filter((item) => {
            if (!deferredQuery) return true;
            return item.searchText.includes(deferredQuery);
          })
          .map<IndexedItem>((item) => ({
            ...item,
            index: nextIndex++,
          }));
        return { label: group.label, items };
      })
      .filter((group) => group.items.length > 0);
  }, [deferredQuery, indexedGroups]);

  const flatItems = useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups],
  );

  useEffect(() => {
    if (!open) return;
    setActiveIndex((prev) => {
      if (flatItems.length === 0) return -1;
      if (prev >= 0 && prev < flatItems.length) return prev;
      return 0;
    });
    itemRefs.current.length = flatItems.length;
  }, [flatItems.length, open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = itemRefs.current[activeIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const runItem = useCallback((item: CommandItem) => {
    item.onSelect();
    onClose();
  }, [onClose]);

  const setItemRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    itemRefs.current[index] = element;
  }, []);

  const moveActive = useCallback((delta: number) => {
    if (flatItems.length === 0) return;
    setActiveIndex((prev) => {
      const start = prev >= 0 ? prev : 0;
      return (start + delta + flatItems.length) % flatItems.length;
    });
  }, [flatItems.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      if (trapTabKey(e, dialogRef.current)) return;
      return;
    }

    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(flatItems.length - 1);
      return;
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) runItem(item);
    }
  };

  if (!open) return null;

  return (
    <div
      onKeyDown={handleKeyDown}
      style={LAYER_STYLE}
    >
      <div
        style={BACKDROP_STYLE}
        onClick={onClose}
      />
      <div
        className="go"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={DIALOG_STYLE}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-controls={`vitro-command-listbox-${listboxId}`}
          aria-activedescendant={activeIndex >= 0 ? `vitro-cmd-item-${listboxId}-${activeIndex}` : undefined}
          style={INPUT_STYLE}
        />
        <div id={`vitro-command-listbox-${listboxId}`} role="listbox" style={LISTBOX_STYLE}>
          {filteredGroups.length === 0 && (
            <div style={EMPTY_STYLE}>
              {emptyText}
            </div>
          )}
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <div style={GROUP_LABEL_STYLE}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = item.index === activeIndex;
                return (
                  <CommandPaletteRow
                    key={item.id}
                    item={item}
                    active={active}
                    itemId={`vitro-cmd-item-${listboxId}-${item.index}`}
                    onRunItem={runItem}
                    onSetActive={setActiveIndex}
                    onSetItemRef={setItemRef}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
