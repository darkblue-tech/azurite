import type { LabelHTMLAttributes, ReactNode } from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'primary' | 'error' | 'success';
  required?: boolean;
}

/**
 * Standalone accessible form label calibrated to DESIGN.md label typography tokens.
 */
export function FieldLabel({
  size = 'md',
  tone = 'default',
  required = false,
  className,
  children,
  ...rest
}: FieldLabelProps) {
  return (
    <label
      className={cn(
        'az-field-label',
        size !== 'md' && `az-field-label--${size}`,
        tone !== 'default' && `az-field-label--${tone}`,
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {required && (
        <span className="az-field-label__req" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export type AddonTone = 'neutral' | 'primary' | 'success' | 'error';

export interface AddonGroupProps {
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  startTone?: AddonTone;
  endTone?: AddonTone;
  size?: AzuriteSize;
  validationState?: ValidationState;
  disabled?: boolean;
  aura?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Composable start-edge and end-edge label container wrapping native or custom inputs and selects.
 */
export function AddonGroup({
  startAddon,
  endAddon,
  startTone = 'neutral',
  endTone = 'neutral',
  size = 'md',
  validationState = 'neutral',
  disabled = false,
  aura = false,
  className,
  children,
}: AddonGroupProps) {
  return (
    <div
      className={cn(
        'az-addon-group',
        `az-addon-group--${size}`,
        validationState !== 'neutral' && `az-addon-group--${validationState}`,
        disabled && 'az-addon-group--disabled',
        aura && 'az-aura',
        className,
      )}
    >
      {startAddon !== undefined && startAddon !== null && (
        <span
          className={cn(
            'az-addon-group__slot az-addon-group__slot--start',
            startTone !== 'neutral' && `az-addon-group__slot--${startTone}`,
          )}
        >
          {startAddon}
        </span>
      )}
      <div className="az-addon-group__control">{children}</div>
      {endAddon !== undefined && endAddon !== null && (
        <span
          className={cn(
            'az-addon-group__slot az-addon-group__slot--end',
            endTone !== 'neutral' && `az-addon-group__slot--${endTone}`,
          )}
        >
          {endAddon}
        </span>
      )}
    </div>
  );
}

export interface FloatingLabelWrapperProps {
  label: ReactNode;
  htmlFor?: string;
  size?: AzuriteSize;
  responsive?: boolean;
  empty?: boolean;
  validationState?: ValidationState;
  className?: string;
  children: ReactNode;
}

/**
 * Floating label notch container supporting XS–XL scales and breakpoint-adaptive responsive mode.
 */
export function FloatingLabelWrapper({
  label,
  htmlFor,
  size = 'md',
  responsive = false,
  empty = false,
  validationState = 'neutral',
  className,
  children,
}: FloatingLabelWrapperProps) {
  return (
    <div
      className={cn(
        'az-float-wrap',
        `az-float-wrap--${responsive ? 'sm' : size}`,
        responsive && 'az-float-wrap--responsive',
        empty && 'az-float-wrap--empty',
        validationState !== 'neutral' && `az-float-wrap--${validationState}`,
        className,
      )}
    >
      {children}
      <label htmlFor={htmlFor} className="az-float-label">
        {label}
      </label>
    </div>
  );
}

