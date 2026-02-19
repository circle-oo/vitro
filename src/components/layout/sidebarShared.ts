import type { CSSProperties } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface SidebarKeyItem {
  id?: string;
  href?: string;
  label: string;
}

export const MOBILE_SHEET_BACKDROP_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.34)',
  backdropFilter: 'blur(3px)',
  WebkitBackdropFilter: 'blur(3px)',
  zIndex: 19,
  opacity: 1,
  animation: 'var(--vitro-sheet-fade, vitro-fade-in .18s var(--ease) both)',
  transition: 'opacity .18s ease',
};

interface SidebarShellStyleOptions {
  width: string;
  padding: string;
  isMobile: boolean;
  fixed: boolean;
  mobileSheet: boolean;
  showSidebar: boolean;
  gap?: string;
  alignItems?: CSSProperties['alignItems'];
  transition?: CSSProperties['transition'];
}

export const SIDEBAR_SERVICE_ICON_BASE_STYLE: CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, var(--p500), var(--p400))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 300,
  flexShrink: 0,
};

export const SIDEBAR_NAV_ICON_BASE_STYLE: CSSProperties = {
  width: '20px',
  height: '20px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--accent)',
  fontSize: '18px',
  transform: 'translateX(-4px)',
};

export const SIDEBAR_STATUS_DOT_BASE_STYLE: CSSProperties = {
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
};

export function getSidebarItemKey(item: SidebarKeyItem, index: number): string {
  return item.id ?? item.href ?? `${item.label}-${index}`;
}

export function createSidebarShellStyle({
  width,
  padding,
  isMobile,
  fixed,
  mobileSheet,
  showSidebar,
  gap = '8px',
  alignItems,
  transition = 'transform .3s cubic-bezier(.22, 1, .36, 1)',
}: SidebarShellStyleOptions): CSSProperties {
  return {
    width,
    padding,
    display: 'flex',
    flexDirection: 'column',
    alignItems,
    gap,
    position: fixed ? 'fixed' : 'relative',
    top: fixed ? (isMobile ? 0 : '12px') : undefined,
    left: fixed ? (isMobile ? 0 : '12px') : undefined,
    bottom: fixed ? (isMobile ? 0 : '12px') : undefined,
    zIndex: 20,
    borderRadius: fixed ? (isMobile ? '0 22px 22px 0' : '22px') : '18px',
    overflow: 'hidden',
    transform: mobileSheet && !showSidebar ? 'translateX(-110%)' : 'translateX(0)',
    transition,
    animation: 'var(--vitro-enter-fade, fi .24s var(--ease) both)',
    pointerEvents: mobileSheet && !showSidebar ? 'none' : 'auto',
    minHeight: fixed ? undefined : '320px',
  };
}

export function getSidebarStatusDotStyle(statusOk: boolean): CSSProperties {
  return {
    ...SIDEBAR_STATUS_DOT_BASE_STYLE,
    background: statusOk ? 'var(--ok)' : 'var(--err)',
    boxShadow: `0 0 8px ${statusOk ? 'rgba(16,185,129,.4)' : 'rgba(244,63,94,.4)'}`,
    animation: 'var(--vitro-status-pulse, pul 2.2s ease-in-out infinite)',
  };
}

export function invokeSidebarNavigate(
  index: number,
  onNavigate: ((index: number) => void) | undefined,
  onItemClick: (() => void) | undefined,
  mobileSheet: boolean,
  onMobileClose?: () => void,
): void {
  onNavigate?.(index);
  onItemClick?.();
  if (mobileSheet) onMobileClose?.();
}

export function closeMobileSheetIfNeeded(
  mobileSheet: boolean,
  onMobileClose?: () => void,
): void {
  if (mobileSheet) onMobileClose?.();
}

export function useMobileSheetDismiss(
  enabled: boolean,
  onClose?: () => void,
): void {
  useEscapeKey(() => onClose?.(), {
    enabled: enabled && Boolean(onClose),
  });
}
