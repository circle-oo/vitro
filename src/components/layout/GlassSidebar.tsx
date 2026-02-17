import React, { useState, useEffect } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface GlassSidebarProps {
  service: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: NavItem[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  statusText?: string;
  statusOk?: boolean;
  className?: string;
  /** Mobile: controlled open state */
  mobileOpen?: boolean;
  /** Mobile: callback when sidebar requests close */
  onMobileClose?: () => void;
}

export function GlassSidebar({
  serviceName,
  serviceIcon,
  items,
  activeIndex = 0,
  onNavigate,
  statusText,
  statusOk = true,
  className,
  mobileOpen,
  onMobileClose,
}: GlassSidebarProps) {
  const isMobile = useMobile();
  const [collapsed, setCollapsed] = useState(false);

  // On mobile, drawer is controlled by mobileOpen prop
  const showSidebar = isMobile ? mobileOpen : true;

  // Close mobile drawer when navigating
  const handleNav = (i: number) => {
    onNavigate?.(i);
    items[i]?.onClick?.();
    if (isMobile) onMobileClose?.();
  };

  // Close drawer on Escape
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, mobileOpen, onMobileClose]);

  const sidebarWidth = isMobile ? '280px' : collapsed ? '64px' : '250px';

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.3)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            zIndex: 19,
            transition: 'opacity .2s',
          }}
        />
      )}

      <aside
        className={`gs ${className ?? ''}`}
        style={{
          width: sidebarWidth,
          padding: (!isMobile && collapsed) ? '16px 8px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          position: 'fixed',
          top: isMobile ? '0' : '12px',
          left: isMobile ? '0' : '12px',
          bottom: isMobile ? '0' : '12px',
          zIndex: 20,
          borderRadius: isMobile ? '0 20px 20px 0' : '20px',
          transition: 'transform .3s cubic-bezier(.22, 1, .36, 1), width .25s cubic-bezier(.22, 1, .36, 1)',
          overflow: 'hidden',
          transform: (isMobile && !showSidebar) ? 'translateX(-110%)' : 'translateX(0)',
          pointerEvents: (isMobile && !showSidebar) ? 'none' : 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: (!isMobile && collapsed) ? '12px 4px 18px' : '12px 14px 18px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--div)',
            flexShrink: 0,
            justifyContent: (!isMobile && collapsed) ? 'center' : undefined,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--p500), var(--p400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white',
              boxShadow: '0 2px 8px rgba(var(--gl), .25)',
              flexShrink: 0,
            }}
          >
            {serviceIcon}
          </div>
          {(isMobile || !collapsed) && (
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-.3px', whiteSpace: 'nowrap', flex: 1 }}>
              {serviceName}
            </span>
          )}
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onMobileClose}
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
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Nav Items */}
        {items.map((item, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={i}
              onClick={() => handleNav(i)}
              style={{
                padding: (!isMobile && collapsed) ? '10px' : '10px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--p700)' : 'var(--t2)',
                background: active ? 'rgba(var(--gl), .13)' : undefined,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minHeight: '42px',
                transition: 'all .15s',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                justifyContent: (!isMobile && collapsed) ? 'center' : undefined,
              }}
            >
              <span style={{ width: '18px', height: '18px', opacity: active ? 0.85 : 0.5, flexShrink: 0 }}>
                {item.icon}
              </span>
              {(isMobile || !collapsed) && <span>{item.label}</span>}
            </div>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Status */}
        {statusText && (
          <div style={{ padding: '8px 14px', fontSize: '11px', color: 'var(--t4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="pulse"
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: statusOk ? 'var(--ok)' : 'var(--err)',
                boxShadow: `0 0 6px ${statusOk ? 'rgba(16,185,129,.35)' : 'rgba(244,63,94,.35)'}`,
              }}
            />
            {(isMobile || !collapsed) && <span>{statusText}</span>}
          </div>
        )}

        {/* Collapse Button — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
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
              fontSize: '14px',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          >
            {collapsed ? '\u25B6' : '\u25C0'}
          </button>
        )}
      </aside>
    </>
  );
}
