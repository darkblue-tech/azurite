import { useId, useMemo, type ReactNode } from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { useControllableState } from '../../utils/useControllableState';
import { Fieldset } from '../Fieldset/Fieldset';
import { Radio, RadioGroupContext, type RadioTone, type RadioVariant } from './Radio';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  options?: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  legend?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  validationState?: ValidationState;
  divided?: boolean;
  size?: AzuriteSize;
  variant?: RadioVariant;
  tone?: RadioTone;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Mutually exclusive radio group supporting fieldset framing, divided rows, and controlled state.
 */
export function RadioGroup({
  name,
  options,
  value,
  defaultValue = '',
  onValueChange,
  orientation = 'vertical',
  legend,
  helperText,
  errorText,
  validationState = 'neutral',
  divided = false,
  size = 'md',
  variant = 'solid',
  tone = 'primary',
  disabled = false,
  children,
  className,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? `az-radio-${autoName}`;

  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const ctxValue = useMemo(
    () => ({
      name: groupName,
      value: selected,
      onChange: setSelected,
      size,
      variant,
      tone,
      disabled,
    }),
    [groupName, selected, setSelected, size, variant, tone, disabled],
  );

  const body = (
    <div
      role="radiogroup"
      aria-label={typeof legend === 'string' ? legend : undefined}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
        gap: orientation === 'horizontal' ? '24px' : '16px',
      }}
      className={className}
    >
      {options
        ? options.map((opt) => (
            <Radio
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              disabled={opt.disabled}
            />
          ))
        : children}
    </div>
  );

  if (legend !== undefined || divided || helperText || errorText) {
    return (
      <RadioGroupContext.Provider value={ctxValue}>
        <Fieldset
          legend={legend}
          divided={divided}
          helperText={helperText}
          errorText={errorText}
          validationState={validationState}
          disabled={disabled}
        >
          {options
            ? options.map((opt) => (
                <Radio
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  description={opt.description}
                  disabled={opt.disabled}
                />
              ))
            : children}
        </Fieldset>
      </RadioGroupContext.Provider>
    );
  }

  return <RadioGroupContext.Provider value={ctxValue}>{body}</RadioGroupContext.Provider>;
}

