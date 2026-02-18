import { useCallback, useMemo, useSyncExternalStore } from 'react';

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

function isRouteEqual(a: DemoRoute, b: DemoRoute): boolean {
  return a.page === b.page && a.sub === b.sub && a.id === b.id;
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

const routeListeners = new Set<() => void>();
let currentRoute: DemoRoute = DEFAULT_ROUTE;
let isListening = false;

function emitRoute() {
  for (const listener of routeListeners) {
    listener();
  }
}

function syncRouteFromHash(hash: string) {
  const next = parseHash(hash);
  if (isRouteEqual(next, currentRoute)) return;
  currentRoute = next;
  emitRoute();
}

function ensureHashInitialized() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) {
    window.location.hash = toHash(DEFAULT_ROUTE);
  }
  currentRoute = parseHash(window.location.hash);
}

function onHashChange() {
  if (typeof window === 'undefined') return;
  syncRouteFromHash(window.location.hash);
}

function subscribeRoute(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  routeListeners.add(listener);
  if (!isListening) {
    ensureHashInitialized();
    window.addEventListener('hashchange', onHashChange);
    isListening = true;
  }

  return () => {
    routeListeners.delete(listener);
    if (routeListeners.size > 0 || !isListening) return;
    window.removeEventListener('hashchange', onHashChange);
    isListening = false;
  };
}

function getRouteSnapshot(): DemoRoute {
  if (typeof window === 'undefined') return DEFAULT_ROUTE;
  const next = parseHash(window.location.hash);
  if (!isRouteEqual(next, currentRoute)) {
    currentRoute = next;
  }
  return currentRoute;
}

function navigateToHash(nextHash: string) {
  if (typeof window === 'undefined') return;
  if (window.location.hash === nextHash) {
    syncRouteFromHash(nextHash);
    return;
  }
  window.location.hash = nextHash;
}

export function useRouter() {
  const route = useSyncExternalStore(subscribeRoute, getRouteSnapshot, () => DEFAULT_ROUTE);

  const navigate = useCallback((next: NavigateRoute) => {
    navigateToHash(toHash(next));
  }, []);

  const goBack = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigateToHash(toHash(DEFAULT_ROUTE));
  }, []);

  return useMemo(
    () => ({ route, navigate, goBack }),
    [route, navigate, goBack],
  );
}
