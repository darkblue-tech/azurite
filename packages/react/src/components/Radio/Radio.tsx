import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';

export type RadioVariant = 'solid' | 'soft';
export type RadioTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'error' | 'success'
>;

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  size: AzuriteSize;
  variant: RadioVariant;
  tone: RadioTone;
  disabled: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> {
  value?: string;
  size?: AzuriteSize;
  variant?: RadioVariant;
  tone?: RadioTone;
  label?: ReactNode;
  description?: ReactNode;
}

/**
 * Single-selection circular radio control with spring-press ring and animated inner dot.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    size,
    variant,
    tone,
    label,
    description,
    checked,
    disabled,
    name,
    onChange,
    className,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const group = useContext(RadioGroupContext);

  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedVariant = variant ?? group?.variant ?? 'solid';
  const resolvedTone = tone ?? group?.tone ?? 'primary';
  const resolvedDisabled = disabled ?? group?.disabled ?? false;
  const resolvedName = name ?? group?.name;
  const isSelected =
    group && value !== undefined ? group.value === value : Boolean(checked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (group && value !== undefined && event.target.checked) {
      group.onChange(value);
    }
    onChange?.(event);
  };

  return (
    <label
      htmlFor={fieldId}
      data-state={isSelected ? 'selected' : 'unselected'}
      className={cn(
        'az-rb-label',
        `az-rb-label--size-${resolvedSize}`,
        Boolean(description) && 'az-rb-label--with-desc',
        resolvedDisabled && 'az-rb-label--disabled',
        className,
      )}
    >
      <input
        ref={ref}
        id={fieldId}
        type="radio"
        name={resolvedName}
        value={value}
        checked={group && value !== undefined ? isSelected : checked}
        disabled={resolvedDisabled}
        onChange={handleChange}
        className="az-sr-only az-rb-input"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          'az-rb-ring',
          `az-rb-ring--${resolvedSize}`,
          `az-rb-ring--${resolvedVariant}`,
          `az-rb-ring--tone-${resolvedTone}`,
        )}
      >
        <span className="az-rb-dot" />
      </span>

      {(label !== undefined || description !== undefined) && (
        <span className="az-rb-text">
          {label !== undefined && label !== null && <span className="az-rb-title">{label}</span>}
          {description !== undefined && description !== null && (
            <span className="az-rb-desc">{description}</span>
          )}
        </span>
      )}
    </label>
  );
});

