import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerTone = 'default' | 'subtle' | 'strong' | 'primary';
export type DividerLabelPosition = 'start' | 'center' | 'end';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  tone?: DividerTone;
  labelPosition?: DividerLabelPosition;
  spacing?: DividerSpacing;
  children?: ReactNode;
}

/**
 * Swiss hairline and typographic separator supporting horizontal and vertical orientations
 * with optional inline label (e.g. "or").
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  tone = 'default',
  labelPosition = 'center',
  spacing = 'none',
  children,
  className,
  ...rest
}: DividerProps) {
  const hasLabel = children !== undefined && children !== null && children !== false;

  if (orientation === 'horizontal' && !hasLabel) {
    return (
      <hr
        className={cn(
          'az-divider-hr',
          `az-divider--${variant}`,
          `az-divider--tone-${tone}`,
          spacing !== 'none' && `az-divider--space-${spacing}`,
          className,
        )}
        {...(rest as HTMLAttributes<HTMLHRElement>)}
      />
    );
  }

  if (orientation === 'vertical' && !hasLabel) {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'az-divider',
          'az-divider--vertical',
          'az-divider--bare',
          `az-divider--tone-${tone}`,
          spacing !== 'none' && `az-divider--space-${spacing}`,
          className,
        )}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'az-divider',
        `az-divider--${orientation}`,
        `az-divider--${variant}`,
        `az-divider--tone-${tone}`,
        `az-divider--label-${labelPosition}`,
        spacing !== 'none' && `az-divider--space-${spacing}`,
        className,
      )}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <span className="az-divider__line az-divider__line--start" aria-hidden="true" />
      <span className="az-divider__label">{children}</span>
      <span className="az-divider__line az-divider__line--end" aria-hidden="true" />
    </div>
  );
}

