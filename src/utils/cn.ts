import { twMerge } from 'tailwind-merge';

type ClassPrimitive = string | number | boolean | null | undefined;
export type ClassValue =
  | ClassPrimitive
  | ClassValue[]
  | {
    [key: string]: boolean | null | undefined;
  };

function flattenClassValue(value: ClassValue): string {
  if (!value) return '';

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => flattenClassValue(item))
      .filter(Boolean)
      .join(' ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key)
      .join(' ');
  }

  return '';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(
    inputs
      .map((item) => flattenClassValue(item))
      .filter(Boolean)
      .join(' '),
  );
}
