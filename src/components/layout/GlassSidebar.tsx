import React, { useCallback, useMemo } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import { useControllableState } from '../../hooks/useControllableState';
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

const BACKDROP_STYLE: React.CSSProperties = {
  ...MOBILE_SHEET_BACKDROP_STYLE,
  transition: 'opacity .2s',
};

const SERVICE_ICON_STYLE: React.CSSProperties = {
  ...SIDEBAR_SERVICE_ICON_BASE_STYLE,
  fontSize: '14px',
  boxShadow: '0 6px 14px rgba(var(--gl), .28)',
};

const HEADER_BASE_STYLE: React.CSSProperties = {
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderBottom: '1px solid var(--div)',
  flexShrink: 0,
};

const HEADER_COLLAPSED_STYLE: React.CSSProperties = {
  ...HEADER_BASE_STYLE,
  padding: '8px 4px 16px',
  justifyContent: 'center',
};

const HEADER_EXPANDED_STYLE: React.CSSProperties = {
  ...HEADER_BASE_STYLE,
  padding: '10px 12px 16px',
};

const HEADER_TEXT_STYLE: React.CSSProperties = {
  minWidth: 0,
};

const HEADER_TITLE_STYLE: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 300,
  letterSpacing: '-.02em',
  whiteSpace: 'nowrap',
};

const HEADER_SUBTITLE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  marginTop: '-1px',
};

const CLOSE_MOBILE_BUTTON_STYLE: React.CSSProperties = {
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
};

const ITEM_LIST_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '4px',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  border: 'none',
  borderRadius: '12px',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minHeight: '42px',
  transition: 'all .15s',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  position: 'relative',
  textAlign: 'left',
};

const ITEM_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  fontWeight: 300,
  color: 'var(--p700)',
  background: 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))',
};

const ITEM_INACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  fontWeight: 200,
  color: 'var(--t2)',
  background: 'transparent',
};

const ITEM_COMPACT_LAYOUT_STYLE: React.CSSProperties = {
  padding: '11px 9px',
  justifyContent: 'center',
};

const ITEM_EXPANDED_LAYOUT_STYLE: React.CSSProperties = {
  padding: '11px 12px',
  justifyContent: 'flex-start',
};

const ITEM_ACTIVE_MARKER_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 8,
  bottom: 8,
  width: '2px',
  borderRadius: '4px',
  background: 'var(--p500)',
};

const ITEM_ICON_ACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.88,
};

const ITEM_ICON_INACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.56,
};

const FLEX_GROW_STYLE: React.CSSProperties = {
  flex: 1,
};

const STATUS_BASE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const STATUS_COMPACT_STYLE: React.CSSProperties = {
  ...STATUS_BASE_STYLE,
  padding: '8px 0',
  justifyContent: 'center',
};

const STATUS_EXPANDED_STYLE: React.CSSProperties = {
  ...STATUS_BASE_STYLE,
  padding: '8px 12px',
  justifyContent: 'flex-start',
};

const COLLAPSE_BUTTON_STYLE: React.CSSProperties = {
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
};

interface GlassSidebarItemButtonProps {
  item: SidebarNavItem;
  index: number;
  active: boolean;
  compact: boolean;
  mobileSheet: boolean;
  isMobile: boolean;
  onNavigate?: (index: number) => void;
  onMobileClose?: () => void;
}

const GlassSidebarItemButton = React.memo(function GlassSidebarItemButton({
  item,
  index,
  active,
  compact,
  mobileSheet,
  isMobile,
  onNavigate,
  onMobileClose,
}: GlassSidebarItemButtonProps) {
  const onClick = useCallback(() => {
    invokeSidebarNavigate(index, onNavigate, item.onClick, mobileSheet, onMobileClose);
  }, [index, item.onClick, mobileSheet, onMobileClose, onNavigate]);

  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      ...(active ? ITEM_ACTIVE_STYLE : ITEM_INACTIVE_STYLE),
      ...(compact ? ITEM_COMPACT_LAYOUT_STYLE : ITEM_EXPANDED_LAYOUT_STYLE),
    }),
    [active, compact],
  );

  const showLabel = isMobile || !compact;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={compact && !isMobile ? item.label : undefined}
      style={rowStyle}
    >
      {active && (
        <span
          aria-hidden="true"
          style={ITEM_ACTIVE_MARKER_STYLE}
        />
      )}
      <span style={active ? ITEM_ICON_ACTIVE_STYLE : ITEM_ICON_INACTIVE_STYLE}>
        {item.icon}
      </span>
      {showLabel && <span>{item.label}</span>}
    </button>
  );
});

GlassSidebarItemButton.displayName = 'GlassSidebarItemButton';

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
  const compact = !isMobile && isCollapsed;

  const showSidebar = mobileSheet ? mobileOpen : true;
  const sidebarWidth = isMobile ? '282px' : isCollapsed ? '70px' : '252px';
  const headerStyle = compact ? HEADER_COLLAPSED_STYLE : HEADER_EXPANDED_STYLE;
  const statusStyle = compact ? STATUS_COMPACT_STYLE : STATUS_EXPANDED_STYLE;
  const shellStyle = useMemo<React.CSSProperties>(
    () => ({
      ...createSidebarShellStyle({
        width: sidebarWidth,
        padding: compact ? '14px 8px' : '14px 12px',
        gap: '3px',
        isMobile,
        fixed,
        mobileSheet,
        showSidebar: Boolean(showSidebar),
        transition: 'transform .3s cubic-bezier(.22, 1, .36, 1), width .25s cubic-bezier(.22, 1, .36, 1)',
      }),
    }),
    [compact, fixed, isMobile, mobileSheet, showSidebar, sidebarWidth],
  );

  useMobileSheetDismiss(Boolean(mobileSheet && mobileOpen), onMobileClose);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => !previous);
  }, [setCollapsed]);

  return (
    <>
      {mobileSheet && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={BACKDROP_STYLE}
        />
      )}

      <aside
        className={`gs ${className ?? ''}`}
        data-svc={service}
        style={shellStyle}
      >
        <div style={headerStyle}>
          <div style={SERVICE_ICON_STYLE}>
            {serviceIcon}
          </div>
          {(isMobile || !compact) && (
            <div style={HEADER_TEXT_STYLE}>
              <div style={HEADER_TITLE_STYLE}>{serviceName}</div>
              <div style={HEADER_SUBTITLE_STYLE}>{workspaceLabel}</div>
            </div>
          )}

          {mobileSheet && (
            <button
              type="button"
              onClick={onMobileClose}
              style={CLOSE_MOBILE_BUTTON_STYLE}
              aria-label={closeMenuLabel}
            >
              {'\u00D7'}
            </button>
          )}
        </div>

        <div style={ITEM_LIST_STYLE}>
          {items.map((item, i) => {
            return (
              <GlassSidebarItemButton
                key={getSidebarItemKey(item, i)}
                item={item}
                index={i}
                active={i === activeIndex}
                compact={compact}
                mobileSheet={mobileSheet}
                isMobile={isMobile}
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
              className="pulse"
              style={getSidebarStatusDotStyle(statusOk)}
            />
            {(isMobile || !compact) && <span>{statusText}</span>}
          </div>
        )}

        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapsed}
            style={COLLAPSE_BUTTON_STYLE}
            aria-label={isCollapsed ? expandSidebarLabel : collapseSidebarLabel}
          >
            {isCollapsed ? '>>' : '<<'}
          </button>
        )}
      </aside>
    </>
  );
}
