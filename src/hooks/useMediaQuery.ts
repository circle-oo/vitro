import { useSyncExternalStore } from 'react';

interface MediaQueryStore {
  mql: MediaQueryList;
  matches: boolean;
  listeners: Set<() => void>;
  onChange: (event: MediaQueryListEvent) => void;
}

const stores = new Map<string, MediaQueryStore>();

function addMqlListener(mql: MediaQueryList, listener: (event: MediaQueryListEvent) => void) {
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', listener);
    return;
  }
  mql.addListener(listener);
}

function removeMqlListener(mql: MediaQueryList, listener: (event: MediaQueryListEvent) => void) {
  if (typeof mql.removeEventListener === 'function') {
    mql.removeEventListener('change', listener);
    return;
  }
  mql.removeListener(listener);
}

function getOrCreateStore(query: string): MediaQueryStore {
  const existing = stores.get(query);
  if (existing) return existing;

  const mql = window.matchMedia(query);
  const store: MediaQueryStore = {
    mql,
    matches: mql.matches,
    listeners: new Set(),
    onChange: (event) => {
      if (store.matches === event.matches) return;
      store.matches = event.matches;
      for (const listener of store.listeners) {
        listener();
      }
    },
  };

  addMqlListener(mql, store.onChange);
  stores.set(query, store);
  return store;
}

function subscribe(query: string, onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const store = getOrCreateStore(query);
  store.listeners.add(onStoreChange);

  return () => {
    store.listeners.delete(onStoreChange);
    if (store.listeners.size > 0) return;
    removeMqlListener(store.mql, store.onChange);
    stores.delete(query);
  };
}

function getSnapshot(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return getOrCreateStore(query).matches;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
    () => false,
  );
}

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
