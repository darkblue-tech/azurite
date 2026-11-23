import type { HTMLAttributes, ReactNode } from 'react';
import type { AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import { CloseIcon } from '../../icons';

export type ToastTone =
  | Extract<AzuriteTone, 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'>
  | 'surface';

export type ToastPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  pulsing?: boolean;
  closing?: boolean;
  placement?: ToastPlacement;
  aura?: boolean;
}

/**
 * Transient pill toast notification chip with tone roles, optional icon/action, and directional entrance.
 */
export function Toast({
  tone = 'neutral',
  icon,
  action,
  dismissible = false,
  onDismiss,
  pulsing = false,
  closing = false,
  placement,
  aura = false,
  className,
  children,
  ...rest
}: ToastProps) {
  const enterDirection = placement
    ? placement.startsWith('top')
      ? 'az-toast--enter-top'
      : 'az-toast--enter-bottom'
    : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'az-toast',
        `az-toast--tone-${tone}`,
        enterDirection,
        pulsing && 'az-toast--pulsing',
        closing && 'az-toast--closing',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className="az-toast__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {action}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="az-toast__close"
        >
          <CloseIcon size={12} />
        </button>
      )}
    </div>
  );
}

