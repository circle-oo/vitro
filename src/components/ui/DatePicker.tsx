import React, { useCallback, useMemo, useRef } from 'react';
import { cn } from '../../utils/cn';
import { DATE_FIELD_STYLE } from './fieldStyles';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

export type DatePickerSize = 'sm' | 'md';
export type DatePickerVariant = 'soft' | 'strong';

const DATE_SIZE_STYLE: Record<DatePickerSize, React.CSSProperties> = {
  sm: {
    minHeight: touchPx(38),
    fontSize: fontPx(12),
    borderRadius: radiusPx(12),
    padding: `${spacePx(9)} ${spacePx(38)} ${spacePx(9)} ${spacePx(14)}`,
  },
  md: {},
};

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  inputClassName?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  triggerLabel?: string;
}

export function DatePicker({
  className,
  inputClassName,
  wrapperClassName,
  wrapperStyle,
  style,
  disabled,
  readOnly,
  size = 'md',
  variant = 'soft',
  triggerLabel = 'Open calendar',
  ...props
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resolvedStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DATE_FIELD_STYLE,
      ...DATE_SIZE_STYLE[size],
      ...style,
    }),
    [size, style],
  );
  const openPicker = useCallback(() => {
    if (disabled || readOnly) return;
    const input = inputRef.current;
    if (!input) return;

    try {
      input.showPicker();
      return;
    } catch {
      // Fallback to click/focus on browsers that block showPicker() in some contexts.
    }

    input.focus();
    input.click();
  }, [disabled, readOnly]);

  return (
    <span
      className={cn(
        'vitro-date-wrap',
        `vitro-date-wrap--${size}`,
        `vitro-date-wrap--${variant}`,
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      <input
        ref={inputRef}
        type="date"
        disabled={disabled}
        readOnly={readOnly}
        className={cn('gi vitro-date-field', className, inputClassName)}
        style={resolvedStyle}
        {...props}
      />
      <button
        type="button"
        tabIndex={disabled || readOnly ? -1 : 0}
        aria-label={triggerLabel}
        title={triggerLabel}
        className="vitro-date-trigger"
        disabled={disabled || readOnly}
        onMouseDown={(event) => event.preventDefault()}
        onClick={openPicker}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
          <path
            d="M8 3v2M16 3v2M4 9h16M7 12h2M11 12h2M15 12h2M7 16h2M11 16h2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </span>
  );
}
