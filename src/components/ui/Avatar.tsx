import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
} as const;

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function pickGradient(name?: string) {
  const palettes = [
    ['#4B6EF5', '#7C3AED'],
    ['#0EA5E9', '#14B8A6'],
    ['#F59E0B', '#EF4444'],
    ['#10B981', '#22D3EE'],
    ['#EC4899', '#8B5CF6'],
  ] as const;
  if (!name) return palettes[0];
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  size = 'md',
  shape = 'circle',
  className,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const pixelSize = sizeMap[size];
  const initials = useMemo(() => getInitials(name), [name]);
  const gradient = useMemo(() => pickGradient(name), [name]);
  const showImage = !!src && !imageError;

  return (
    <span
      className={cn(className)}
      aria-label={alt ?? name ?? 'Avatar'}
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: shape === 'circle' ? '50%' : '12px',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        fontFamily: 'var(--accent)',
        color: 'white',
        fontWeight: 300,
        fontSize: Math.max(11, Math.floor(pixelSize * 0.34)),
        letterSpacing: '.04em',
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <span>{fallback ?? initials}</span>
      )}
    </span>
  );
}
