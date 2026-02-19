import React from 'react';

export interface ChatBubbleProps {
  role: 'user' | 'ai';
  avatar?: React.ReactNode;
  meta?: string;
  children?: React.ReactNode;
}

const ROOT_BASE_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  maxWidth: '80%',
};

const ROOT_USER_STYLE: React.CSSProperties = {
  ...ROOT_BASE_STYLE,
  alignSelf: 'flex-end',
  flexDirection: 'row-reverse',
};

const ROOT_AI_STYLE: React.CSSProperties = {
  ...ROOT_BASE_STYLE,
  alignSelf: 'flex-start',
  flexDirection: 'row',
};

const AVATAR_BASE_STYLE: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  flexShrink: 0,
};

const AVATAR_USER_STYLE: React.CSSProperties = {
  ...AVATAR_BASE_STYLE,
  background: 'rgba(var(--gl), .12)',
};

const AVATAR_AI_STYLE: React.CSSProperties = {
  ...AVATAR_BASE_STYLE,
  background: 'linear-gradient(135deg, var(--p500), var(--p400))',
  color: 'white',
  boxShadow: '0 2px 6px rgba(var(--gl), .20)',
};

const MESSAGE_BASE_STYLE: React.CSSProperties = {
  padding: '14px 18px',
  fontSize: '14px',
  lineHeight: 1.6,
};

const USER_MESSAGE_STYLE: React.CSSProperties = {
  ...MESSAGE_BASE_STYLE,
  borderRadius: '18px 18px 4px 18px',
  background: 'var(--chat-user)',
  border: '1px solid rgba(var(--gl), .12)',
};

const AI_MESSAGE_STYLE: React.CSSProperties = {
  ...MESSAGE_BASE_STYLE,
  borderRadius: '18px 18px 18px 4px',
  backdropFilter: 'blur(20px) saturate(170%)',
  WebkitBackdropFilter: 'blur(20px) saturate(170%)',
  background: 'var(--chat-ai)',
  border: '1px solid var(--gc-bd)',
  boxShadow: '0 2px 8px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.35)',
};

const META_BASE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t4)',
  marginTop: '6px',
};

const META_USER_STYLE: React.CSSProperties = {
  ...META_BASE_STYLE,
  textAlign: 'right',
};

const META_AI_STYLE: React.CSSProperties = {
  ...META_BASE_STYLE,
  textAlign: 'left',
};

export function ChatBubble({ role, avatar, meta, children }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      style={isUser ? ROOT_USER_STYLE : ROOT_AI_STYLE}
    >
      <div style={isUser ? AVATAR_USER_STYLE : AVATAR_AI_STYLE}>
        {avatar ?? (isUser ? '\uD83D\uDC64' : '\uD83E\uDEF7')}
      </div>
      <div>
        <div style={isUser ? USER_MESSAGE_STYLE : AI_MESSAGE_STYLE}>
          {children}
        </div>
        {meta && (
          <div style={isUser ? META_USER_STYLE : META_AI_STYLE}>
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}
