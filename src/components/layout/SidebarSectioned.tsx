import React, { useEffect } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';

export interface SidebarSection {
  id: string;
  label: string;
  itemIds: string[];
}

export interface SidebarSectionedProps {
  service?: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: SidebarNavItem[];
  sections: SidebarSection[];
  activeItemId?: string;
  onNavigate?: (itemId: string, index: number) => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Render as a fixed app shell sidebar. Set false for embedded previews. */
  fixed?: boolean;
}

export function SidebarSectioned({
  service,
  serviceName,
  serviceIcon,
  items,
  sections,
  activeItemId,
  onNavigate,
  className,
  mobileOpen,
  onMobileClose,
  fixed = true,
}: SidebarSectionedProps) {
  const isMobile = useMobile();
  const mobileSheet = fixed && isMobile;
  const showSidebar = mobileSheet ? mobileOpen : true;

  useEffect(() => {
    if (!mobileSheet || !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileSheet, mobileOpen, onMobileClose]);

  const mapById = new Map<string, { item: SidebarNavItem; index: number }>();
  items.forEach((item, index) => {
    const id = item.id ?? String(index);
    mapById.set(id, { item, index });
  });

  return (
    <>
      {mobileSheet && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.34)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 19,
          }}
        />
      )}

      <aside
        className={`gs ${className ?? ''}`}
        data-svc={service}
        style={{
          width: '282px',
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          position: fixed ? 'fixed' : 'relative',
          top: fixed ? (isMobile ? 0 : '12px') : undefined,
          left: fixed ? (isMobile ? 0 : '12px') : undefined,
          bottom: fixed ? (isMobile ? 0 : '12px') : undefined,
          zIndex: 20,
          borderRadius: fixed ? (isMobile ? '0 22px 22px 0' : '22px') : '18px',
          overflow: 'hidden',
          transform: mobileSheet && !showSidebar ? 'translateX(-110%)' : 'translateX(0)',
          transition: 'transform .3s cubic-bezier(.22, 1, .36, 1)',
          pointerEvents: mobileSheet && !showSidebar ? 'none' : 'auto',
          minHeight: fixed ? undefined : '320px',
        }}
      >
        <div
          style={{
            padding: '10px 12px 12px',
            borderBottom: '1px solid var(--div)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--p500), var(--p400))',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {serviceIcon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-.02em' }}>{serviceName}</div>
            <div style={{ fontSize: '11px', color: 'var(--t4)' }}>Sectioned sidebar</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px', overflow: 'auto', paddingRight: '2px' }}>
          {sections.map((section) => (
            <div key={section.id} style={{ display: 'grid', gap: '5px' }}>
              <div style={{ fontSize: '10px', color: 'var(--t4)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '0 6px' }}>
                {section.label}
              </div>

              {section.itemIds.map((id) => {
                const resolved = mapById.get(id);
                if (!resolved) return null;
                const { item, index } = resolved;
                const active = id === activeItemId;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onNavigate?.(id, index);
                      item.onClick?.();
                      if (mobileSheet) onMobileClose?.();
                    }}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      border: 0,
                      borderRadius: '12px',
                      minHeight: '40px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0 12px',
                      textAlign: 'left',
                      background: active ? 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))' : 'transparent',
                      color: active ? 'var(--p700)' : 'var(--t2)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    <span style={{ width: '18px', height: '18px', opacity: active ? .9 : .65, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
