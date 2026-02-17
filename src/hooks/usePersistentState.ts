import { useEffect, useState } from 'react';

export function usePersistentState<T>(
  key: string,
  getInitial: () => T,
  serialize: (value: T) => string,
  deserialize: (raw: string | null) => T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return getInitial();
    try {
      return deserialize(localStorage.getItem(key));
    } catch {
      return getInitial();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // Ignore storage write errors (e.g. Safari private mode)
    }
  }, [key, serialize, value]);

  return [value, setValue] as const;
}
