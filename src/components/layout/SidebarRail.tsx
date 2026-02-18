import React, { useEffect } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';

export interface SidebarRailProps {
  service?: string;
  serviceIcon: React.ReactNode;
  items: SidebarNavItem[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  statusText?: string;
  statusOk?: boolean;
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Render as a fixed app shell sidebar. Set false for embedded previews. */
  fixed?: boolean;
}

export function SidebarRail({
  service,
  serviceIcon,
  items,
  activeIndex = 0,
  onNavigate,
  statusText,
  statusOk = true,
  className,
  mobileOpen,
  onMobileClose,
  fixed = true,
}: SidebarRailProps) {
  const isMobile = useMobile();
  const mobileSheet = fixed && isMobile;
  const railWide = isMobile || !fixed;
  const showSidebar = mobileSheet ? mobileOpen : true;

  useEffect(() => {
    if (!mobileSheet || !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileSheet, mobileOpen, onMobileClose]);

  const handleNav = (index: number) => {
    onNavigate?.(index);
    items[index]?.onClick?.();
    if (mobileSheet) onMobileClose?.();
  };

  const getNavItemKey = (item: SidebarNavItem, index: number) =>
    item.id ?? item.href ?? `${item.label}-${index}`;

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
          width: railWide ? '248px' : '84px',
          padding: railWide ? '14px 12px' : '14px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
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
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--p500), var(--p400))',
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 300,
            boxShadow: '0 6px 14px rgba(var(--gl), .28)',
            marginBottom: '6px',
            flexShrink: 0,
          }}
        >
          {serviceIcon}
        </div>

        <div style={{ width: '100%', display: 'grid', gap: '6px' }}>
          {items.map((item, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={getNavItemKey(item, index)}
                type="button"
                onClick={() => handleNav(index)}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                style={{
                  width: '100%',
                  minHeight: '46px',
                  border: 0,
                  borderRadius: '12px',
                  background: active
                    ? 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))'
                    : 'transparent',
                  color: active ? 'var(--p700)' : 'var(--t3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: railWide ? 'flex-start' : 'center',
                  gap: '10px',
                  padding: railWide ? '0 12px' : 0,
                  cursor: 'pointer',
                  fontWeight: active ? 300 : 200,
                  fontSize: '13px',
                }}
              >
                <span style={{ width: '20px', height: '20px', opacity: active ? .9 : .65, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--accent)', fontSize: '18px', transform: 'translateX(-4px)' }}>
                  {item.icon}
                </span>
                {railWide && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {statusText && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: railWide ? 'flex-start' : 'center',
              width: '100%',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--t3)',
              padding: railWide ? '8px 10px' : '8px 0',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: statusOk ? 'var(--ok)' : 'var(--err)',
                boxShadow: `0 0 8px ${statusOk ? 'rgba(16,185,129,.4)' : 'rgba(244,63,94,.4)'}`,
              }}
            />
            {railWide && <span>{statusText}</span>}
          </div>
        )}
      </aside>
    </>
  );
}
