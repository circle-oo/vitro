import React, { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
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

interface SearchIndexedOption extends ComboboxOption {
  searchText: string;
}

const ROOT_STYLE: React.CSSProperties = {
  position: 'relative',
};

const TRIGGER_BASE_STYLE: React.CSSProperties = {
  minHeight: '44px',
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--r-interactive)',
  border: '1px solid var(--gi-bd)',
  background: 'var(--gi-bg)',
  cursor: 'pointer',
  fontSize: '13px',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
};

const TRIGGER_SELECTED_STYLE: React.CSSProperties = {
  ...TRIGGER_BASE_STYLE,
  color: 'var(--t1)',
};

const TRIGGER_PLACEHOLDER_STYLE: React.CSSProperties = {
  ...TRIGGER_BASE_STYLE,
  color: 'var(--t3)',
};

const TRIGGER_LABEL_STYLE: React.CSSProperties = {
  minWidth: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const TRIGGER_ICON_STYLE: React.CSSProperties = {
  color: 'var(--t4)',
};

const DROPDOWN_STYLE: React.CSSProperties = {
  maxWidth: 'min(420px, calc(100vw - 16px))',
  maxHeight: '260px',
  zIndex: 260,
  display: 'grid',
  overflow: 'hidden',
};

const SEARCH_WRAPPER_STYLE: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--div)',
};

const SEARCH_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'var(--t1)',
  fontSize: '13px',
};

const LISTBOX_STYLE: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '200px',
  padding: '4px',
  display: 'grid',
  gap: '2px',
};

const EMPTY_STYLE: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '12px',
  color: 'var(--t3)',
};

const OPTION_ROW_BASE_STYLE: React.CSSProperties = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: 'var(--r-chip)',
  textAlign: 'left',
  fontSize: '13px',
  display: 'grid',
};

const OPTION_TEXT_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const OPTION_CHECK_STYLE: React.CSSProperties = {
  width: '10px',
  color: 'var(--p500)',
};

const OPTION_DESCRIPTION_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  paddingLeft: '18px',
};

interface ComboboxOptionRowProps {
  option: SearchIndexedOption;
  index: number;
  listId: string;
  active: boolean;
  selected: boolean;
  onSelectIndex: (index: number) => void;
  onSetActiveIndex: (index: number) => void;
  onSetOptionRef: (index: number, element: HTMLButtonElement | null) => void;
}

const ComboboxOptionRow = React.memo(function ComboboxOptionRow({
  option,
  index,
  listId,
  active,
  selected,
  onSelectIndex,
  onSetActiveIndex,
  onSetOptionRef,
}: ComboboxOptionRowProps) {
  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      ...OPTION_ROW_BASE_STYLE,
      background: active ? 'rgba(var(--gl), .1)' : 'transparent',
      color: option.disabled ? 'var(--t4)' : selected ? 'var(--p700)' : 'var(--t1)',
      fontWeight: selected ? 600 : 400,
      cursor: option.disabled ? 'default' : 'pointer',
      rowGap: option.description ? '3px' : undefined,
      opacity: option.disabled ? 0.55 : 1,
    }),
    [active, option.description, option.disabled, selected],
  );

  const checkStyle = useMemo<React.CSSProperties>(
    () => ({
      ...OPTION_CHECK_STYLE,
      opacity: selected ? 1 : 0,
    }),
    [selected],
  );

  return (
    <button
      id={`vitro-combobox-option-${listId}-${index}`}
      ref={(element) => {
        onSetOptionRef(index, element);
      }}
      type="button"
      role="option"
      aria-selected={selected}
      disabled={option.disabled}
      onMouseEnter={() => !option.disabled && onSetActiveIndex(index)}
      onFocus={() => !option.disabled && onSetActiveIndex(index)}
      onClick={() => onSelectIndex(index)}
      style={rowStyle}
    >
      <span style={OPTION_TEXT_STYLE}>
        <span style={checkStyle}>{'\u2713'}</span>
        <span>{option.label}</span>
      </span>
      {option.description && (
        <span style={OPTION_DESCRIPTION_STYLE}>
          {option.description}
        </span>
      )}
    </button>
  );
});

