export const LIBRARY_NODE_ID_PREFIX = 'library-node-';

export function getLibraryNodeAnchorId(nodeId: string): string {
  return `${LIBRARY_NODE_ID_PREFIX}${nodeId}`;
}

interface ScrollToLibraryNodeAnchorOptions {
  maxAttempts?: number;
  intervalMs?: number;
}

export function scrollToLibraryNodeAnchor(
  nodeId: string,
  options: ScrollToLibraryNodeAnchorOptions = {},
): () => void {
  if (typeof window === 'undefined') return () => {};

  const maxAttempts = options.maxAttempts ?? 60;
  const intervalMs = options.intervalMs ?? 50;
  const targetId = getLibraryNodeAnchorId(nodeId);

  let disposed = false;
  let attempts = 0;
  let timer: number | undefined;

  const tryScroll = () => {
    if (disposed) return;

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: attempts === 0 ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest',
      });
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
