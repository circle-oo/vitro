import React from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div
      className={cn('vitro-form-field', className)}
      data-error={error ? 'true' : undefined}
      style={{
        display: 'grid',
        gap: '6px',
      }}
    >
      <label
        htmlFor={htmlFor}
        data-required={required ? 'true' : undefined}
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--t2)',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--err)' }}> *</span>}
      </label>

      {children}

      {error ? (
        <div
          role="alert"
          style={{
            fontSize: '11px',
            color: 'var(--err)',
          }}
        >
          {error}
        </div>
      ) : hint ? (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--t3)',
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}
