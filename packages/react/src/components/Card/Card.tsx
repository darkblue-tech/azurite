import {
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { AzuriteSize } from '../../types';
import { CheckIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Badge } from '../Badge/Badge';

export type CardVariant = 'tonal' | 'outlined' | 'elevated' | 'dashed' | 'neutral' | 'overlay';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Surface and border treatment mirroring the 13 Card Patterns spec sheet. */
  variant?: CardVariant;
  /** Padding & corner-radius scale: xs (12px) through xl (48px). */
  size?: AzuriteSize;
  /** Applies internal card padding (set false when composing edge-to-edge CardMedia). */
  padded?: boolean;
  /** Content alignment. */
  align?: 'start' | 'center';
  /** Enables hover elevation lift / border feedback. */
  interactive?: boolean;
  /** Switches tonal hover to soft surface darkening instead of vertical lift. */
  hoverTintOnly?: boolean;
  children?: ReactNode;
}

/**
 * Primary surface container Card supporting tonal, outlined, elevated, dashed,
 * neutral, and overlay compositions across 5 density tiers.
 */
export function Card({
  variant = 'tonal',
  size = 'md',
  padded = true,
  align = 'start',
  interactive = false,
  hoverTintOnly = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <article
      className={cn(
        'az-card',
        `az-card--${variant}`,
        `az-card--${size}`,
        padded && variant !== 'overlay' && 'az-card--padded',
        align === 'center' && 'az-card--center',
        interactive && 'az-card--interactive',
        hoverTintOnly && 'az-card--hover-tint',
        className,
      )}
      {...rest}
    >
      {children}
    </article>
  );
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  aspectRatio?: string;
  zoomOnHover?: boolean;
  overlayScrim?: boolean;
  children?: ReactNode;
}

export function CardMedia({
  src,
  alt = '',
  aspectRatio = '16 / 10',
  zoomOnHover = true,
  overlayScrim = false,
  className,
  style,
  children,
  ...rest
}: CardMediaProps) {
  return (
    <>
      <div
        className={cn(
          'az-card__media',
          zoomOnHover && 'az-card__media--zoom',
          className,
        )}
        style={{ ...(!overlayScrim ? { aspectRatio } : {}), ...style }}
        {...rest}
      >
        {src ? <img src={src} alt={alt} /> : children}
      </div>
      {overlayScrim && <div className="az-card__scrim" aria-hidden="true" />}
    </>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
  children?: ReactNode;
}

export function CardHeader({ divider = false, className, children, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn('az-card__header', divider && 'az-card__header--divider', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('az-card__body', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('az-card__title', className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('az-card__description', className)} {...rest}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('az-card__footer', className)} {...rest}>
      {children}
    </div>
  );
}

export interface SelectableCardProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange' | 'title'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode;
  title: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}

/**
 * Interactive single-selection card checkbox with icon, optional badge, pricing/meta slot,
 * and animated check indicator.
 */
export function SelectableCard({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  icon,
  title,
  badge,
  description,
  meta,
  className,
  ...rest
}: SelectableCardProps) {
  const [isChecked, setIsChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        'az-selectable-card',
        isChecked && 'az-selectable-card--checked',
        className,
      )}
      onClick={() => !disabled && setIsChecked(!isChecked)}
      {...rest}
    >
      <div className="az-selectable-card__left">
        {icon && <span className="az-selectable-card__icon">{icon}</span>}
        <div className="az-selectable-card__text">
          <div className="az-selectable-card__title-row">
            <span className="az-selectable-card__title">{title}</span>
            {badge}
          </div>
          {description && <span className="az-selectable-card__desc">{description}</span>}
        </div>
      </div>

      <div className="az-selectable-card__right">
        {meta && <span className="az-selectable-card__meta">{meta}</span>}
        <span className="az-selectable-card__check" aria-hidden="true">
          <CheckIcon size={16} />
        </span>
      </div>
    </button>
  );
}

export interface SelectableCardOption {
  value: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
  disabledBadge?: ReactNode;
}

export interface SelectableCardGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectableCardOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: SelectableCardOption) => void;
  ariaLabel?: string;
}

/**
 * Joined segmented multi-option card selector with unavailable/disabled slot handling
 * and keyboard radio-group traversal.
 */
export function SelectableCardGroup({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel = 'Card options',
  className,
  ...rest
}: SelectableCardGroupProps) {
  const firstEnabled = options.find((o) => !o.disabled)?.value ?? options[0]?.value ?? '';
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabled,
  });

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (opt: SelectableCardOption) => {
    if (opt.disabled) return;
    setSelected(opt.value);
    onChange?.(opt.value, opt);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const enabled = options
      .map((o, i) => (!o.disabled ? i : -1))
      .filter((i) => i !== -1);
    if (enabled.length === 0) return;

    const pos = enabled.indexOf(idx);
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') nextIdx = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') nextIdx = enabled[0];
    else if (e.key === 'End') nextIdx = enabled[enabled.length - 1];

    btnRefs.current[nextIdx]?.focus();
    handleSelect(options[nextIdx]);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('az-selectable-group', className)}
      {...rest}
    >
      {options.map((opt, idx) => {
        const active = opt.value === selected && !opt.disabled;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={opt.disabled || undefined}
            disabled={opt.disabled}
            className={cn(
              'az-selectable-group__option',
              active && 'az-selectable-group__option--active',
            )}
            onClick={() => handleSelect(opt)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            <div className="az-selectable-group__top">
              <span className="az-selectable-group__title">{opt.title}</span>
              {opt.disabled ? (
                <Badge size="sm" variant="soft" tone="neutral">
                  {opt.disabledBadge ?? 'Unavailable'}
                </Badge>
              ) : (
                <span className="az-selectable-group__radio" aria-hidden="true">
                  <span className="az-selectable-group__radio-dot" />
                </span>
              )}
            </div>

            {(opt.subtitle || opt.meta) && (
              <div className="az-selectable-group__meta">
                {opt.subtitle && <span className="az-selectable-group__sub">{opt.subtitle}</span>}
                {opt.meta && <span className="az-selectable-group__price">{opt.meta}</span>}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

