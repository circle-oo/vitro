import { useCallback, useEffect, useMemo, useState } from 'react';

export type DemoPageId =
  | 'dashboard'
  | 'chat'
  | 'tools'
  | 'inventory'
  | 'recipes'
  | 'cooking-log'
  | 'sharpening'
  | 'settings'
  | 'library';

export interface DemoRoute {
  page: DemoPageId;
  sub?: string;
  id?: string;
}

export interface NavigateRoute {
  page: DemoPageId;
  sub?: string;
  id?: string;
}

const DEFAULT_ROUTE: DemoRoute = { page: 'dashboard' };

const PAGES = new Set<DemoPageId>([
  'dashboard',
  'chat',
  'tools',
  'inventory',
  'recipes',
  'cooking-log',
  'sharpening',
  'settings',
  'library',
]);

function normalizeHash(rawHash: string): string {
  const trimmed = rawHash.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
}

export function parseHash(rawHash: string): DemoRoute {
  const normalized = normalizeHash(rawHash);
  const withoutSlash = normalized.startsWith('/') ? normalized.slice(1) : normalized;
  if (!withoutSlash) return DEFAULT_ROUTE;

  const [pageRaw, subRaw, idRaw] = withoutSlash.split('/').filter(Boolean);
  if (!pageRaw || !PAGES.has(pageRaw as DemoPageId)) return DEFAULT_ROUTE;

  const route: DemoRoute = { page: pageRaw as DemoPageId };
  if (subRaw) route.sub = decodeURIComponent(subRaw);
  if (idRaw) route.id = decodeURIComponent(idRaw);
  return route;
}

export function toHash(route: NavigateRoute): string {
  const segments: string[] = [route.page];
  if (route.sub) segments.push(encodeURIComponent(route.sub));
  if (route.id) segments.push(encodeURIComponent(route.id));
  return `#/${segments.join('/')}`;
}

export function useRouter() {
  const [route, setRoute] = useState<DemoRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const syncRoute = () => {
      setRoute(parseHash(window.location.hash));
    };

    if (!window.location.hash) {
      window.location.hash = toHash(DEFAULT_ROUTE);
    } else {
      syncRoute();
    }

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  const navigate = useCallback((next: NavigateRoute) => {
    const nextHash = toHash(next);
    if (window.location.hash === nextHash) {
      setRoute(parseHash(nextHash));
      return;
    }
    window.location.hash = nextHash;
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = toHash(DEFAULT_ROUTE);
  }, []);

  return useMemo(
    () => ({ route, navigate, goBack }),
    [route, navigate, goBack],
  );
}
