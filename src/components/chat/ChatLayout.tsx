import React, { useCallback, useEffect, useRef } from 'react';

export interface ChatLayoutProps {
  maxHeight?: string;
  children?: React.ReactNode;
  input?: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
  autoScrollThreshold?: number;
  autoScrollBehavior?: ScrollBehavior;
}

export function ChatLayout({
  maxHeight = '750px',
  children,
  input,
  className,
  autoScroll = true,
  autoScrollThreshold = 48,
  autoScrollBehavior = 'smooth',
}: ChatLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const firstAutoScrollRef = useRef(true);
  const stickToBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    const content = contentRef.current;
    if (!content) return;
    content.scrollTo({
      top: content.scrollHeight,
      behavior,
    });
  }, []);

  const onContentScroll = useCallback(() => {
    if (!autoScroll) return;
    const content = contentRef.current;
    if (!content) return;

    const distanceToBottom = content.scrollHeight - content.scrollTop - content.clientHeight;
    stickToBottomRef.current = distanceToBottom <= autoScrollThreshold;
  }, [autoScroll, autoScrollThreshold]);

  useEffect(() => {
    if (!autoScroll) return;
    const behavior = firstAutoScrollRef.current ? 'auto' : autoScrollBehavior;
    if (firstAutoScrollRef.current || stickToBottomRef.current) {
      scrollToBottom(behavior);
      firstAutoScrollRef.current = false;
    }
  }, [autoScroll, autoScrollBehavior, children, scrollToBottom]);

  useEffect(() => {
    if (!autoScroll) return;
    if (typeof ResizeObserver === 'undefined') return;

    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      if (!stickToBottomRef.current) return;
      scrollToBottom('auto');
    });
    observer.observe(content);

    return () => observer.disconnect();
  }, [autoScroll, scrollToBottom]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - 100px)`,
        maxHeight,
      }}
    >
      <div
        ref={contentRef}
        onScroll={onContentScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {children}
      </div>
      {input && <div style={{ marginTop: '12px' }}>{input}</div>}
    </div>
  );
}
