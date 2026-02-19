type NetworkConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
};

export type PreloadTask = () => Promise<unknown>;

export interface PreloadQueueOptions {
  initialDelayMs?: number;
  timeoutMs?: number;
  fallbackDelayMs?: number;
  batchSize?: number;
}

export function hasConstrainedNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
}

export function schedulePreloadQueue(
  preloaders: ReadonlyArray<PreloadTask>,
  preloadOnce: (preload: PreloadTask) => void,
  {
    initialDelayMs = 0,
    timeoutMs = 1200,
    fallbackDelayMs = 90,
    batchSize = 2,
  }: PreloadQueueOptions = {},
): () => void {
  if (typeof window === 'undefined' || preloaders.length === 0) return () => {};

  const queue = [...preloaders];
  const hasRequestIdleCallback = typeof window.requestIdleCallback === 'function';
  const hasCancelIdleCallback = typeof window.cancelIdleCallback === 'function';
  let cancelled = false;
  let idleHandle: number | null = null;
  let timerHandle: number | null = null;

  const clearHandles = () => {
    if (idleHandle !== null && hasCancelIdleCallback) {
      window.cancelIdleCallback(idleHandle);
      idleHandle = null;
    }
    if (timerHandle !== null) {
      window.clearTimeout(timerHandle);
      timerHandle = null;
    }
  };

  const runBatch = (deadline?: IdleDeadline) => {
    if (cancelled) return;

    let processed = 0;
    while (queue.length > 0 && processed < batchSize) {
      if (deadline && processed > 0 && deadline.timeRemaining() < 4) {
        break;
      }
      const next = queue.shift();
      if (!next) break;
      preloadOnce(next);
      processed += 1;
    }

    if (cancelled || queue.length === 0) return;

    if (hasRequestIdleCallback) {
      idleHandle = window.requestIdleCallback(runBatch, { timeout: timeoutMs });
      return;
    }

    timerHandle = window.setTimeout(() => runBatch(), fallbackDelayMs);
  };

  const start = () => {
    if (cancelled || queue.length === 0) return;
    if (hasRequestIdleCallback) {
      idleHandle = window.requestIdleCallback(runBatch, { timeout: timeoutMs });
      return;
    }
    timerHandle = window.setTimeout(() => runBatch(), fallbackDelayMs);
  };

  if (initialDelayMs > 0) {
    timerHandle = window.setTimeout(start, initialDelayMs);
  } else {
    start();
  }

  return () => {
    cancelled = true;
    clearHandles();
  };
}
