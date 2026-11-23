import type { HTMLAttributes, ReactNode } from 'react';
import type { AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
>;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  indeterminate?: boolean;
  size?: ProgressSize;
  tone?: ProgressTone;
  trackVariant?: 'default' | 'tinted';
  label?: ReactNode;
  showValue?: boolean;
  formatValue?: (percentage: number) => ReactNode;
}

/**
 * Linear pill progress bar supporting determinate completion and smooth indeterminate looping.
 */
export function Progress({
  value = 0,
  min = 0,
  max = 100,
  indeterminate = false,
  size = 'md',
  tone = 'primary',
  trackVariant = 'default',
  label,
  showValue = false,
  formatValue,
  className,
  ...rest
}: ProgressProps) {
  const span = max - min;
  const pct = span > 0 ? Math.min(100, Math.max(0, ((value - min) / span) * 100)) : 0;
  const roundedPct = Math.round(pct);

  return (
    <div
      className={cn(
        'az-progress',
        `az-progress--${size}`,
        `az-progress--tone-${tone}`,
        `az-progress--track-${trackVariant}`,
        className,
      )}
      {...rest}
    >
      {(label !== undefined || (showValue && !indeterminate)) && (
        <div className="az-progress__header">
          {label !== undefined && <span className="az-progress__label">{label}</span>}
          {showValue && !indeterminate && (
            <span className={cn('az-progress__value', roundedPct === 0 && 'az-progress__value--zero')}>
              {formatValue ? formatValue(roundedPct) : `${roundedPct}%`}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-label={typeof label === 'string' ? label : rest['aria-label']}
        className="az-progress__track"
      >
        <div
          className={cn('az-progress__bar', indeterminate && 'az-progress__bar--indeterminate')}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

