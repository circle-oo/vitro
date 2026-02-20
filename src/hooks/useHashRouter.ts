import { useCallback, useEffect, useMemo, useState } from 'react';

export interface HashRoute {
  page: string;
  sub?: string;
  id?: string;
}

export interface UseHashRouterOptions<TPage extends string = string> {
  pages: ReadonlyArray<TPage>;
  defaultPage: TPage;
}

export interface UseHashRouterResult<TPage extends string = string> {
  route: HashRoute & { page: TPage };
  navigate: (next: { page: TPage; sub?: string; id?: string }) => void;
  goBack: () => void;
}

export function parseHashRoute<TPage extends string>(
  rawHash: string,
  pages: ReadonlyArray<TPage>,
  defaultPage: TPage,
): HashRoute & { page: TPage } {
  const normalized = rawHash.trim().replace(/^#\/?/, '');
  if (!normalized) return { page: defaultPage };

  const [pageRaw, subRaw, idRaw] = normalized.split('/').filter(Boolean);
  if (!pageRaw || !(pages as ReadonlyArray<string>).includes(pageRaw)) {
    return { page: defaultPage };
  }

  const route: HashRoute & { page: TPage } = { page: pageRaw as TPage };
  if (subRaw) route.sub = decodeURIComponent(subRaw);
  if (idRaw) route.id = decodeURIComponent(idRaw);

  return route;
}

export function toHashPath(route: { page: string; sub?: string; id?: string }): string {
  const segments: string[] = [route.page];
  if (route.sub) segments.push(encodeURIComponent(route.sub));
  if (route.id) segments.push(encodeURIComponent(route.id));
  return `#/${segments.join('/')}`;
}

export function useHashRouter<TPage extends string>(
  options: UseHashRouterOptions<TPage>,
): UseHashRouterResult<TPage> {
  const { pages, defaultPage } = options;
  const readCurrentRoute = useCallback(
    () => (
      typeof window === 'undefined'
        ? { page: defaultPage }
        : parseHashRoute(window.location.hash, pages, defaultPage)
    ),
    [defaultPage, pages],
  );

  const [route, setRoute] = useState<HashRoute & { page: TPage }>(readCurrentRoute);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sync = () => setRoute(readCurrentRoute());

    if (!window.location.hash) {
      window.location.hash = toHashPath({ page: defaultPage });
    } else {
      sync();
    }

    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [defaultPage, readCurrentRoute]);

  const navigate = useCallback(
    (next: { page: TPage; sub?: string; id?: string }) => {
      if (typeof window === 'undefined') {
        setRoute(next);
        return;
      }

      const nextHash = toHashPath(next);

      if (window.location.hash === nextHash) {
        setRoute(readCurrentRoute());
        return;
      }

      window.location.hash = nextHash;
    },
    [readCurrentRoute],
  );

  const goBack = useCallback(() => {
    if (typeof window === 'undefined') {
      setRoute({ page: defaultPage });
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.hash = toHashPath({ page: defaultPage });
  }, [defaultPage]);

  return useMemo(() => ({ route, navigate, goBack }), [route, navigate, goBack]);
}
