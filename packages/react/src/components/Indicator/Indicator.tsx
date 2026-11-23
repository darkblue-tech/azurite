import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type IndicatorPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'left-center'
  | 'center'
  | 'right-center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type IndicatorTone =
  | 'primary'
  | 'primary-container'
  | 'tertiary'
  | 'tertiary-container'
  | 'secondary-container'
  | 'error'
  | 'error-container'
  | 'neutral'
  | 'surface';

export type IndicatorShape = 'pill' | 'rounded' | 'circle';

export interface IndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  placement?: IndicatorPlacement;
  content?: ReactNode;
  count?: number;
  max?: number;
  dot?: boolean;
  pulse?: boolean;
  tone?: IndicatorTone;
  shape?: IndicatorShape;
  ring?: boolean;
  ringColor?: string;
  offset?: [number, number];
  hidden?: boolean;
  label?: string;
  children: ReactNode;
}

/**
 * Versatile badge/dot/action overlay supporting all 9 anchor placements (corners,
 * edge centers, and media center) with semantic tones and ring cutout framing.
 */
export function Indicator({
  placement = 'top-right',
  content,
  count,
  max = 99,
  dot = false,
  pulse = false,
  tone = 'primary',
  shape = 'pill',
  ring = true,
  ringColor,
  offset,
  hidden = false,
  label,
  className,
  style,
  children,
  ...rest
}: IndicatorProps) {
  const isDot = dot || (content === undefined && count === undefined);
  const resolvedCount =
    count !== undefined ? (count > max ? `${max}+` : String(count)) : undefined;
  const resolvedContent = isDot ? null : (content ?? resolvedCount);

  const anchorStyle: CSSProperties = {
    ...(ringColor ? { ['--az-indicator-ring' as string]: ringColor } : {}),
    ...(offset
      ? {
          ['--az-indicator-ox' as string]: `${offset[0]}px`,
          ['--az-indicator-oy' as string]: `${offset[1]}px`,
        }
      : {}),
    ...style,
  };

  return (
    <div className={cn('az-indicator-anchor', className)} style={anchorStyle} {...rest}>
      {children}
      {!hidden && (
        <span
          aria-label={label}
          className={cn(
            'az-indicator',
            `az-indicator--${placement}`,
            `az-indicator--tone-${tone}`,
            !isDot && `az-indicator--${shape}`,
            isDot && 'az-indicator--dot',
            pulse && 'az-indicator--pulse',
            ring && tone !== 'surface' && 'az-indicator--ring',
          )}
        >
          {resolvedContent}
        </span>
      )}
    </div>
  );
}

