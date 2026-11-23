import { Children, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type StatValueTone =
  | 'default'
  | 'primary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'error'
  | 'rose'
  | 'violet'
  | 'amber';

export type StatSurface = 'low' | 'default' | 'primary-container';

export interface StatProps extends HTMLAttributes<HTMLElement> {
  /** Metric title displayed above the figure. */
  label: ReactNode;
  /** Primary numeric or summary figure rendered in bold tabular numerals. */
  value: ReactNode;
  /** Comparative delta or subtitle beneath value. */
  description?: ReactNode;
  /** Icon aligned to the right of the value figure. */
  icon?: ReactNode;
  /** Avatar, badge, or media aligned cleanly on the trailing edge of the card. */
  aside?: ReactNode;
  /** Action buttons replacing or augmenting the bottom slot. */
  actions?: ReactNode;
  /** Semantic value text color. */
  valueTone?: StatValueTone;
  /** Container background elevation role. */
  surface?: StatSurface;
  /** Editorial left-aligned vs centered alignment. */
  align?: 'left' | 'center';
  /** Typography scale for the metric figure ('lg' default). */
  size?: 'sm' | 'md' | 'lg';
  /** Stacked vertical card vs horizontal row item (e.g. vertical metric sidebar). */
  layout?: 'vertical' | 'row';
}

/**
 * High-clarity KPI Stat tile with tabular numerals, semantic deltas,
 * optional matched icons/avatars, and actionable balance controls.
 */
export function Stat({
  label,
  value,
  description,
  icon,
  aside,
  actions,
  valueTone = 'default',
  surface = 'low',
  align = 'left',
  size = 'lg',
  layout = 'vertical',
  className,
  ...rest
}: StatProps) {
  const valueClass = cn(
    'az-stat__value',
    valueTone !== 'default' && `az-stat__value--${valueTone}`,
  );

  return (
    <article
      className={cn(
        'az-stat',
        `az-stat--${size}`,
        surface === 'default' && 'az-stat--surface',
        surface === 'primary-container' && 'az-stat--primary-container',
        align === 'center' && 'az-stat--center',
        layout === 'row' && 'az-stat--row',
        className,
      )}
      {...rest}
    >
      <div className="az-stat__stack">
        <span className="az-stat__label">{label}</span>

        {icon ? (
          <div className="az-stat__value-row">
            <div className={valueClass}>{value}</div>
            <span
              className={cn(
                'az-stat__icon',
                valueTone !== 'default' && `az-stat__value--${valueTone}`,
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          </div>
        ) : (
          <div className={valueClass}>{value}</div>
        )}

        {description && <p className="az-stat__description">{description}</p>}
        {actions && <div className="az-stat__actions">{actions}</div>}
      </div>

      {aside && <div className="az-stat__aside">{aside}</div>}
    </article>
  );
}

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 'joined' unifies children in one bordered card with 1px hairline dividers; 'standalone' keeps spaced cards. */
  variant?: 'joined' | 'standalone';
  /** 'responsive' stacks vertically below 768px and goes horizontal above. */
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  /** Number of columns in horizontal/responsive desktop view (defaults to child count up to 4). */
  columns?: 2 | 3 | 4;
  /** Shared surface tone when `variant="joined"`. */
  surface?: StatSurface;
  children?: ReactNode;
}

/**
 * Coordinates multiple Stat modules into either standalone spaced grids or unified
 * hairline-divided horizontal/vertical/responsive KPI strips.
 */
export function StatGroup({
  variant = 'joined',
  orientation = 'responsive',
  columns,
  surface = 'default',
  className,
  style,
  children,
  ...rest
}: StatGroupProps) {
  const count = Math.max(1, Math.min(4, columns ?? Children.count(children)));

  return (
    <div
      className={cn(
        'az-stat-group',
        `az-stat-group--${variant}`,
        `az-stat-group--${orientation}`,
        surface !== 'default' && `az-stat-group--${surface}`,
        className,
      )}
      style={{ '--az-stat-cols': count, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}

