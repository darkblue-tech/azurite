import { useState, type HTMLAttributes, type ReactNode } from 'react';
import type { AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CloseIcon,
  InfoIcon,
  XCircleIcon,
} from '../../icons';

export type AlertVariant = 'basic' | 'solid' | 'soft' | 'outline' | 'dashed' | 'rich';
export type AlertTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
>;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  tone?: AlertTone;
  title?: ReactNode;
  description?: ReactNode;
  /** Custom icon node, or `false` to omit the leading icon. */
  icon?: ReactNode | false;
  actions?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  aura?: boolean;
}

function getDefaultAlertIcon(tone: AlertTone): ReactNode {
  switch (tone) {
    case 'secondary':
      return <ClockIcon />;
    case 'success':
      return <CheckCircleIcon />;
    case 'warning':
      return <AlertTriangleIcon />;
    case 'error':
      return <XCircleIcon />;
    case 'info':
    case 'primary':
    default:
      return <InfoIcon />;
  }
}

/**
 * Inline status banner supporting basic, solid, soft, outline, dashed, and rich editorial layouts
 * with responsive action slots and animated dismissal.
 */
export function Alert({
  variant = 'basic',
  tone = 'primary',
  title,
  description,
  icon,
  actions,
  dismissible = false,
  onDismiss,
  aura = false,
  className,
  children,
  ...rest
}: AlertProps) {
  const [closing, setClosing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const resolvedIcon = icon === false ? null : (icon ?? getDefaultAlertIcon(tone));

  const handleDismiss = () => {
    setClosing(true);
    window.setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 150);
  };

  return (
    <div
      role="alert"
      className={cn(
        'az-alert',
        `az-alert--${variant}`,
        `az-alert--tone-${tone}`,
        closing && 'az-alert--closing',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      <div className="az-alert__main">
        {resolvedIcon &&
          (variant === 'rich' ? (
            <div className={cn('az-alert__icon-badge', `az-alert__icon-badge--${tone}`)} aria-hidden="true">
              {resolvedIcon}
            </div>
          ) : (
            <span className={cn('az-alert__icon', `az-alert__icon--tone-${tone}`)} aria-hidden="true">
              {resolvedIcon}
            </span>
          ))}

        <div className="az-alert__content">
          {title !== undefined && title !== null && <div className="az-alert__title">{title}</div>}
          {(description !== undefined && description !== null) && (
            <div className="az-alert__description">{description}</div>
          )}
          {children}
        </div>
      </div>

      {(actions || dismissible) && (
        <div className="az-alert__actions">
          {actions}
          {dismissible && (
            <button
              type="button"
              aria-label="Dismiss alert"
              onClick={handleDismiss}
              className="az-alert__close"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

