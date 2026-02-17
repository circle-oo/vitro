import React from 'react';
import { cn } from '../../utils/cn';

interface GlassOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export function GlassOverlay({ className, children }: GlassOverlayProps) {
  return <div className={cn('go', className)}>{children}</div>;
}
