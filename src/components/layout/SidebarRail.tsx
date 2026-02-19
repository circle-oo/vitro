import React, { useCallback, useMemo } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';
import {
  createSidebarShellStyle,
  getSidebarStatusDotStyle,
  getSidebarItemKey,
  invokeSidebarNavigate,
  MOBILE_SHEET_BACKDROP_STYLE,
  SIDEBAR_NAV_ICON_BASE_STYLE,
  SIDEBAR_SERVICE_ICON_BASE_STYLE,
  useMobileSheetDismiss,
} from './sidebarShared';

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

const SERVICE_ICON_STYLE: React.CSSProperties = {
  ...SIDEBAR_SERVICE_ICON_BASE_STYLE,
  width: '38px',
  height: '38px',
  borderRadius: '12px',
  fontSize: '14px',
  boxShadow: '0 6px 14px rgba(var(--gl), .28)',
  marginBottom: '6px',
};

const LIST_STYLE: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: '6px',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  width: '100%',
  minHeight: '46px',
  border: 0,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  fontSize: '13px',
};

const ITEM_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))',
  color: 'var(--p700)',
  fontWeight: 300,
};

const ITEM_INACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'transparent',
  color: 'var(--t3)',
  fontWeight: 200,
};

const ITEM_WIDE_LAYOUT_STYLE: React.CSSProperties = {
  justifyContent: 'flex-start',
  padding: '0 12px',
};

const ITEM_COMPACT_LAYOUT_STYLE: React.CSSProperties = {
  justifyContent: 'center',
  padding: 0,
};

const ITEM_ICON_ACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.9,
};

const ITEM_ICON_INACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.65,
};

const FLEX_GROW_STYLE: React.CSSProperties = {
  flex: 1,
};

const STATUS_BASE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '8px',
  fontSize: '11px',
  color: 'var(--t3)',
};

const STATUS_WIDE_STYLE: React.CSSProperties = {
  ...STATUS_BASE_STYLE,
  justifyContent: 'flex-start',
  padding: '8px 10px',
};

const STATUS_COMPACT_STYLE: React.CSSProperties = {
  ...STATUS_BASE_STYLE,
  justifyContent: 'center',
  padding: '8px 0',
};

interface SidebarRailItemButtonProps {
  item: SidebarNavItem;
  index: number;
  active: boolean;
  railWide: boolean;
  mobileSheet: boolean;
  onNavigate?: (index: number) => void;
  onMobileClose?: () => void;
}

const SidebarRailItemButton = React.memo(function SidebarRailItemButton({
  item,
  index,
  active,
  railWide,
  mobileSheet,
  onNavigate,
  onMobileClose,
}: SidebarRailItemButtonProps) {
  const onClick = useCallback(() => {
    invokeSidebarNavigate(index, onNavigate, item.onClick, mobileSheet, onMobileClose);
  }, [index, item.onClick, mobileSheet, onMobileClose, onNavigate]);

  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      ...(active ? ITEM_ACTIVE_STYLE : ITEM_INACTIVE_STYLE),
      ...(railWide ? ITEM_WIDE_LAYOUT_STYLE : ITEM_COMPACT_LAYOUT_STYLE),
    }),
    [active, railWide],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      title={item.label}
      aria-current={active ? 'page' : undefined}
      style={rowStyle}
    >
      <span style={active ? ITEM_ICON_ACTIVE_STYLE : ITEM_ICON_INACTIVE_STYLE}>
        {item.icon}
      </span>
      {railWide && <span>{item.label}</span>}
    </button>
  );
});

SidebarRailItemButton.displayName = 'SidebarRailItemButton';

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
  const shellStyle = useMemo<React.CSSProperties>(
    () => ({
      ...createSidebarShellStyle({
        width: railWide ? '248px' : '84px',
        padding: railWide ? '14px 12px' : '14px 8px',
        gap: '8px',
        alignItems: 'center',
        isMobile,
        fixed,
        mobileSheet,
        showSidebar: Boolean(showSidebar),
      }),
    }),
    [fixed, isMobile, mobileSheet, railWide, showSidebar],
  );
  const statusStyle = railWide ? STATUS_WIDE_STYLE : STATUS_COMPACT_STYLE;

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
        style={shellStyle}
      >
        <div style={SERVICE_ICON_STYLE}>
          {serviceIcon}
        </div>

        <div style={LIST_STYLE}>
          {items.map((item, index) => {
            return (
              <SidebarRailItemButton
                key={getSidebarItemKey(item, index)}
                item={item}
                index={index}
                active={index === activeIndex}
                railWide={railWide}
                mobileSheet={mobileSheet}
                onNavigate={onNavigate}
                onMobileClose={onMobileClose}
              />
            );
          })}
        </div>

        <div style={FLEX_GROW_STYLE} />

        {statusText && (
          <div style={statusStyle}>
            <span
              style={getSidebarStatusDotStyle(statusOk)}
            />
            {railWide && <span>{statusText}</span>}
          </div>
        )}
      </aside>
    </>
  );
}
