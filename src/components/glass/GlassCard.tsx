import React from 'react';
import { cn } from '../../utils/cn';

const paddingMap = { sm: '14px', md: '22px', lg: '32px' } as const;

interface GlassCardProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
  children?: React.ReactNode;
}

export function GlassCard({
  hover = true,
  padding = 'md',
  className,
  children,
}: GlassCardProps) {
  return (
    <div
      className={cn('gc', !hover && 'nh', className)}
      style={padding !== 'none' ? { padding: paddingMap[padding] } : undefined}
    >
      {children}
    </div>
  );
}
