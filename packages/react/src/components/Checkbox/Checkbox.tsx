import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { AzuriteSize, AzuriteTone, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useValidatedFormField, ValidatorHint } from '../Validator/Validator';

export type CheckboxVariant = 'solid' | 'soft';
export type CheckboxTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'error' | 'success'
>;

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  size?: AzuriteSize;
  variant?: CheckboxVariant;
  tone?: CheckboxTone;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  validateOnMount?: boolean;
  autoValidate?: boolean;
  errorMessage?: ReactNode;
}

/**
 * Animated binary and tri-state checkbox with SVG vector stroke transitions,
 * 5 calibrated sizes, solid/soft tones, and form validation support.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = 'md',
    variant = 'solid',
    tone = 'primary',
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    indeterminate = false,
    label,
    description,
    disabled = false,
    required = false,
    validationState,
    defaultValidationState = 'neutral',
    validateOnMount = false,
    autoValidate = false,
    errorMessage = 'Required',
    className,
    id,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  const [isChecked, setIsChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const [internalValidation, setInternalValidation] = useState<ValidationState>(() => {
    if (!validateOnMount) return defaultValidationState;
    const initial = checked ?? defaultChecked;
    if (required) return initial ? 'valid' : 'invalid';
    return defaultValidationState;
  });

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, isChecked]);

  const validateNow = useCallback(
    (nextChecked?: boolean): boolean => {
      const target = nextChecked ?? isChecked;
      if (required && !target) {
        setInternalValidation('invalid');
        return false;
      }
      if (required && target) {
        setInternalValidation('valid');
        return true;
      }
      setInternalValidation('neutral');
      return true;
    },
    [isChecked, required],
  );

  const handleReset = useCallback(() => {
    if (checked === undefined) {
      setIsChecked(defaultChecked);
    }
    setInternalValidation('neutral');
  }, [checked, defaultChecked, setIsChecked]);

  useValidatedFormField(fieldId, () => validateNow(), handleReset);

  const effectiveValidation = validationState ?? internalValidation;
  const stateAttr = indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    setIsChecked(next);
    if (autoValidate) {
      validateNow(next);
    }
    onChange?.(event);
  };

  return (
    <div className={cn('az-cb-field', className)}>
      <label
        htmlFor={fieldId}
        data-state={stateAttr}
        className={cn(
          'az-cb-label',
          `az-cb-label--size-${size}`,
          Boolean(description) && 'az-cb-label--with-desc',
          disabled && 'az-cb-label--disabled',
        )}
      >
        <input
          ref={innerRef}
          id={fieldId}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          required={required}
          aria-checked={indeterminate ? 'mixed' : isChecked}
          aria-invalid={effectiveValidation === 'invalid' || undefined}
          onChange={handleChange}
          className="az-sr-only az-cb-input"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            'az-cb-box',
            `az-cb-box--${size}`,
            `az-cb-box--${variant}`,
            `az-cb-box--tone-${tone}`,
            effectiveValidation !== 'neutral' && `az-cb-box--${effectiveValidation}`,
          )}
        >
          <svg
            viewBox="0 0 24 24"
            shapeRendering="geometricPrecision"
            fill="none"
            className="az-cb-svg-check"
          >
            <path
              d="M5.5 12.5L9.75 16.75L18.5 7.25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="az-cb-path-check"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            shapeRendering="geometricPrecision"
            fill="none"
            className="az-cb-svg-dash"
          >
            <path
              d="M6 12H18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="az-cb-path-dash"
            />
          </svg>
        </span>

        {(label !== undefined || description !== undefined) && (
          <span className="az-cb-text">
            {label !== undefined && label !== null && (
              <span className="az-cb-title">{label}</span>
            )}
            {description !== undefined && description !== null && (
              <span className="az-cb-desc">{description}</span>
            )}
          </span>
        )}
      </label>

      {effectiveValidation === 'invalid' && (
        <ValidatorHint state="invalid" errorMessage={errorMessage} showOnlyWhenInvalid />
      )}
    </div>
  );
});

