import type { HTMLAttributes, ReactNode } from 'react';
import type { AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';

export type RadialProgressSize = 'sm' | 'md' | 'lg' | number;
export type RadialProgressThickness = 'thin' | 'standard' | 'bold' | number;
export type RadialProgressVariant = 'plain' | 'filled' | 'tonal';
export type RadialProgressTone = Extract<
  AzuriteTone,
  'primary' | 'tertiary' | 'secondary' | 'success' | 'warning' | 'error'
>;

export interface RadialProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  indeterminate?: boolean;
  size?: RadialProgressSize;
  thickness?: RadialProgressThickness;
  variant?: RadialProgressVariant;
  tone?: RadialProgressTone;
  showValue?: boolean;
  accentValue?: boolean;
  accentCaption?: boolean;
  caption?: ReactNode;
  formatValue?: (percentage: number) => ReactNode;
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg', number> = {
  sm: 56,
  md: 80,
  lg: 96,
};

const THICKNESS_MAP: Record<'thin' | 'standard' | 'bold', number> = {
  thin: 3,
  standard: 6,
  bold: 10,
};

/**
 * Radial SVG progress gauge supporting hairline, standard, and bold stroke weights
 * plus solid filled and tonal badge container styles.
 */
export function RadialProgress({
  value = 0,
  min = 0,
  max = 100,
  indeterminate = false,
  size,
  thickness = 'standard',
  variant = 'plain',
  tone = 'primary',
  showValue = true,
  accentValue = false,
  accentCaption = false,
  caption,
  formatValue,
  className,
  ...rest
}: RadialProgressProps) {
  const resolvedSizeKey: RadialProgressSize = size ?? (variant === 'plain' ? 'md' : 'lg');
  const boxPx = typeof resolvedSizeKey === 'number' ? resolvedSizeKey : SIZE_MAP[resolvedSizeKey];
  const strokeWidth = typeof thickness === 'number' ? thickness : THICKNESS_MAP[thickness];
  const svgPx = variant === 'plain' ? boxPx : Math.round(boxPx * 0.8333);

  const viewSize = 80;
  const radius = Math.max(12, 37 - strokeWidth * 0.5);
  const circumference = 2 * Math.PI * radius;

  const span = max - min;
  const pct = span > 0 ? Math.min(100, Math.max(0, ((value - min) / span) * 100)) : 0;
  const roundedPct = Math.round(pct);
  const effectivePct = indeterminate ? 28 : pct;
  const dashOffset = circumference * (1 - effectivePct / 100);

  return (
    <div
      className={cn(
        'az-radial',
        `az-radial--${variant}`,
        `az-radial--tone-${tone}`,
        accentCaption && 'az-radial--caption-primary',
        className,
      )}
      {...rest}
    >
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-label={typeof caption === 'string' ? caption : rest['aria-label'] ?? 'Progress'}
        className="az-radial__circle-box"
        style={{ width: boxPx, height: boxPx }}
      >
        <svg
          className={cn('az-radial__svg', indeterminate && 'az-radial__svg--indeterminate')}
          width={svgPx}
          height={svgPx}
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          aria-hidden="true"
        >
          <circle
            cx={viewSize / 2}
            cy={viewSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="az-radial__track-stroke"
          />
          <circle
            cx={viewSize / 2}
            cy={viewSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="az-radial__bar-stroke"
          />
        </svg>

        {showValue && !indeterminate && (
          <span className={cn('az-radial__value', accentValue && 'az-radial__value--primary-accent')}>
            {formatValue ? formatValue(roundedPct) : `${roundedPct}%`}
          </span>
        )}
      </div>

      {caption !== undefined && <span className="az-radial__caption">{caption}</span>}
    </div>
  );
}

