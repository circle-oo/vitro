import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAsyncActionResult<T> {
  execute: () => Promise<T | undefined>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

export function useAsyncAction<T>(
  action: () => Promise<T>,
): UseAsyncActionResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const actionRef = useRef(action);
  const mountedRef = useRef(true);
  const pendingCountRef = useRef(0);

  actionRef.current = action;

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const execute = useCallback(async () => {
    pendingCountRef.current += 1;
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      return await actionRef.current();
    } catch (err) {
      if (mountedRef.current) {
        setError(toError(err));
      }
      return undefined;
    } finally {
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
      if (mountedRef.current && pendingCountRef.current === 0) {
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    pendingCountRef.current = 0;
    if (mountedRef.current) {
      setLoading(false);
      setError(null);
    }
  }, []);

  return {
    execute,
    loading,
    error,
    reset,
  };
}
