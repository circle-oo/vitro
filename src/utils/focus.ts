interface TabKeyEventLike {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(element: HTMLElement): boolean {
  return Boolean(
    element.offsetWidth
    || element.offsetHeight
    || element.getClientRects().length,
  );
}

export function getFocusableElements(container: ParentNode | null): HTMLElement[] {
  if (!container) return [];

  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter(
    (element) => (
      !element.hasAttribute('disabled')
      && !element.getAttribute('aria-hidden')
      && isVisible(element)
    ),
  );
}

export function focusFirstElement(
  container: HTMLElement | null,
  fallback?: HTMLElement | null,
): void {
  const first = getFocusableElements(container)[0];
  if (first) {
    first.focus();
    return;
  }
  fallback?.focus();
}

export function trapTabKey(
  event: TabKeyEventLike,
  container: HTMLElement | null,
): boolean {
  if (event.key !== 'Tab') return false;

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) return false;

  const active = document.activeElement as HTMLElement | null;
  const currentIndex = focusables.indexOf(active as HTMLElement);
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1)
    : (currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1);

  event.preventDefault();
  focusables[nextIndex]?.focus();
  return true;
}
