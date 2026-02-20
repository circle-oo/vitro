import React from 'react';
import { cn } from '../../utils/cn';

const paddingMap = { sm: '14px', md: '22px', lg: '32px' } as const;

export interface GlassCardProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

type GlassCardNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof GlassCardProps
>;

export function GlassCard({
  hover = true,
  padding = 'md',
  className,
  children,
  style,
  ...rest
}: GlassCardProps & GlassCardNativeProps) {
  const baseStyle = padding !== 'none' ? { padding: paddingMap[padding] } : undefined;

  return (
    <div
      {...rest}
      className={cn('gc', !hover && 'nh', className)}
      style={baseStyle ? { ...baseStyle, ...style } : style}
    >
      {children}
    </div>
  );
}
