import React from 'react';
import { cn } from '../../utils/cn';

interface GlassInteractiveProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function GlassInteractive({ className, children, ...props }: GlassInteractiveProps) {
  return (
    <div className={cn('gi', className)} {...props}>
      {children}
    </div>
  );
}