ComboboxOptionRow.displayName = 'ComboboxOptionRow';

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

  const normalizedQuery = query.trim().toLowerCase();
  const deferredQuery = useDeferredValue(normalizedQuery);

  const indexedOptions = useMemo<SearchIndexedOption[]>(
    () =>
      options.map((option) => ({
        ...option,
        searchText: `${option.label}\n${option.description ?? ''}\n${option.value}`.toLowerCase(),
      })),
    [options],
  );

  const filteredOptions = useMemo(
    () => {
      if (!deferredQuery) return indexedOptions;
      return indexedOptions.filter((option) => option.searchText.includes(deferredQuery));
    },
    [deferredQuery, indexedOptions],
  );

  const enabledIndexes = useMemo(() => {
    const indexes: number[] = [];
    for (let index = 0; index < filteredOptions.length; index += 1) {
      if (!filteredOptions[index]?.disabled) indexes.push(index);
    }
    return indexes;
  }, [filteredOptions]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const setOptionRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    optionRefs.current[index] = element;
  }, []);

  const moveActive = useCallback((delta: number) => {
    if (enabledIndexes.length === 0) return;
    setActiveIndex((previous) => {
      const currentPos = enabledIndexes.indexOf(previous);
      const startPos = currentPos >= 0 ? currentPos : 0;
      const nextPos = (startPos + delta + enabledIndexes.length) % enabledIndexes.length;
      return enabledIndexes[nextPos] ?? previous;
    });
  }, [enabledIndexes]);

  const selectIndex = useCallback((index: number) => {
    const option = filteredOptions[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    closeDropdown();
  }, [closeDropdown, filteredOptions, onChange]);

  const onTriggerClick = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const onTriggerKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  }, []);

  const onDropdownKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
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

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectIndex(activeIndex);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown();
    }
  }, [activeIndex, closeDropdown, enabledIndexes, moveActive, selectIndex]);

  const dropdownStyle = useMemo<React.CSSProperties>(
    () => ({
      ...overlayPosition.style,
      ...DROPDOWN_STYLE,
    }),
    [overlayPosition.style],
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
    onDismiss: closeDropdown,
  });

  useEffect(() => {
    if (!open) return;
    setActiveIndex((previous) => {
      if (enabledIndexes.length === 0) return -1;
      if (previous >= 0 && previous < filteredOptions.length && !filteredOptions[previous]?.disabled) {
        return previous;
      }
      const selectedIndex = filteredOptions.findIndex((opt) => opt.value === value && !opt.disabled);
      if (selectedIndex >= 0) return selectedIndex;
      return enabledIndexes[0] ?? -1;
    });
    optionRefs.current.length = filteredOptions.length;
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

  return (
    <div ref={rootRef} className={cn(className)} style={ROOT_STYLE}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`vitro-combobox-list-${listId}`}
        aria-haspopup="listbox"
        aria-activedescendant={open && activeIndex >= 0 ? `vitro-combobox-option-${listId}-${activeIndex}` : undefined}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className="gi"
        style={selected ? TRIGGER_SELECTED_STYLE : TRIGGER_PLACEHOLDER_STYLE}
      >
        <span style={TRIGGER_LABEL_STYLE}>
          {selected?.label ?? placeholder}
        </span>
        <span aria-hidden="true" style={TRIGGER_ICON_STYLE}>{'\u25BE'}</span>
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="go"
          style={dropdownStyle}
          onKeyDown={onDropdownKeyDown}
        >
          <div style={SEARCH_WRAPPER_STYLE}>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              style={SEARCH_INPUT_STYLE}
            />
          </div>

          <div
            id={`vitro-combobox-list-${listId}`}
            role="listbox"
            style={LISTBOX_STYLE}
          >
            {filteredOptions.length === 0 ? (
              <div style={EMPTY_STYLE}>
                {emptyText}
              </div>
            ) : filteredOptions.map((option, index) => {
              return (
                <ComboboxOptionRow
                  key={option.value}
                  option={option}
                  index={index}
                  listId={listId}
                  active={index === activeIndex}
                  selected={option.value === value}
                  onSelectIndex={selectIndex}
                  onSetActiveIndex={setActiveIndex}
                  onSetOptionRef={setOptionRef}
                />
              );
            })}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
