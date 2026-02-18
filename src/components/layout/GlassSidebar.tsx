import React from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import { useControllableState } from '../../hooks/useControllableState';
import {
  getSidebarItemKey,
  MOBILE_SHEET_BACKDROP_STYLE,
  useMobileSheetDismiss,
} from './sidebarShared';

export interface SidebarNavItem {
  id?: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface GlassSidebarProps {
  service?: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: SidebarNavItem[];
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
  /** Render as a fixed app shell sidebar. Set false for embedded previews. */
  fixed?: boolean;
  /** Header subtitle under the service name */
  workspaceLabel?: string;
  /** Accessible label for mobile close button */
  closeMenuLabel?: string;
  /** Accessible label for desktop expand button */
  expandSidebarLabel?: string;
  /** Accessible label for desktop collapse button */
  collapseSidebarLabel?: string;
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
  fixed = true,
  workspaceLabel = 'Vitro workspace',
  closeMenuLabel = 'Close menu',
  expandSidebarLabel = 'Expand sidebar',
  collapseSidebarLabel = 'Collapse sidebar',
}: GlassSidebarProps) {
  const isMobile = useMobile();
  const [isCollapsed, setCollapsed] = useControllableState<boolean>({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });
  const mobileSheet = fixed && isMobile;

  const showSidebar = mobileSheet ? mobileOpen : true;

  const handleNav = (i: number) => {
    onNavigate?.(i);
    items[i]?.onClick?.();
    if (mobileSheet) onMobileClose?.();
  };

  useMobileSheetDismiss(Boolean(mobileSheet && mobileOpen), onMobileClose);

  const toggleCollapsed = () => {
    setCollapsed(!isCollapsed);
  };

  const sidebarWidth = isMobile ? '282px' : isCollapsed ? '70px' : '252px';

  return (
    <>
      {mobileSheet && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            ...MOBILE_SHEET_BACKDROP_STYLE,
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
          position: fixed ? 'fixed' : 'relative',
          top: fixed ? (isMobile ? 0 : '12px') : undefined,
          left: fixed ? (isMobile ? 0 : '12px') : undefined,
          bottom: fixed ? (isMobile ? 0 : '12px') : undefined,
          zIndex: 20,
          borderRadius: fixed ? (isMobile ? '0 22px 22px 0' : '22px') : '18px',
          transition: 'transform .3s cubic-bezier(.22, 1, .36, 1), width .25s cubic-bezier(.22, 1, .36, 1)',
          overflow: 'hidden',
          transform: mobileSheet && !showSidebar ? 'translateX(-110%)' : 'translateX(0)',
          pointerEvents: mobileSheet && !showSidebar ? 'none' : 'auto',
          minHeight: fixed ? undefined : '320px',
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
              fontWeight: 300,
            }}
          >
            {serviceIcon}
          </div>
          {(isMobile || !isCollapsed) && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 300, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{serviceName}</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '-1px' }}>{workspaceLabel}</div>
            </div>
          )}

          {mobileSheet && (
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
              aria-label={closeMenuLabel}
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
                key={getSidebarItemKey(item, i)}
                type="button"
                onClick={() => handleNav(i)}
                aria-current={active ? 'page' : undefined}
                title={!isMobile && isCollapsed ? item.label : undefined}
                style={{
                  border: 'none',
                  padding: !isMobile && isCollapsed ? '11px 9px' : '11px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: active ? 300 : 200,
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
                <span style={{ width: '20px', height: '20px', opacity: active ? .88 : .56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--accent)', fontSize: '18px', transform: 'translateX(-4px)' }}>
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
              color: 'var(--t3)',
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
            aria-label={isCollapsed ? expandSidebarLabel : collapseSidebarLabel}
          >
            {isCollapsed ? '>>' : '<<'}
          </button>
        )}
      </aside>
    </>
  );
}
