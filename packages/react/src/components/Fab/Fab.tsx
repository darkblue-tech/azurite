import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { PlusIcon } from '../../icons';

export type FabSize = 'sm' | 'md' | 'lg';
export type FabTone = 'primary' | 'surface' | 'neutral' | 'secondary';
export type FabPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: FabSize;
  tone?: FabTone;
  icon?: ReactNode;
  label?: ReactNode;
  rotated?: boolean;
  aura?: boolean;
  fixed?: boolean;
  position?: FabPosition;
}

/**
 * Floating Action Button supporting circular and extended pill modes, 4 tones,
 * 45° open rotation animation, AI ambient aura, and fixed corner placement.
 */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  {
    size = 'md',
    tone = 'primary',
    icon,
    label,
    rotated = false,
    aura = false,
    fixed = false,
    position = 'bottom-right',
    type = 'button',
    className,
    children,
    ...rest
  },
  ref,
) {
  const isExtended = label !== undefined && label !== null;
  const content = icon ?? children ?? <PlusIcon size={size === 'sm' ? 18 : 24} />;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'az-fab',
        `az-fab--${size}`,
        `az-fab--tone-${tone}`,
        isExtended && 'az-fab--extended',
        fixed && `az-fab--fixed az-fab--pos-${position}`,
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      <span className={cn('az-fab__icon', rotated && 'az-fab__icon--rotated')} aria-hidden={!children && !label}>
        {content}
      </span>
      {isExtended && <span>{label}</span>}
    </button>
  );
});

