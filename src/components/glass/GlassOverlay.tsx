import React from 'react';
import { cn } from '../../utils/cn';

export interface GlassOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function GlassOverlay({ className, children, ...props }: GlassOverlayProps) {
  return <div className={cn('go', className)} {...props}>{children}</div>;
}
