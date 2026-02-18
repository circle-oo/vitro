import React, { useState, useEffect, useMemo, useRef, useCallback, useId } from 'react';

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

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0),
  );
}

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

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const lq = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    let nextIndex = 0;
    return groups
      .map((group) => {
        const items = group.items
          .filter((item) => {
            if (!lq) return true;
            const haystack = [
              item.label,
              item.shortcut ?? '',
              ...(item.keywords ?? []),
            ]
              .join(' ')
              .toLowerCase();
            return haystack.includes(lq);
          })
          .map<IndexedItem>((item) => ({
            ...item,
            index: nextIndex++,
          }));
        return { label: group.label, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, lq]);

  const flatItems = useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups],
  );

  useEffect(() => {
    if (!open) return;
    setActiveIndex(flatItems.length > 0 ? 0 : -1);
    itemRefs.current = [];
  }, [flatItems.length, open, lq]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = itemRefs.current[activeIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const runItem = useCallback((item: CommandItem) => {
    item.onSelect();
    onClose();
  }, [onClose]);

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
      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) return;

      const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
      const nextIndex = e.shiftKey
        ? (currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1)
        : (currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1);
      e.preventDefault();
      focusables[nextIndex]?.focus();
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)' }}
        onClick={onClose}
      />
      <div
        className="go"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '520px',
          maxWidth: '90vw',
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-controls={`vitro-command-listbox-${listboxId}`}
          aria-activedescendant={activeIndex >= 0 ? `vitro-cmd-item-${listboxId}-${activeIndex}` : undefined}
          style={{
            width: '100%',
            padding: '16px 20px',
            fontSize: '16px',
            fontFamily: 'var(--font)',
            background: 'transparent',
            border: 'none',
            color: 'var(--t1)',
            outline: 'none',
            borderBottom: '1px solid var(--div)',
          }}
        />
        <div id={`vitro-command-listbox-${listboxId}`} role="listbox" style={{ padding: '8px', overflowY: 'auto', flex: 1 }}>
          {filteredGroups.length === 0 && (
            <div
              style={{
                padding: '18px 14px',
                fontSize: '13px',
                color: 'var(--t3)',
              }}
            >
              {emptyText}
            </div>
          )}
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <div
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontWeight: 300,
                  textTransform: 'uppercase',
                  letterSpacing: '.8px',
                  color: 'var(--t4)',
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = item.index === activeIndex;
                return (
                <button
                  key={item.id}
                  id={`vitro-cmd-item-${listboxId}-${item.index}`}
                  ref={(el) => {
                    itemRefs.current[item.index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => runItem(item)}
                  onMouseEnter={() => setActiveIndex(item.index)}
                  onFocus={() => setActiveIndex(item.index)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: active ? 'var(--p700)' : 'var(--t2)',
                    cursor: 'pointer',
                    transition: 'background .1s',
                    gap: '10px',
                    textAlign: 'left',
                    border: 'none',
                    fontFamily: 'var(--font)',
                    background: active ? 'rgba(var(--gl), .10)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon && (
                      <span style={{ fontSize: '16px', opacity: 0.6, width: '20px', textAlign: 'center' }}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </div>
                  {item.shortcut && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--t4)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--div)',
                      }}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </button>
              )})}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
