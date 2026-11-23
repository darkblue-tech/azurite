import { useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronDownIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';

export type ContextSegmentTone =
  | 'primary'
  | 'tertiary'
  | 'secondary'
  | 'outline'
  | 'error'
  | 'success';

export type ContextChipTone = 'default' | 'warning' | 'critical';
export type ContextChipIndicator = 'ring' | 'icon' | 'dot' | 'none';

export interface ContextSegment {
  id: string;
  label: ReactNode;
  value: number;
  detail?: ReactNode;
  tone?: ContextSegmentTone;
}

export interface ContextChipProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  tone?: ContextChipTone;
  indicator?: ContextChipIndicator;
  percentage?: number;
  icon?: ReactNode;
  dotTone?: ContextSegmentTone;
  value: ReactNode;
  detail?: ReactNode;
  interactive?: boolean;
  expanded?: boolean;
  showChevron?: boolean;
  controlsId?: string;
}

const RING_RADIUS = 7;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const clampPct = (val: number) => Math.max(0, Math.min(100, val));

/**
 * Compact pill capacity indicator pairing an SVG ring, icon, or status dot with tabular metrics.
 */
export function ContextChip({
  tone = 'default',
  indicator = 'ring',
  percentage = 0,
  icon,
  dotTone = 'tertiary',
  value,
  detail,
  interactive = false,
  expanded = false,
  showChevron = false,
  controlsId,
  onClick,
  className,
  ...rest
}: ContextChipProps) {
  const clamped = clampPct(percentage);
  const offset = RING_CIRCUMFERENCE * (1 - clamped / 100);
  const compact = detail === undefined && !interactive;

  const chipClasses = cn(
    'az-context-chip',
    tone !== 'default' && `az-context-chip--${tone}`,
    compact && 'az-context-chip--compact',
    interactive && 'az-context-chip--interactive',
    expanded && 'az-context-chip--expanded',
    className,
  );

  const innerContent = (
    <>
      {indicator === 'ring' && (
        <span className="az-context-chip__ring-wrap" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="az-context-chip__ring">
            <circle
              cx="10"
              cy="10"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="az-context-chip__ring-track"
            />
            <circle
              cx="10"
              cy="10"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={RING_CIRCUMFERENCE.toFixed(2)}
              strokeDashoffset={offset.toFixed(2)}
              strokeLinecap="round"
              className="az-context-chip__ring-fill"
            />
          </svg>
        </span>
      )}

      {indicator === 'icon' && icon && (
        <span className="az-context-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {indicator === 'dot' && (
        <span
          className={cn('az-context__dot', `az-context__dot--${dotTone}`)}
          aria-hidden="true"
        />
      )}

      <span className="az-context-chip__value">{value}</span>
      {detail !== undefined && <span className="az-context-chip__detail">{detail}</span>}
      {interactive && showChevron && (
        <span className="az-context-chip__chevron" aria-hidden="true">
          <ChevronDownIcon size={18} />
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={controlsId}
        onClick={onClick}
        className={chipClasses}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={chipClasses}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {innerContent}
    </div>
  );
}

export interface ContextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  percentage: number;
  valueLabel?: ReactNode;
  summary?: ReactNode;
  badge?: ReactNode;
  badgeTone?: 'primary' | 'tertiary' | 'error';
  chipTone?: ContextChipTone;
  indicator?: ContextChipIndicator;
  icon?: ReactNode;
  activeLabel?: ReactNode;
  remainingLabel?: ReactNode;
  segments: ContextSegment[];
  actionLabel?: ReactNode;
  onAction?: () => void;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  floating?: boolean;
  overlayAriaLabel?: string;
}

/**
 * Glanceable capacity chip paired with an interactive expanded breakdown overlay card.
 */
export function Context({
  title,
  percentage,
  valueLabel,
  summary,
  badge,
  badgeTone = 'primary',
  chipTone = 'default',
  indicator = 'ring',
  icon,
  activeLabel,
  remainingLabel,
  segments,
  actionLabel,
  onAction,
  footer,
  open,
  defaultOpen = true,
  onOpenChange,
  floating = false,
  overlayAriaLabel,
  className,
  ...rest
}: ContextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayId = useId();

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useOutsideClick(rootRef, () => setIsOpen(false), floating && isOpen);

  const clamped = clampPct(percentage);
  const computedValue = valueLabel ?? `${clamped.toFixed(1)}%`;
  const computedBadge = badge ?? `${clamped.toFixed(1)}% Used`;
  const hasFooter = footer !== undefined || actionLabel !== undefined;

  return (
    <div
      ref={rootRef}
      className={cn('az-context', floating && 'az-context--floating', className)}
      {...rest}
    >
      <ContextChip
        interactive
        expanded={isOpen}
        showChevron
        controlsId={overlayId}
        tone={chipTone}
        indicator={indicator}
        percentage={clamped}
        icon={icon}
        value={computedValue}
        detail={summary}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <div
        className={cn(
          'az-context__panel-shell',
          isOpen && 'az-context__panel-shell--open',
          floating && 'az-context__panel-shell--floating',
        )}
      >
        <div className="az-context__panel-inner">
          <div
            id={overlayId}
            role="region"
            aria-label={overlayAriaLabel ?? (typeof title === 'string' ? title : 'Context breakdown')}
            aria-hidden={!isOpen || undefined}
            className="az-context__card"
          >
            <div className="az-context__header">
              <h3 className="az-context__title">{title}</h3>
              <span className={cn('az-context__badge', `az-context__badge--${badgeTone}`)}>
                {computedBadge}
              </span>
            </div>

            <div className="az-context__progress-group">
              <div
                className="az-context__bar"
                role="progressbar"
                aria-valuenow={Math.round(clamped)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {segments.map((seg) => {
                  const tone = seg.tone ?? 'primary';
                  return (
                    <div
                      key={seg.id}
                      className={cn('az-context__segment', `az-context__segment--${tone}`)}
                      style={{ width: `${clampPct(seg.value)}%` }}
                      title={typeof seg.label === 'string' ? seg.label : undefined}
                    />
                  );
                })}
              </div>

              {(activeLabel !== undefined || remainingLabel !== undefined) && (
                <div className="az-context__captions">
                  <span className="az-context__caption">{activeLabel}</span>
                  <span className="az-context__caption">{remainingLabel}</span>
                </div>
              )}
            </div>

            <div className="az-context__rows">
              {segments.map((seg) => {
                const tone = seg.tone ?? 'primary';
                return (
                  <div key={seg.id} className="az-context__row">
                    <div className="az-context__row-head">
                      <div className="az-context__row-label">
                        <span
                          className={cn('az-context__dot', `az-context__dot--${tone}`)}
                          aria-hidden="true"
                        />
                        <span>{seg.label}</span>
                      </div>
                      {seg.detail !== undefined && (
                        <span className="az-context__row-detail">{seg.detail}</span>
                      )}
                    </div>
                    <div className="az-context__row-track">
                      <div
                        className={cn('az-context__row-fill', `az-context__row-fill--${tone}`)}
                        style={{ width: `${clampPct(seg.value)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {hasFooter && (
              <div className="az-context__footer">
                {footer ?? (
                  <button
                    type="button"
                    className="az-context__action-btn"
                    onClick={onAction}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

