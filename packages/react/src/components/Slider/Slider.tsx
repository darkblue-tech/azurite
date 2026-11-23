import {
  forwardRef,
  useId,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderTone = Extract<
  AzuriteTone,
  'primary' | 'tertiary' | 'secondary' | 'success' | 'error'
>;

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'defaultValue' | 'onChange'
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: AzuriteSize;
  orientation?: SliderOrientation;
  height?: number | string;
  tone?: SliderTone;
  marks?: boolean | SliderMark[];
  label?: ReactNode;
  compactLabel?: boolean;
  showValue?: boolean;
  valueBadge?: boolean;
  formatValue?: (value: number) => ReactNode;
  caption?: ReactNode;
}

function buildAutoMarks(min: number, max: number, step: number): SliderMark[] {
  if (step <= 0 || max <= min) return [];
  const steps = Math.round((max - min) / step);
  if (steps <= 0 || steps > 20) return [];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const val = min + i * step;
    return { value: val, label: String(val) };
  });
}

/**
 * Interactive continuous and stepped range slider across 5 proportional scales,
 * clickable tick marks, and vertical orientation.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    orientation = 'horizontal',
    height = 224,
    tone = 'primary',
    marks = false,
    label,
    compactLabel = false,
    showValue = true,
    valueBadge = false,
    formatValue,
    caption,
    disabled = false,
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const controlId = id ?? autoId;

  const [rawVal, setRawVal] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });

  const clampedVal = Math.min(max, Math.max(min, rawVal));
  const span = max - min;
  const pct = span > 0 ? ((clampedVal - min) / span) * 100 : 0;

  const resolvedMarks: SliderMark[] = Array.isArray(marks)
    ? marks
    : marks
      ? buildAutoMarks(min, max, step)
      : [];

  const formattedValue = formatValue ? formatValue(clampedVal) : `${clampedVal}`;

  const rootStyle: CSSProperties = {
    ['--az-slider-fill-pct' as string]: `${pct}%`,
    ...style,
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'az-slider',
          'az-slider--vertical',
          `az-slider--${size}`,
          `az-slider--tone-${tone}`,
          className,
        )}
        style={rootStyle}
      >
        {(label !== undefined || showValue) && (
          <div className="az-slider__header">
            {label !== undefined && (
              <label htmlFor={controlId} className="az-slider__label az-slider__label--compact">
                {label}
              </label>
            )}
            {showValue && (
              <span className={cn('az-slider__value', valueBadge && 'az-slider__value--badge')}>
                {formattedValue}
              </span>
            )}
          </div>
        )}

        <div className="az-slider__vertical-wrap" style={{ height }}>
          <input
            ref={ref}
            id={controlId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={clampedVal}
            disabled={disabled}
            aria-orientation="vertical"
            className="az-slider__input-vertical"
            onChange={(e) => setRawVal(Number(e.target.value))}
            {...rest}
          />
          {resolvedMarks.length > 0 && (
            <div className="az-slider__vertical-marks">
              {resolvedMarks.map((mark) => (
                <button
                  key={mark.value}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    'az-slider__mark',
                    clampedVal === mark.value && 'az-slider__mark--active',
                  )}
                  onClick={() => !disabled && setRawVal(mark.value)}
                >
                  <span>{mark.label ?? mark.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {caption !== undefined && <span className="az-slider__label--compact">{caption}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'az-slider',
        `az-slider--${size}`,
        `az-slider--tone-${tone}`,
        className,
      )}
      style={rootStyle}
    >
      {(label !== undefined || showValue) && (
        <div className="az-slider__header">
          {label !== undefined && (
            <label
              htmlFor={controlId}
              className={cn('az-slider__label', compactLabel && 'az-slider__label--compact')}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className={cn('az-slider__value', valueBadge && 'az-slider__value--badge')}>
              {formattedValue}
            </span>
          )}
        </div>
      )}

      <input
        ref={ref}
        id={controlId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clampedVal}
        disabled={disabled}
        className="az-slider__input"
        onChange={(e) => setRawVal(Number(e.target.value))}
        {...rest}
      />

      {resolvedMarks.length > 0 && (
        <div className="az-slider__marks">
          {resolvedMarks.map((mark) => (
            <button
              key={mark.value}
              type="button"
              disabled={disabled}
              className={cn(
                'az-slider__mark',
                clampedVal === mark.value && 'az-slider__mark--active',
              )}
              onClick={() => !disabled && setRawVal(mark.value)}
            >
              <span className="az-slider__mark-tick" aria-hidden="true" />
              <span>{mark.label ?? mark.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

