import { useCallback, useEffect, useRef, useState } from 'react';

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void, boolean] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  const isControlledRef = useRef(isControlled);

  onChangeRef.current = onChange;
  isControlledRef.current = isControlled;

  useEffect(() => {
    if (!isControlled) return;
    setInternalValue(value as T);
  }, [isControlled, value]);

  const current = isControlled ? (value as T) : internalValue;

  const setValue = useCallback((next: T) => {
    if (!isControlledRef.current) {
      setInternalValue(next);
    }
    onChangeRef.current?.(next);
  }, []);

  return [current, setValue, isControlled];
}
