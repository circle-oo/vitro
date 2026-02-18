import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';

export interface StepperStep {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  current: number;
  onStepChange?: (index: number) => void;
  clickable?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  current,
  onStepChange,
  clickable = true,
  className,
}: StepperProps) {
  return (
    <ol
      className={cn(className)}
      style={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))`,
        gap: '8px',
        padding: 0,
        margin: 0,
      }}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() => clickable && onStepChange?.(index)}
              disabled={!clickable}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                padding: '8px',
                textAlign: 'left',
                display: 'grid',
                gap: '6px',
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 300,
                    color: done || active ? 'white' : 'var(--t4)',
                    background: done || active ? 'var(--p500)' : 'rgba(var(--gl), .15)',
                  }}
                >
                  {done ? '\u2713' : index + 1}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: active ? 300 : 200,
                    color: active ? 'var(--t1)' : 'var(--t3)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {step.title}
                </span>
              </span>
              {step.description && (
                <span style={{ fontSize: '12px', color: 'var(--t4)', paddingLeft: '28px' }}>
                  {step.description}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export interface WizardStep extends StepperStep {
  render: React.ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  current?: number;
  defaultCurrent?: number;
  onCurrentChange?: (index: number) => void;
  onComplete?: () => void;
  className?: string;
  showNavigation?: boolean;
  nextLabel?: React.ReactNode;
  prevLabel?: React.ReactNode;
  doneLabel?: React.ReactNode;
}

export function Wizard({
  steps,
  current,
  defaultCurrent = 0,
  onCurrentChange,
  onComplete,
  className,
  showNavigation = true,
  nextLabel = 'Next',
  prevLabel = 'Back',
  doneLabel = 'Done',
}: WizardProps) {
  const [activeIndex, setActiveIndex] = useControllableState<number>({
    value: current,
    defaultValue: defaultCurrent,
    onChange: onCurrentChange,
  });

  const boundedIndex = useMemo(
    () => Math.max(0, Math.min(steps.length - 1, activeIndex)),
    [activeIndex, steps.length],
  );
  const activeStep = steps[boundedIndex];
  const isLast = boundedIndex === steps.length - 1;

  const moveTo = (next: number) => {
    const safe = Math.max(0, Math.min(steps.length - 1, next));
    setActiveIndex(safe);
  };

  return (
    <div className={cn(className)} style={{ display: 'grid', gap: '12px' }}>
      <Stepper steps={steps} current={boundedIndex} onStepChange={moveTo} />

      <div className="gc nh" style={{ padding: '14px' }}>
        {activeStep?.render}
      </div>

      {showNavigation && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <button
            type="button"
            className="gi"
            disabled={boundedIndex <= 0}
            onClick={() => moveTo(boundedIndex - 1)}
            style={{
              border: 'none',
              padding: '8px 14px',
              color: 'var(--t2)',
              cursor: boundedIndex <= 0 ? 'not-allowed' : 'pointer',
              opacity: boundedIndex <= 0 ? 0.5 : 1,
            }}
          >
            {prevLabel}
          </button>

          <button
            type="button"
            className="gi"
            onClick={() => {
              if (isLast) {
                onComplete?.();
                return;
              }
              moveTo(boundedIndex + 1);
            }}
            style={{
              border: 'none',
              padding: '8px 14px',
              color: 'var(--t1)',
              cursor: 'pointer',
              background: 'color-mix(in srgb, var(--p500) 16%, var(--gi-bg))',
            }}
          >
            {isLast ? doneLabel : nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
