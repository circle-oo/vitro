import React, { useState, useEffect } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface GlassSidebarProps {
  service?: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: NavItem[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  statusText?: string;
  statusOk?: boolean;
  className?: string;
  /** Controlled collapsed state (desktop only) */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state (desktop only) */
  defaultCollapsed?: boolean;
  /** Notifies on desktop collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Mobile: controlled open state */
  mobileOpen?: boolean;
  /** Mobile: callback when sidebar requests close */
  onMobileClose?: () => void;
}

export function GlassSidebar({
  service,
  serviceName,
  serviceIcon,
  items,
  activeIndex = 0,
  onNavigate,
  statusText,
  statusOk = true,
  className,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}: GlassSidebarProps) {
  const isMobile = useMobile();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? internalCollapsed;

  const showSidebar = isMobile ? mobileOpen : true;

  const handleNav = (i: number) => {
    onNavigate?.(i);
    items[i]?.onClick?.();
    if (isMobile) onMobileClose?.();
  };

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, mobileOpen, onMobileClose]);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (collapsed == null) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const sidebarWidth = isMobile ? '282px' : isCollapsed ? '70px' : '252px';

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.34)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 19,
            transition: 'opacity .2s',
          }}
        />
      )}

      <aside
        className={`gs ${className ?? ''}`}
        data-svc={service}
        style={{
          width: sidebarWidth,
          padding: !isMobile && isCollapsed ? '14px 8px' : '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          position: 'fixed',
          top: isMobile ? 0 : '12px',
          left: isMobile ? 0 : '12px',
          bottom: isMobile ? 0 : '12px',
          zIndex: 20,
          borderRadius: isMobile ? '0 22px 22px 0' : '22px',
          transition: 'transform .3s cubic-bezier(.22, 1, .36, 1), width .25s cubic-bezier(.22, 1, .36, 1)',
          overflow: 'hidden',
          transform: isMobile && !showSidebar ? 'translateX(-110%)' : 'translateX(0)',
          pointerEvents: isMobile && !showSidebar ? 'none' : 'auto',
        }}
      >
        <div
          style={{
            padding: !isMobile && isCollapsed ? '8px 4px 16px' : '10px 12px 16px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--div)',
            flexShrink: 0,
            justifyContent: !isMobile && isCollapsed ? 'center' : undefined,
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--p500), var(--p400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white',
              boxShadow: '0 6px 14px rgba(var(--gl), .28)',
              flexShrink: 0,
              fontWeight: 700,
            }}
          >
            {serviceIcon}
          </div>
          {(isMobile || !isCollapsed) && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{serviceName}</div>
              <div style={{ fontSize: '11px', color: 'var(--t4)', marginTop: '-1px' }}>Vitro workspace</div>
            </div>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: 'var(--t3)',
                marginLeft: 'auto',
              }}
              aria-label="Close menu"
            >
              {'\u00D7'}
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gap: '4px' }}>
          {items.map((item, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleNav(i)}
                aria-current={active ? 'page' : undefined}
                title={!isMobile && isCollapsed ? item.label : undefined}
                style={{
                  border: 'none',
                  padding: !isMobile && isCollapsed ? '11px 9px' : '11px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--p700)' : 'var(--t2)',
                  background: active ? 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minHeight: '42px',
                  transition: 'all .15s',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  justifyContent: !isMobile && isCollapsed ? 'center' : undefined,
                  position: 'relative',
                  textAlign: 'left',
                }}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: '2px',
                      borderRadius: '4px',
                      background: 'var(--p500)',
                    }}
                  />
                )}
                <span style={{ width: '18px', height: '18px', opacity: active ? .88 : .56, flexShrink: 0 }}>
                  {item.icon}
                </span>
                {(isMobile || !isCollapsed) && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {statusText && (
          <div
            style={{
              padding: !isMobile && isCollapsed ? '8px 0' : '8px 12px',
              fontSize: '11px',
              color: 'var(--t4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: !isMobile && isCollapsed ? 'center' : undefined,
              gap: '8px',
            }}
          >
            <span
              className="pulse"
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: statusOk ? 'var(--ok)' : 'var(--err)',
                boxShadow: `0 0 8px ${statusOk ? 'rgba(16,185,129,.4)' : 'rgba(244,63,94,.4)'}`,
              }}
            />
            {(isMobile || !isCollapsed) && <span>{statusText}</span>}
          </div>
        )}

        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapsed}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: 'var(--t3)',
              fontSize: '11px',
              alignSelf: 'center',
              flexShrink: 0,
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '>>' : '<<'}
          </button>
        )}
      </aside>
    </>
  );
}
