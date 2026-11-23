import type { HTMLAttributes, ReactNode } from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AzuriteSize;
  tone?: AzuriteTone;
  pulse?: boolean;
  label?: ReactNode;
}

/**
 * Animated pulsating circular status indicator across 5 calibrated scales and all semantic roles.
 */
export function StatusIndicator({
  size = 'md',
  tone = 'primary',
  pulse = true,
  label,
  className,
  ...rest
}: StatusIndicatorProps) {
  return (
    <span
      role="status"
      aria-label={typeof label === 'string' ? label : rest['aria-label'] ?? `${tone} status`}
      className={cn('az-status', `az-status--${size}`, `az-status--tone-${tone}`, className)}
      {...rest}
    >
      <span className="az-status__dot-wrap" aria-hidden="true">
        {pulse && <span className="az-status__ping" />}
        <span className="az-status__core" />
      </span>
      {label !== undefined && label !== null && <span>{label}</span>}
    </span>
  );
}

