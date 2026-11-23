import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import type { ValidationState } from '../../types';
import { cn } from '../../utils/cn';

export type FieldsetVariant = 'card' | 'inline';

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
  variant?: FieldsetVariant;
  helperText?: ReactNode;
  errorText?: ReactNode;
  validationState?: ValidationState;
  divided?: boolean;
  bodyClassName?: string;
}

/**
 * Reusable semantic `<fieldset>` container for grouped controls and framed inputs.
 */
export function Fieldset({
  legend,
  variant = 'card',
  helperText,
  errorText,
  validationState = 'neutral',
  divided = false,
  className,
  bodyClassName,
  children,
  ...rest
}: FieldsetProps) {
  const message = validationState === 'invalid' && errorText ? errorText : helperText;

  return (
    <div className="az-fieldset-wrap">
      <fieldset
        className={cn(
          'az-fieldset',
          `az-fieldset--${variant}`,
          validationState !== 'neutral' && `az-fieldset--${validationState}`,
          divided && 'az-fieldset--divided',
          className,
        )}
        {...rest}
      >
        {legend !== undefined && legend !== null && (
          <legend className="az-fieldset__legend">{legend}</legend>
        )}
        <div className={cn('az-fieldset__body', bodyClassName)}>{children}</div>
      </fieldset>
      {message && (
        <span
          className={cn(
            'az-fieldset__helper',
            validationState !== 'neutral' && `az-fieldset__helper--${validationState}`,
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}

