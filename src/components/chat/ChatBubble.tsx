import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'ai';
  avatar?: React.ReactNode;
  meta?: string;
  children?: React.ReactNode;
}

export function ChatBubble({ role, avatar, meta, children }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '80%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          flexShrink: 0,
          background: isUser
            ? 'rgba(var(--gl), .12)'
            : 'linear-gradient(135deg, var(--p500), var(--p400))',
          color: isUser ? undefined : 'white',
          boxShadow: isUser ? undefined : '0 2px 6px rgba(var(--gl), .20)',
        }}
      >
        {avatar ?? (isUser ? '\uD83D\uDC64' : '\uD83E\uDEF7')}
      </div>
      <div>
        <div
          style={{
            padding: '14px 18px',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            fontSize: '14px',
            lineHeight: 1.6,
            ...(isUser
              ? {
                  background: 'var(--chat-user)',
                  border: '1px solid rgba(var(--gl), .12)',
                }
              : {
                  backdropFilter: 'blur(20px) saturate(170%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(170%)',
                  background: 'var(--chat-ai)',
                  border: '1px solid var(--gc-bd)',
                  boxShadow: '0 2px 8px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.35)',
                }),
          }}
        >
          {children}
        </div>
        {meta && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--t4)',
              marginTop: '6px',
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}
