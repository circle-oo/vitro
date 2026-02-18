import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function parsePx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function lockBody(): void {
  const body = document.body;
  const root = document.documentElement;

  if (lockCount === 0) {
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;

    const computedPaddingRight = parsePx(window.getComputedStyle(body).paddingRight);
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';
  }

  lockCount += 1;
}

function unlockBody(): void {
  if (lockCount === 0) return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
}

export function useBodyScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    lockBody();
    return () => unlockBody();
  }, [enabled]);
}
