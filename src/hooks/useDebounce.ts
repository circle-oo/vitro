import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (delay <= 0) {
      setDebounced((previous) => (Object.is(previous, value) ? previous : value));
      return;
    }

    const timer = setTimeout(() => {
      setDebounced((previous) => (Object.is(previous, value) ? previous : value));
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debounced;
}
