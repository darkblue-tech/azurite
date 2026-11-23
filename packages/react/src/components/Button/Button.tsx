import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import { LoadingIndicator, type LoadingVariant } from '../LoadingIndicator/LoadingIndicator';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'dashed' | 'ghost' | 'link';
export type ButtonTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'error' | 'success'
>;
export type ButtonShape = 'pill' | 'square' | 'round';
export type ButtonWidth = 'auto' | 'wide' | 'block';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: AzuriteSize;
  shape?: ButtonShape;
  iconOnly?: boolean;
  width?: ButtonWidth;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  badge?: ReactNode;
  loading?: boolean;
  loadingVariant?: LoadingVariant;
  loadingText?: ReactNode;
  aura?: boolean;
}

/**
 * Primary tactile button supporting 6 variants, 6 tones, 5 scales, pill/square/round shapes,
 * inline badges, AI ambient aura, and 4 animated loading states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'primary',
    size = 'md',
    shape = 'pill',
    iconOnly = false,
    width = 'auto',
    leadingIcon,
    trailingIcon,
    badge,
    loading = false,
    loadingVariant = 'spinner',
    loadingText,
    aura = false,
    disabled = false,
    type = 'button',
    className,
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;

  const loaderNode = (
    <LoadingIndicator
      variant={loadingVariant}
      size={size === 'xs' || size === 'sm' ? 14 : 16}
    />
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'az-btn',
        `az-btn--${variant}`,
        `az-btn--tone-${tone}`,
        `az-btn--${size}`,
        `az-btn--${shape}`,
        iconOnly && 'az-btn--icon-only',
        width !== 'auto' && `az-btn--${width}`,
        loading && 'az-btn--loading',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {iconOnly ? (
        loading ? loaderNode : (leadingIcon ?? children)
      ) : (
        <>
          {loading ? (
            loaderNode
          ) : (
            leadingIcon && <span className="az-btn__icon">{leadingIcon}</span>
          )}
          {(loading && loadingText !== undefined ? loadingText : children) !== undefined && (
            <span>{loading && loadingText !== undefined ? loadingText : children}</span>
          )}
          {!loading && trailingIcon && <span className="az-btn__icon">{trailingIcon}</span>}
          {badge && <span className="az-btn__badge">{badge}</span>}
        </>
      )}
    </button>
  );
});

