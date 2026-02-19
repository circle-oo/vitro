import React, { useCallback, useMemo } from 'react';
import { useMobile } from '../../hooks/useMediaQuery';
import type { SidebarNavItem } from './GlassSidebar';
import {
  createSidebarShellStyle,
  invokeSidebarNavigate,
  MOBILE_SHEET_BACKDROP_STYLE,
  SIDEBAR_NAV_ICON_BASE_STYLE,
  SIDEBAR_SERVICE_ICON_BASE_STYLE,
  useMobileSheetDismiss,
} from './sidebarShared';

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

const SECTION_LIST_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  overflow: 'auto',
  paddingRight: '2px',
};

const SECTION_WRAP_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '5px',
};

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  fontWeight: 100,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  padding: '0 6px',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  border: 0,
  borderRadius: '12px',
  minHeight: '40px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '0 12px',
  textAlign: 'left',
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
  color: 'var(--t2)',
  fontWeight: 200,
};

const ITEM_ICON_ACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.9,
};

const ITEM_ICON_INACTIVE_STYLE: React.CSSProperties = {
  ...SIDEBAR_NAV_ICON_BASE_STYLE,
  opacity: 0.65,
};

interface SidebarSectionedItemButtonProps {
  id: string;
  item: SidebarNavItem;
  index: number;
  active: boolean;
  mobileSheet: boolean;
  onNavigate?: (itemId: string, index: number) => void;
  onMobileClose?: () => void;
}

const SidebarSectionedItemButton = React.memo(function SidebarSectionedItemButton({
  id,
  item,
  index,
  active,
  mobileSheet,
  onNavigate,
  onMobileClose,
}: SidebarSectionedItemButtonProps) {
  const onClick = useCallback(() => {
    invokeSidebarNavigate(index, (nextIndex) => onNavigate?.(id, nextIndex), item.onClick, mobileSheet, onMobileClose);
  }, [id, index, item.onClick, mobileSheet, onMobileClose, onNavigate]);

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
      <span>{item.label}</span>
    </button>
  );
});

SidebarSectionedItemButton.displayName = 'SidebarSectionedItemButton';

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
  subtitle = 'Sectioned sidebar',
}: SidebarSectionedProps) {
  const isMobile = useMobile();
  const mobileSheet = fixed && isMobile;
  const showSidebar = mobileSheet ? mobileOpen : true;
  const shellStyle = useMemo<React.CSSProperties>(
    () => ({
      ...createSidebarShellStyle({
        width: '282px',
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

  const mapById = useMemo(() => {
    const map = new Map<string, { item: SidebarNavItem; index: number }>();
    items.forEach((item, index) => {
      const id = item.id ?? String(index);
      map.set(id, { item, index });
    });
    return map;
  }, [items]);

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

        <div style={SECTION_LIST_STYLE}>
          {sections.map((section) => (
            <div key={section.id} style={SECTION_WRAP_STYLE}>
              <div style={SECTION_TITLE_STYLE}>
                {section.label}
              </div>

              {section.itemIds.map((id) => {
                const resolved = mapById.get(id);
                if (!resolved) return null;
                const { item, index } = resolved;
                const active = id === activeItemId;

                return (
                  <SidebarSectionedItemButton
                    key={id}
                    id={id}
                    item={item}
                    index={index}
                    active={active}
                    mobileSheet={mobileSheet}
                    onNavigate={onNavigate}
                    onMobileClose={onMobileClose}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
