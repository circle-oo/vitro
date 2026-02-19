import React, { useCallback, useMemo } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';
import {
  createSidebarShellStyle,
  getSidebarItemKey,
  invokeSidebarNavigate,
  MOBILE_SHEET_BACKDROP_STYLE,
  SIDEBAR_NAV_ICON_BASE_STYLE,
  SIDEBAR_SERVICE_ICON_BASE_STYLE,
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

const HEADER_STYLE: React.CSSProperties = {
  padding: '10px 12px 12px',
  borderBottom: '1px solid var(--div)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const HEADER_TEXT_STYLE: React.CSSProperties = {
  minWidth: 0,
};

const HEADER_TITLE_STYLE: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 300,
  letterSpacing: '-.02em',
};

const HEADER_SUBTITLE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
};

const LIST_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '8px',
  overflow: 'auto',
  paddingRight: '2px',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  border: 0,
  borderRadius: '14px',
  minHeight: '46px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '0 12px',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'background .18s ease, color .18s ease, transform .2s var(--ease), box-shadow .22s var(--ease)',
};

const ITEM_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'linear-gradient(120deg, rgba(var(--gl), .22), rgba(var(--gl), .09))',
  borderColor: 'color-mix(in srgb, var(--p500) 42%, var(--gi-bd))',
  color: 'var(--p700)',
  fontWeight: 300,
  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--p500) 40%, var(--gi-bd))',
  transform: 'translateX(2px)',
};

const ITEM_INACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'color-mix(in srgb, var(--gi-bg) 86%, transparent)',
  borderColor: 'var(--gi-bd)',
  color: 'var(--t2)',
  fontWeight: 200,
  boxShadow: 'inset 0 0 0 1px var(--gi-bd)',
  transform: 'translateX(0)',
};

const ITEM_LABEL_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const ITEM_ICON_ACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.92,
  transform: 'translateX(0) scale(1.04)',
  transition: 'transform .2s var(--ease), opacity .18s ease',
};

const ITEM_ICON_INACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.66,
  transform: 'translateX(0) scale(1)',
  transition: 'transform .2s var(--ease), opacity .18s ease',
};

interface SidebarDockItemButtonProps {
  item: SidebarNavItem;
  index: number;
  active: boolean;
  mobileSheet: boolean;
  onNavigate?: (index: number) => void;
  onMobileClose?: () => void;
}

const SidebarDockItemButton = React.memo(function SidebarDockItemButton({
  item,
  index,
  active,
  mobileSheet,
  onNavigate,
  onMobileClose,
}: SidebarDockItemButtonProps) {
  const onClick = useCallback(() => {
    invokeSidebarNavigate(index, onNavigate, item.onClick, mobileSheet, onMobileClose);
  }, [index, item.onClick, mobileSheet, onMobileClose, onNavigate]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={active ? ITEM_ACTIVE_STYLE : ITEM_INACTIVE_STYLE}
    >
      <span style={active ? ITEM_ICON_ACTIVE_STYLE : ITEM_ICON_INACTIVE_STYLE}>
        {item.icon}
      </span>
      <span style={ITEM_LABEL_STYLE}>{item.label}</span>
    </button>
  );
});

SidebarDockItemButton.displayName = 'SidebarDockItemButton';

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
  const shellStyle = useMemo<React.CSSProperties>(
    () => ({
      ...createSidebarShellStyle({
        width: isMobile ? '260px' : '244px',
        padding: '14px 12px',
        gap: '10px',
        isMobile,
        fixed,
        mobileSheet,
        showSidebar: Boolean(showSidebar),
      }),
    }),
    [fixed, isMobile, mobileSheet, showSidebar],
  );

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
        <div style={HEADER_STYLE}>
          <div
            style={{
              ...SIDEBAR_SERVICE_ICON_BASE_STYLE,
            }}
          >
            {serviceIcon}
          </div>
          <div style={HEADER_TEXT_STYLE}>
            <div style={HEADER_TITLE_STYLE}>{serviceName}</div>
            <div style={HEADER_SUBTITLE_STYLE}>{subtitle}</div>
          </div>
        </div>

        <div style={LIST_STYLE}>
          {items.map((item, index) => {
            return (
              <SidebarDockItemButton
                key={getSidebarItemKey(item, index)}
                item={item}
                index={index}
                active={index === activeIndex}
                mobileSheet={mobileSheet}
                onNavigate={onNavigate}
                onMobileClose={onMobileClose}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
}
