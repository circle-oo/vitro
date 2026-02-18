import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer';
import { useOverlayPosition } from './useOverlayPosition';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  emptyText = 'No results',
  className,
}: ComboboxProps) {
  const listId = useId().replace(/:/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const overlayPosition = useOverlayPosition({
    triggerRef,
    overlayRef: dropdownRef,
    side: 'bottom',
    align: 'start',
    offset: 8,
    enabled: open,
    matchTriggerWidth: true,
  });

  const selected = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;

    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const enabledIndexes = useMemo(
    () => filteredOptions.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled).map(({ index }) => index),
    [filteredOptions],
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(-1);
    }
  }, [open]);

  useDismissibleLayer({
    open,
    refs: [rootRef, dropdownRef],
    onDismiss: () => {
      setOpen(false);
      triggerRef.current?.focus();
    },
  });

  useEffect(() => {
    if (!open) return;

    const selectedIndex = filteredOptions.findIndex((opt) => opt.value === value && !opt.disabled);
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
      return;
    }
    setActiveIndex(enabledIndexes[0] ?? -1);
  }, [enabledIndexes, filteredOptions, open, value]);

  useEffect(() => {
    if (!open) return;
    const raf = window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const moveActive = (delta: number) => {
    if (enabledIndexes.length === 0) return;
    const currentPos = Math.max(0, enabledIndexes.indexOf(activeIndex));
    const nextPos = (currentPos + delta + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPos]);
  };

  const selectIndex = (index: number) => {
    const option = filteredOptions[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const triggerNode = (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-controls={`vitro-combobox-list-${listId}`}
      aria-haspopup="listbox"
      aria-activedescendant={open && activeIndex >= 0 ? `vitro-combobox-option-${listId}-${activeIndex}` : undefined}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className="gi"
      style={{
        minHeight: '44px',
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--r-interactive)',
        border: '1px solid var(--gi-bd)',
        background: 'var(--gi-bg)',
        cursor: 'pointer',
        fontSize: '13px',
        color: selected ? 'var(--t1)' : 'var(--t3)',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {selected?.label ?? placeholder}
      </span>
      <span aria-hidden="true" style={{ color: 'var(--t4)' }}>{'\u25BE'}</span>
    </button>
  );

  return (
    <div ref={rootRef} className={cn(className)} style={{ position: 'relative' }}>
      {triggerNode}

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="go"
          style={{
            ...overlayPosition.style,
            maxWidth: 'min(420px, calc(100vw - 16px))',
            maxHeight: '260px',
            zIndex: 260,
            display: 'grid',
            overflow: 'hidden',
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              moveActive(1);
              return;
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              moveActive(-1);
              return;
            }
            if (event.key === 'Enter' && activeIndex >= 0) {
              event.preventDefault();
              selectIndex(activeIndex);
              return;
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--div)' }}>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--t1)',
                fontSize: '13px',
              }}
            />
          </div>

          <div
            id={`vitro-combobox-list-${listId}`}
            role="listbox"
            style={{
              overflowY: 'auto',
              maxHeight: '200px',
              padding: '4px',
              display: 'grid',
              gap: '2px',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--t3)',
                }}
              >
                {emptyText}
              </div>
            ) : filteredOptions.map((option, index) => {
              const active = index === activeIndex;
              const selectedOption = option.value === value;

              return (
                <button
                  key={option.value}
                  id={`vitro-combobox-option-${listId}-${index}`}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selectedOption}
                  disabled={option.disabled}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => selectIndex(index)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 'var(--r-chip)',
                    background: active ? 'rgba(var(--gl), .1)' : 'transparent',
                    textAlign: 'left',
                    color: option.disabled ? 'var(--t4)' : selectedOption ? 'var(--p700)' : 'var(--t1)',
                    fontWeight: selectedOption ? 600 : 400,
                    fontSize: '13px',
                    cursor: option.disabled ? 'default' : 'pointer',
                    display: 'grid',
                    gap: option.description ? '3px' : 0,
                    opacity: option.disabled ? 0.55 : 1,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', color: 'var(--p500)', opacity: selectedOption ? 1 : 0 }}>{'\u2713'}</span>
                    <span>{option.label}</span>
                  </span>
                  {option.description && (
                    <span style={{ fontSize: '11px', color: 'var(--t3)', paddingLeft: '18px' }}>
                      {option.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
