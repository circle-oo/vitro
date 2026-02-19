import React, { useCallback, useMemo } from 'react';
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

const STEPPER_ROOT_STYLE: React.CSSProperties = {
  listStyle: 'none',
  display: 'grid',
  gap: '8px',
  padding: 0,
  margin: 0,
};

const STEPPER_ITEM_STYLE: React.CSSProperties = {
  minWidth: 0,
};

const STEP_BUTTON_BASE_STYLE: React.CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  padding: '8px',
  textAlign: 'left',
  display: 'grid',
  gap: '6px',
};

const STEP_BUTTON_CLICKABLE_STYLE: React.CSSProperties = {
  ...STEP_BUTTON_BASE_STYLE,
  cursor: 'pointer',
};

const STEP_BUTTON_DISABLED_STYLE: React.CSSProperties = {
  ...STEP_BUTTON_BASE_STYLE,
  cursor: 'default',
};

const STEP_HEADER_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const STEP_BADGE_ACTIVE_STYLE: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 300,
  color: 'white',
  background: 'var(--p500)',
};

const STEP_BADGE_INACTIVE_STYLE: React.CSSProperties = {
  ...STEP_BADGE_ACTIVE_STYLE,
  color: 'var(--t4)',
  background: 'rgba(var(--gl), .15)',
};

const STEP_TITLE_BASE_STYLE: React.CSSProperties = {
  fontSize: '13px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const STEP_TITLE_ACTIVE_STYLE: React.CSSProperties = {
  ...STEP_TITLE_BASE_STYLE,
  fontWeight: 300,
  color: 'var(--t1)',
};

const STEP_TITLE_INACTIVE_STYLE: React.CSSProperties = {
  ...STEP_TITLE_BASE_STYLE,
  fontWeight: 200,
  color: 'var(--t3)',
};

const STEP_DESCRIPTION_STYLE: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--t4)',
  paddingLeft: '28px',
};

const WIZARD_ROOT_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
};

const WIZARD_PANEL_STYLE: React.CSSProperties = {
  padding: '14px',
};

const WIZARD_NAV_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
};

const WIZARD_PREV_BUTTON_STYLE: React.CSSProperties = {
  border: 'none',
  padding: '8px 14px',
  color: 'var(--t2)',
  cursor: 'pointer',
  opacity: 1,
};

const WIZARD_PREV_BUTTON_DISABLED_STYLE: React.CSSProperties = {
  ...WIZARD_PREV_BUTTON_STYLE,
  cursor: 'not-allowed',
  opacity: 0.5,
};

const WIZARD_NEXT_BUTTON_STYLE: React.CSSProperties = {
  border: 'none',
  padding: '8px 14px',
  color: 'var(--t1)',
  cursor: 'pointer',
  background: 'color-mix(in srgb, var(--p500) 16%, var(--gi-bg))',
};

interface StepperItemProps {
  step: StepperStep;
  index: number;
  current: number;
  clickable: boolean;
  onStepChange?: (index: number) => void;
}

const StepperItem = React.memo(function StepperItem({
  step,
  index,
  current,
  clickable,
  onStepChange,
}: StepperItemProps) {
  const done = index < current;
  const active = index === current;
  const buttonStyle = clickable ? STEP_BUTTON_CLICKABLE_STYLE : STEP_BUTTON_DISABLED_STYLE;
  const badgeStyle = done || active ? STEP_BADGE_ACTIVE_STYLE : STEP_BADGE_INACTIVE_STYLE;
  const titleStyle = active ? STEP_TITLE_ACTIVE_STYLE : STEP_TITLE_INACTIVE_STYLE;

  const onClick = useCallback(() => {
    if (!clickable) return;
    onStepChange?.(index);
  }, [clickable, index, onStepChange]);

  return (
    <li style={STEPPER_ITEM_STYLE}>
      <button
        type="button"
        onClick={onClick}
        disabled={!clickable}
        style={buttonStyle}
      >
        <span style={STEP_HEADER_STYLE}>
          <span style={badgeStyle}>
            {done ? '\u2713' : index + 1}
          </span>
          <span style={titleStyle}>
            {step.title}
          </span>
        </span>
        {step.description && (
          <span style={STEP_DESCRIPTION_STYLE}>
            {step.description}
          </span>
        )}
      </button>
    </li>
  );
});

StepperItem.displayName = 'StepperItem';

export function Stepper({
  steps,
  current,
  onStepChange,
  clickable = true,
  className,
}: StepperProps) {
  const rootStyle = useMemo<React.CSSProperties>(
    () => ({
      ...STEPPER_ROOT_STYLE,
      gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))`,
    }),
    [steps.length],
  );

  return (
    <ol
      className={cn(className)}
      style={rootStyle}
    >
      {steps.map((step, index) => (
        <StepperItem
          key={step.id}
          step={step}
          index={index}
          current={current}
          clickable={clickable}
          onStepChange={onStepChange}
        />
      ))}
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
  const canGoPrev = boundedIndex > 0;
  const prevButtonStyle = canGoPrev ? WIZARD_PREV_BUTTON_STYLE : WIZARD_PREV_BUTTON_DISABLED_STYLE;

  const moveTo = useCallback((next: number) => {
    const safe = Math.max(0, Math.min(steps.length - 1, next));
    setActiveIndex(safe);
  }, [setActiveIndex, steps.length]);

  const onPrev = useCallback(() => {
    if (!canGoPrev) return;
    moveTo(boundedIndex - 1);
  }, [boundedIndex, canGoPrev, moveTo]);

  const onNext = useCallback(() => {
    if (isLast) {
      onComplete?.();
      return;
    }
    moveTo(boundedIndex + 1);
  }, [boundedIndex, isLast, moveTo, onComplete]);

  return (
    <div className={cn(className)} style={WIZARD_ROOT_STYLE}>
      <Stepper steps={steps} current={boundedIndex} onStepChange={moveTo} />

      <div className="gc nh" style={WIZARD_PANEL_STYLE}>
        {activeStep?.render}
      </div>

      {showNavigation && (
        <div style={WIZARD_NAV_STYLE}>
          <button
            type="button"
            className="gi"
            disabled={!canGoPrev}
            onClick={onPrev}
            style={prevButtonStyle}
          >
            {prevLabel}
          </button>

          <button
            type="button"
            className="gi"
            onClick={onNext}
            style={WIZARD_NEXT_BUTTON_STYLE}
          >
            {isLast ? doneLabel : nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
