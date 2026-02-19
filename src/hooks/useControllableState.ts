import { useCallback, useEffect, useRef, useState } from 'react';

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

type ControllableStateSetter<T> = (next: T | ((prev: T) => T)) => void;

function resolveNextState<T>(next: T | ((prev: T) => T), prev: T): T {
  return typeof next === 'function'
    ? (next as (prev: T) => T)(prev)
    : next;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, ControllableStateSetter<T>, boolean] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  const isControlledRef = useRef(isControlled);
  const currentValueRef = useRef<T>(isControlled ? (value as T) : internalValue);

  onChangeRef.current = onChange;
  isControlledRef.current = isControlled;

  useEffect(() => {
    if (!isControlled) return;
    setInternalValue(value as T);
  }, [isControlled, value]);

  const current = isControlled ? (value as T) : internalValue;
  currentValueRef.current = current;

  const setValue = useCallback<ControllableStateSetter<T>>((next) => {
    const resolved = resolveNextState(next, currentValueRef.current);
    if (!isControlledRef.current) {
      currentValueRef.current = resolved;
      setInternalValue(resolved);
    }
    onChangeRef.current?.(resolved);
  }, []);

  return [current, setValue, isControlled];
}
