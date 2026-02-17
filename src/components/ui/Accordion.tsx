import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  allowMultiple?: boolean;
  className?: string;
}

function nextAccordionValue(
  current: string[],
  id: string,
  allowMultiple: boolean,
): string[] {
  const has = current.includes(id);
  if (allowMultiple) {
    return has ? current.filter((v) => v !== id) : [...current, id];
  }
  return has ? [] : [id];
}

export function Accordion({
  items,
  value,
  defaultValue = [],
  onValueChange,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const opened = isControlled ? value : internalValue;

  const openedSet = useMemo(() => new Set(opened), [opened]);

  const toggle = (id: string) => {
    const next = nextAccordionValue(opened, id, allowMultiple);
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn(className)} style={{ display: 'grid', gap: '8px' }}>
      {items.map((item) => {
        const open = openedSet.has(item.id);
        return (
          <div key={item.id} className="gc nh" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              aria-expanded={open}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                textAlign: 'left',
                color: 'var(--t1)',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.55 : 1,
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</span>
              <span
                aria-hidden="true"
                style={{
                  fontSize: '14px',
                  color: 'var(--t3)',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform .2s var(--ease)',
                  minWidth: '14px',
                }}
              >
                v
              </span>
            </button>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: open ? '1fr' : '0fr',
                transition: 'grid-template-rows .2s var(--ease)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    borderTop: '1px solid var(--div)',
                    padding: '12px 14px',
                    fontSize: '13px',
                    color: 'var(--t2)',
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface CollapsibleProps {
  title: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Collapsible({
  title,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
}: CollapsibleProps) {
  const isControlled = open != null;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? !!open : internalOpen;

  return (
    <Accordion
      className={className}
      items={[{ id: 'collapsible', title, content: children, disabled }]}
      value={isOpen ? ['collapsible'] : []}
      onValueChange={(value) => {
        if (disabled) return;
        const next = value.includes('collapsible');
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      }}
    />
  );
}
