import React, { useState } from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface GlassSidebarProps {
  service: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  items: NavItem[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  statusText?: string;
  statusOk?: boolean;
  className?: string;
}

export function GlassSidebar({
  serviceName,
  serviceIcon,
  items,
  activeIndex = 0,
  onNavigate,
  statusText,
  statusOk = true,
  className,
}: GlassSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`gs ${className ?? ''}`}
      style={{
        width: collapsed ? '64px' : '250px',
        padding: collapsed ? '16px 8px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        position: 'fixed',
        top: '12px',
        left: '12px',
        bottom: '12px',
        zIndex: 20,
        borderRadius: '20px',
        transition: 'width .25s cubic-bezier(.22, 1, .36, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? '12px 4px 18px' : '12px 14px 18px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--div)',
          flexShrink: 0,
          justifyContent: collapsed ? 'center' : undefined,
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--p500), var(--p400))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            boxShadow: '0 2px 8px rgba(var(--gl), .25)',
            flexShrink: 0,
          }}
        >
          {serviceIcon}
        </div>
        {!collapsed && (
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-.3px', whiteSpace: 'nowrap' }}>
            {serviceName}
          </span>
        )}
      </div>

      {/* Nav Items */}
      {items.map((item, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={i}
            onClick={() => {
              onNavigate?.(i);
              item.onClick?.();
            }}
            style={{
              padding: collapsed ? '10px' : '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--p700)' : 'var(--t2)',
              background: active ? 'rgba(var(--gl), .13)' : undefined,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '42px',
              transition: 'all .15s',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              justifyContent: collapsed ? 'center' : undefined,
            }}
          >
            <span style={{ width: '18px', height: '18px', opacity: active ? 0.85 : 0.5, flexShrink: 0 }}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </div>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Status */}
      {statusText && (
        <div style={{ padding: '8px 14px', fontSize: '11px', color: 'var(--t4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="pulse"
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: statusOk ? 'var(--ok)' : 'var(--err)',
              boxShadow: `0 0 6px ${statusOk ? 'rgba(16,185,129,.35)' : 'rgba(244,63,94,.35)'}`,
            }}
          />
          {!collapsed && <span>{statusText}</span>}
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: 'var(--t3)',
          fontSize: '14px',
          alignSelf: 'center',
          flexShrink: 0,
        }}
      >
        {collapsed ? '\u25B6' : '\u25C0'}
      </button>
    </aside>
  );
}
