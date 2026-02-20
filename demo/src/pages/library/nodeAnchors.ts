export const LIBRARY_NODE_ID_PREFIX = 'library-node-';

export function getLibraryNodeAnchorId(nodeId: string): string {
  return `${LIBRARY_NODE_ID_PREFIX}${nodeId}`;
}

interface ScrollToLibraryNodeAnchorOptions {
  maxAttempts?: number;
  intervalMs?: number;
  offsetTop?: number;
  behavior?: ScrollBehavior;
  skipIfVisible?: boolean;
}

function resolveBehavior(behavior: ScrollBehavior | undefined, attemptCount: number): ScrollBehavior {
  if (behavior) return behavior;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return attemptCount === 0 ? 'auto' : 'smooth';
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'auto';
  return attemptCount === 0 ? 'auto' : 'smooth';
}

function isVisibleInViewport(target: HTMLElement, offsetTop: number): boolean {
  const rect = target.getBoundingClientRect();
  const viewportTop = Math.max(0, offsetTop);
  return rect.top >= viewportTop && rect.bottom <= window.innerHeight;
}

function scrollToTarget(
  target: HTMLElement,
  options: Required<Pick<ScrollToLibraryNodeAnchorOptions, 'offsetTop' | 'skipIfVisible'>> &
    Pick<ScrollToLibraryNodeAnchorOptions, 'behavior'>,
  attemptCount: number,
): void {
  if (options.skipIfVisible && isVisibleInViewport(target, options.offsetTop)) return;

  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - options.offsetTop);
  window.scrollTo({
    top,
    behavior: resolveBehavior(options.behavior, attemptCount),
  });
}

export function scrollToLibraryNodeAnchor(
  nodeId: string,
  options: ScrollToLibraryNodeAnchorOptions = {},
): () => void {
  if (typeof window === 'undefined') return () => {};

  const maxAttempts = options.maxAttempts ?? 60;
  const intervalMs = options.intervalMs ?? 50;
  const offsetTop = options.offsetTop ?? 0;
  const behavior = options.behavior;
  const skipIfVisible = options.skipIfVisible ?? true;
  const targetId = getLibraryNodeAnchorId(nodeId);

  let disposed = false;
  let attempts = 0;
  let timer: number | undefined;

  const tryScroll = () => {
    if (disposed) return;

    const target = document.getElementById(targetId);
    if (target) {
      scrollToTarget(target, { offsetTop, behavior, skipIfVisible }, attempts);
      return;
    }

    if (attempts >= maxAttempts) return;
    attempts += 1;
    timer = window.setTimeout(tryScroll, intervalMs);
  };

  tryScroll();

  return () => {
    disposed = true;
    if (timer != null) window.clearTimeout(timer);
  };
}
