import React, { useState, useEffect, useRef } from 'react';

interface CommandItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  placeholder?: string;
}

export function CommandPalette({ open, onClose, groups, placeholder = 'Search...' }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const lq = query.toLowerCase();

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => item.label.toLowerCase().includes(lq)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div
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
        <div style={{ padding: '8px', overflowY: 'auto', flex: 1 }}>
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <div
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.8px',
                  color: 'var(--t4)',
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--t2)',
                    cursor: 'pointer',
                    transition: 'background .1s',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(var(--gl), .10)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--p700)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.color = 'var(--t2)';
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
                        fontFamily: 'var(--mono)',
                        color: 'var(--t4)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--div)',
                      }}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
