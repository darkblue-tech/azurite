import { useId, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent } from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type RatingVariant = 'star' | 'heart';
export type RatingPrecision = 0.5 | 1;
export type RatingTone = Extract<
  AzuriteTone,
  'primary' | 'tertiary' | 'warning' | 'error' | 'success'
>;

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  precision?: RatingPrecision;
  variant?: RatingVariant;
  size?: AzuriteSize;
  tone?: RatingTone;
  readOnly?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  showValue?: boolean;
}

const SIZE_PX: Record<AzuriteSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

const STAR_PATH =
  'M12 2.5l2.92 5.92 6.53.95-4.72 4.6 1.12 6.5L12 17.4l-5.85 3.07 1.12-6.5-4.72-4.6 6.53-.95L12 2.5z';

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

/**
 * Half-step precision star and heart rating control across 5 proportional scales
 * with hover preview, keyboard arrow navigation, and CSS token styling.
 */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  precision = 0.5,
  variant = 'star',
  size = 'md',
  tone,
  readOnly = false,
  disabled = false,
  allowClear = false,
  showValue = false,
  'aria-label': ariaLabel,
  className,
  ...rest
}: RatingProps) {
  const uid = useId();
  const resolvedTone: RatingTone = tone ?? (variant === 'heart' ? 'tertiary' : 'primary');
  const iconPx = SIZE_PX[size];
  const pathD = variant === 'heart' ? HEART_PATH : STAR_PATH;

  const [currentValue, setCurrentValue] = useControllableState<number>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue !== null ? hoverValue : currentValue;
  const interactive = !readOnly && !disabled;

  const computeStepFromPointer = (index: number, e: MouseEvent<HTMLButtonElement>): number => {
    if (precision === 1) return index;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    return isLeftHalf ? index - 0.5 : index;
  };

  const handleCommit = (next: number) => {
    if (!interactive) return;
    if (allowClear && next === currentValue) {
      setCurrentValue(0);
    } else {
      setCurrentValue(next);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      next = Math.min(max, currentValue + precision);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      next = Math.max(0, currentValue - precision);
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = max;
    }
    if (next !== null) {
      e.preventDefault();
      setCurrentValue(next);
    }
  };

  return (
    <div
      className={cn(
        'az-rating',
        `az-rating--tone-${resolvedTone}`,
        readOnly && 'az-rating--readonly',
        disabled && 'az-rating--disabled',
        className,
      )}
      {...rest}
    >
      <div
        role="slider"
        tabIndex={interactive ? 0 : undefined}
        aria-label={ariaLabel ?? `${variant} rating`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        className="az-rating__items"
        onKeyDown={handleKeyDown}
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {Array.from({ length: max }, (_, idx) => {
          const itemIndex = idx + 1;
          const gradId = `${uid}-half-${itemIndex}`;
          const isFull = displayValue >= itemIndex;
          const isHalf = !isFull && precision === 0.5 && displayValue >= itemIndex - 0.5;
          const fill = isFull
            ? 'var(--az-rating-active)'
            : isHalf
              ? `url(#${gradId})`
              : 'var(--az-rating-inactive)';

          return (
            <button
              key={itemIndex}
              type="button"
              tabIndex={-1}
              disabled={disabled}
              aria-label={`Rate ${itemIndex} out of ${max}`}
              className="az-rating__item"
              style={{ width: iconPx, height: iconPx }}
              onMouseMove={(e) => {
                if (interactive) setHoverValue(computeStepFromPointer(itemIndex, e));
              }}
              onClick={(e) => handleCommit(computeStepFromPointer(itemIndex, e))}
            >
              <svg viewBox="0 0 24 24" className="az-rating__svg" aria-hidden="true">
                {isHalf && (
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="50%" style={{ stopColor: 'var(--az-rating-active)' }} />
                      <stop offset="50%" style={{ stopColor: 'var(--az-rating-inactive)' }} />
                    </linearGradient>
                  </defs>
                )}
                <path d={pathD} fill={fill} />
              </svg>
            </button>
          );
        })}
      </div>

      {showValue && <span className="az-rating__value">{displayValue.toFixed(1)}</span>}
    </div>
  );
}

