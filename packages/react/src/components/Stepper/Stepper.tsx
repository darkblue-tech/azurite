import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { CheckIcon, ErrorIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type StepperOrientation = 'horizontal' | 'vertical' | 'responsive';
export type StepperVariant = 'numbered' | 'icon';
export type StepStatus = 'completed' | 'active' | 'upcoming' | 'error';

export interface StepItem {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  steps: StepItem[];
  activeStep?: number;
  defaultActiveStep?: number;
  onStepChange?: (index: number) => void;
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  interactive?: boolean;
}

function resolveStatus(index: number, activeIndex: number, explicit?: StepStatus): StepStatus {
  if (explicit) return explicit;
  if (index < activeIndex) return 'completed';
  if (index === activeIndex) return 'active';
  return 'upcoming';
}

/**
 * Sequential progression stepper supporting horizontal, vertical, and responsive icon-led
 * layouts with interactive step selection.
 */
export function Stepper({
  steps,
  activeStep,
  defaultActiveStep = 0,
  onStepChange,
  orientation = 'horizontal',
  variant = 'numbered',
  interactive = true,
  className,
  style,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useControllableState<number>({
    value: activeStep,
    defaultValue: defaultActiveStep,
    onChange: onStepChange,
  });

  if (variant === 'icon') {
    const isResponsive = orientation === 'responsive';
    const isForcedHorizontal = orientation === 'horizontal';

    return (
      <div
        role="list"
        className={cn(
          'az-stepper',
          'az-stepper--icon',
          isResponsive && 'az-stepper--responsive',
          isForcedHorizontal && 'az-stepper--horizontal-icon',
          className,
        )}
        style={style}
        {...rest}
      >
        {steps.map((step, idx) => {
          const status = resolveStatus(idx, currentStep, step.status);
          const canClick = interactive && !step.disabled;
          const Tag = canClick ? 'button' : 'div';
          const isLast = idx === steps.length - 1;

          return (
            <Fragment key={step.id ?? idx}>
              <Tag
                type={canClick ? 'button' : undefined}
                disabled={canClick ? undefined : step.disabled}
                aria-current={status === 'active' ? 'step' : undefined}
                className={cn(
                  'az-step-i',
                  `az-step-i--${status}`,
                  canClick && 'az-step-i--interactive',
                )}
                onClick={canClick ? () => setCurrentStep(idx) : undefined}
              >
                <span className={cn('az-step__node', `az-step__node--${status}`)}>
                  {step.icon ?? (status === 'completed' ? <CheckIcon size={18} /> : idx + 1)}
                </span>
                <span className="az-step-i__text">
                  <span className="az-step-i__title">{step.title}</span>
                  {step.description !== undefined && (
                    <span className="az-step-i__desc">{step.description}</span>
                  )}
                </span>
              </Tag>

              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'az-step-i__connector',
                    idx < currentStep && 'az-step-i__connector--active',
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div
        role="list"
        className={cn('az-stepper', 'az-stepper--vertical', className)}
        style={style}
        {...rest}
      >
        {steps.map((step, idx) => {
          const status = resolveStatus(idx, currentStep, step.status);
          const isLast = idx === steps.length - 1;
          return (
            <div
              key={step.id ?? idx}
              role="listitem"
              aria-current={status === 'active' ? 'step' : undefined}
              className={cn('az-step-v', `az-step-v--${status}`)}
            >
              <div className="az-step-v__rail">
                <span className={cn('az-step__node', `az-step__node--${status}`)}>
                  {status === 'completed' ? (
                    <CheckIcon size={16} />
                  ) : status === 'error' ? (
                    <ErrorIcon size={16} />
                  ) : (
                    step.icon ?? idx + 1
                  )}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn('az-step-v__line', idx < currentStep && 'az-step-v__line--active')}
                  />
                )}
              </div>
              <div className="az-step-v__body">
                <span className="az-step-v__title">{step.title}</span>
                {step.description !== undefined && (
                  <p className="az-step-v__desc">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="list"
      className={cn('az-stepper', 'az-stepper--horizontal', className)}
      style={{ gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))`, ...style }}
      {...rest}
    >
      {steps.map((step, idx) => {
        const status = resolveStatus(idx, currentStep, step.status);
        const canClick = interactive && !step.disabled;
        const Tag = canClick ? 'button' : 'div';
        const isFirst = idx === 0;
        const isLast = idx === steps.length - 1;

        return (
          <Tag
            key={step.id ?? idx}
            type={canClick ? 'button' : undefined}
            aria-current={status === 'active' ? 'step' : undefined}
            className={cn(
              'az-step-h',
              `az-step-h--${status}`,
              canClick && 'az-step-h--interactive',
            )}
            onClick={canClick ? () => setCurrentStep(idx) : undefined}
          >
            <div className="az-step-h__rail">
              <div
                aria-hidden="true"
                className={cn(
                  'az-step-h__line',
                  isFirst && 'az-step-h__line--hidden',
                  !isFirst && idx <= currentStep && 'az-step-h__line--active',
                )}
              />
              <span className={cn('az-step__node', `az-step__node--${status}`)}>
                {status === 'completed' ? (
                  <CheckIcon size={18} />
                ) : status === 'error' ? (
                  <ErrorIcon size={18} />
                ) : (
                  step.icon ?? idx + 1
                )}
              </span>
              <div
                aria-hidden="true"
                className={cn(
                  'az-step-h__line',
                  isLast && 'az-step-h__line--hidden',
                  !isLast && idx < currentStep && 'az-step-h__line--active',
                )}
              />
            </div>
            <span className="az-step-h__title">{step.title}</span>
            {step.description !== undefined && (
              <span className="az-step-h__desc">{step.description}</span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}

