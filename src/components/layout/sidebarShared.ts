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
};

export function getSidebarItemKey(item: SidebarKeyItem, index: number): string {
  return item.id ?? item.href ?? `${item.label}-${index}`;
}

export function useMobileSheetDismiss(
  enabled: boolean,
  onClose?: () => void,
): void {
  useEscapeKey(() => onClose?.(), {
    enabled: enabled && Boolean(onClose),
  });
}
