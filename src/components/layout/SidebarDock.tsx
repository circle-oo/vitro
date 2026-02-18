import React from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';
import {
  getSidebarItemKey,
  MOBILE_SHEET_BACKDROP_STYLE,
  useMobileSheetDismiss,
} from './sidebarShared';

export interface SidebarDockProps {
  service?: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: SidebarNavItem[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Render as a fixed app shell sidebar. Set false for embedded previews. */
  fixed?: boolean;
  /** Header subtitle under service name */
  subtitle?: string;
}

export function SidebarDock({
  service,
  serviceName,
  serviceIcon,
  items,
  activeIndex = 0,
  onNavigate,
  className,
  mobileOpen,
  onMobileClose,
  fixed = true,
  subtitle = 'Dock navigation',
}: SidebarDockProps) {
  const isMobile = useMobile();
  const mobileSheet = fixed && isMobile;
  const showSidebar = mobileSheet ? mobileOpen : true;

  useMobileSheetDismiss(Boolean(mobileSheet && mobileOpen), onMobileClose);

  return (
    <>
      {mobileSheet && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={MOBILE_SHEET_BACKDROP_STYLE}
        />
      )}

      <aside
        className={`gs ${className ?? ''}`}
        data-svc={service}
        style={{
          width: isMobile ? '260px' : '244px',
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
              fontWeight: 300,
              flexShrink: 0,
            }}
          >
            {serviceIcon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 300, letterSpacing: '-.02em' }}>{serviceName}</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '8px', overflow: 'auto', paddingRight: '2px' }}>
          {items.map((item, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={getSidebarItemKey(item, index)}
                type="button"
                onClick={() => {
                  onNavigate?.(index);
                  item.onClick?.();
                  if (mobileSheet) onMobileClose?.();
                }}
                aria-current={active ? 'page' : undefined}
                style={{
                  border: 0,
                  borderRadius: '14px',
                  minHeight: '46px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 12px',
                  textAlign: 'left',
                  background: active
                    ? 'linear-gradient(120deg, rgba(var(--gl), .22), rgba(var(--gl), .09))'
                    : 'color-mix(in srgb, var(--gi-bg) 86%, transparent)',
                  borderColor: active ? 'color-mix(in srgb, var(--p500) 42%, var(--gi-bd))' : 'var(--gi-bd)',
                  color: active ? 'var(--p700)' : 'var(--t2)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: active ? 300 : 200,
                  boxShadow: active ? 'inset 0 0 0 1px color-mix(in srgb, var(--p500) 40%, var(--gi-bd))' : 'inset 0 0 0 1px var(--gi-bd)',
                }}
              >
                <span style={{ width: '20px', height: '20px', opacity: active ? .92 : .66, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--accent)', fontSize: '18px', transform: 'translateX(-4px)' }}>
                  {item.icon}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
