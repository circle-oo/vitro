import React, { useRef } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = '메시지를 입력하세요...',
  className,
}: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={className} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        style={{
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
        }}
      />
      <button
        onClick={onSend}
        style={{
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
        }}
      >
        {'\u2191'}
      </button>
    </div>
  );
}
