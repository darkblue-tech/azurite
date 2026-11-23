import type { HTMLAttributes, ReactNode } from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import { CloseIcon } from '../../icons';

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dotted' | 'ghost';
export type BadgeTone = AzuriteTone | 'muted';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: AzuriteSize;
  /** Renders a minimal circular dot badge (8/12/16/20px) without label text. */
  empty?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  tabularNums?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  aura?: boolean;
}

/**
 * Pill badge supporting 5 scales, solid/soft/outline/dotted/ghost variants,
 * empty circular dots, leading icons, numeric counters, and AI ambient aura.
 */
export function Badge({
  variant = 'solid',
  tone = 'primary',
  size = 'md',
  empty = false,
  icon,
  trailingIcon,
  tabularNums = false,
  removable = false,
  onRemove,
  aura = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      role={empty ? rest.role ?? 'status' : rest.role}
      className={cn(
        'az-badge',
        `az-badge--${variant}`,
        `az-badge--tone-${tone}`,
        `az-badge--${size}`,
        empty && 'az-badge--empty',
        tabularNums && 'az-badge--tabular',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {!empty && (
        <>
          {icon && <span className="az-badge__icon">{icon}</span>}
          {children !== undefined && children !== null && <span>{children}</span>}
          {trailingIcon && <span className="az-badge__icon">{trailingIcon}</span>}
          {removable && (
            <button
              type="button"
              aria-label="Remove badge"
              onClick={onRemove}
              className="az-badge__remove"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </>
      )}
    </span>
  );
}

