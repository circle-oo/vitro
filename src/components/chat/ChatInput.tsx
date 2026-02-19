import React, { useCallback } from 'react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  className?: string;
}

const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end',
};

const TEXTAREA_STYLE: React.CSSProperties = {
  flex: 1,
  padding: '14px 18px',
  minHeight: '48px',
  maxHeight: '120px',
  fontFamily: 'var(--font)',
  fontSize: '14px',
  color: 'var(--t1)',
  borderRadius: '16px',
  outline: 'none',
  resize: 'none',
  lineHeight: 1.5,
  backdropFilter: 'blur(16px) saturate(160%)',
  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
  background: 'var(--gi-bg)',
  border: '1px solid var(--gi-bd)',
};

const SEND_BUTTON_STYLE: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, var(--p500), var(--p600))',
  color: 'white',
  boxShadow: '0 2px 8px rgba(var(--gl), .22)',
  transition: 'all .15s',
  flexShrink: 0,
};

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  className,
}: ChatInputProps) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }, [onSend]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  const onSendClick = useCallback(() => {
    onSend();
  }, [onSend]);

  return (
    <div className={className} style={ROOT_STYLE}>
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        style={TEXTAREA_STYLE}
      />
      <button
        type="button"
        onClick={onSendClick}
        style={SEND_BUTTON_STYLE}
      >
        {'\u2191'}
      </button>
    </div>
  );
}
