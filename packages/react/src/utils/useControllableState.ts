import { useCallback, useState } from 'react';

export interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/**
 * Supports both controlled (`value` provided) and uncontrolled (`defaultValue`) React patterns.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
      if (!isControlled) {
        setUncontrolled(resolved);
      }
      onChange?.(resolved);
    },
    [current, isControlled, onChange],
  );

  return [current, setValue];
}

