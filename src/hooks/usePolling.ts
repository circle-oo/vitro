import { useEffect, useRef } from 'react';

export interface UsePollingOptions {
  enabled?: boolean;
  immediate?: boolean;
  onError?: (error: unknown) => void;
}

export function usePolling(
  callback: () => void | Promise<void>,
  interval: number,
  options: UsePollingOptions = {},
): void {
  const { enabled = true, immediate = false, onError } = options;
  const callbackRef = useRef(callback);
  const onErrorRef = useRef(onError);
  const runningRef = useRef(false);

  callbackRef.current = callback;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled || interval <= 0) return;

    let cancelled = false;

    const run = async () => {
      if (runningRef.current || cancelled) return;
      runningRef.current = true;
      try {
        await callbackRef.current();
      } catch (error) {
        onErrorRef.current?.(error);
      } finally {
        runningRef.current = false;
      }
    };

    if (immediate) {
      void run();
    }

    const timer = window.setInterval(() => {
      void run();
    }, interval);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, immediate, interval]);
}
