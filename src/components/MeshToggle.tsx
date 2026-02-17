import React from 'react';

interface MeshToggleProps {
  active: boolean;
  onToggle: () => void;
  className?: string;
}

export function MeshToggle({ active, onToggle, className }: MeshToggleProps) {
  return (
    <button
      className={`gi ${className ?? ''}`}
      onClick={onToggle}
      aria-label={active ? 'Disable mesh animation' : 'Enable mesh animation'}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
        opacity: active ? 1 : 0.4,
      }}
    >
      {'\uD83C\uDF0A'}
    </button>
  );
}
