import { useEffect, useRef, useState } from 'react';

export function usePersistentState<T>(
  key: string,
  getInitial: () => T,
  serialize: (value: T) => string,
  deserialize: (raw: string | null) => T,
) {
  const initialRawRef = useRef<string | null>(null);
  const isFirstWriteRef = useRef(true);
  const prevKeyRef = useRef(key);

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return getInitial();
    try {
      const raw = localStorage.getItem(key);
      initialRawRef.current = raw;
      return deserialize(raw);
    } catch {
      return getInitial();
    }
  });

  useEffect(() => {
    let serialized: string;
    try {
      serialized = serialize(value);
    } catch {
      return;
    }

    const keyChanged = prevKeyRef.current !== key;
    prevKeyRef.current = key;

    if (isFirstWriteRef.current) {
      isFirstWriteRef.current = false;
      if (!keyChanged && initialRawRef.current === serialized) return;
    } else if (!keyChanged && initialRawRef.current === serialized) {
      return;
    }

    try {
      localStorage.setItem(key, serialized);
      initialRawRef.current = serialized;
    } catch {
      // Ignore storage write errors (e.g. Safari private mode)
    }
  }, [key, serialize, value]);

  return [value, setValue] as const;
}
