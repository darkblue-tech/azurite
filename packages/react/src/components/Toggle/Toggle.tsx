import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import type { AzuriteSize, AzuriteTone, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useValidatedFormField, ValidatorHint } from '../Validator/Validator';

export type ToggleTone = Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'error' | 'success'
>;
export type ToggleState = 'on' | 'off' | 'mixed';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  size?: AzuriteSize;
  tone?: ToggleTone;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Enables controlled/fixed indeterminate state, or `triState` to cycle mixed -> on -> off. */
  indeterminate?: boolean;
  triState?: boolean;
  state?: ToggleState;
  defaultState?: ToggleState;
  onStateChange?: (state: ToggleState) => void;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  labelPosition?: 'left' | 'right';
  required?: boolean;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  validateOnMount?: boolean;
  autoValidate?: boolean;
  errorMessage?: ReactNode;
  aura?: boolean;
}

/**
 * Material 3 Expressive pill switch supporting 5 scales, 6 color tones, tri-state indeterminate mode,
 * embedded thumb icons, spring thumb kinetics, and form validation.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    size = 'md',
    tone = 'primary',
    checked,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    triState = false,
    state,
    defaultState,
    onStateChange,
    checkedIcon,
    uncheckedIcon,
    indeterminateIcon,
    label,
    description,
    labelPosition = 'right',
    disabled = false,
    required = false,
    validationState,
    defaultValidationState = 'neutral',
    validateOnMount = false,
    autoValidate = false,
    errorMessage = 'Required',
    aura = false,
    onClick,
    className,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const controlId = id ?? autoId;

  const initialTri: ToggleState =
    defaultState ?? (indeterminate ? 'mixed' : defaultChecked ? 'on' : 'off');

  const controlledTri: ToggleState | undefined =
    state ??
    (checked !== undefined ? (indeterminate ? 'mixed' : checked ? 'on' : 'off') : undefined);

  const [currentState, setCurrentState] = useControllableState<ToggleState>({
    value: controlledTri,
    defaultValue: initialTri,
    onChange: (next) => {
      onStateChange?.(next);
      onCheckedChange?.(next === 'on');
    },
  });

  const [internalValidation, setInternalValidation] = useState<ValidationState>(() => {
    if (!validateOnMount) return defaultValidationState;
    const initial = controlledTri ?? initialTri;
    if (required) return initial === 'on' ? 'valid' : 'invalid';
    return defaultValidationState;
  });

  const validateNow = useCallback(
    (nextState?: ToggleState): boolean => {
      const target = nextState ?? currentState;
      if (required && target !== 'on') {
        setInternalValidation('invalid');
        return false;
      }
      if (required && target === 'on') {
        setInternalValidation('valid');
        return true;
      }
      setInternalValidation('neutral');
      return true;
    },
    [currentState, required],
  );

  const handleReset = useCallback(() => {
    if (controlledTri === undefined) {
      setCurrentState(initialTri);
    }
    setInternalValidation('neutral');
  }, [controlledTri, initialTri, setCurrentState]);

  useValidatedFormField(controlId, () => validateNow(), handleReset);

  const effectiveValidation = validationState ?? internalValidation;
  const ariaChecked: 'true' | 'false' | 'mixed' =
    currentState === 'mixed' ? 'mixed' : currentState === 'on' ? 'true' : 'false';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    let next: ToggleState;
    if (triState) {
      const cycle: Record<ToggleState, ToggleState> = {
        mixed: 'on',
        on: 'off',
        off: 'mixed',
      };
      next = cycle[currentState];
    } else {
      next = currentState === 'on' ? 'off' : 'on';
    }
    setCurrentState(next);
    if (autoValidate) {
      validateNow(next);
    }
    onClick?.(event);
  };

  let thumbContent: ReactNode = null;
  if (currentState === 'mixed') {
    thumbContent = indeterminateIcon ?? <span className="az-toggle__dash" aria-hidden="true" />;
  } else if (currentState === 'on') {
    thumbContent = checkedIcon ?? null;
  } else {
    thumbContent = uncheckedIcon ?? null;
  }

  const switchButton = (
    <button
      ref={ref}
      id={controlId}
      type="button"
      role="switch"
      aria-checked={ariaChecked}
      aria-disabled={disabled || undefined}
      aria-invalid={effectiveValidation === 'invalid' || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'az-toggle',
        `az-toggle--${size}`,
        `az-toggle--tone-${tone}`,
        effectiveValidation !== 'neutral' && `az-toggle--${effectiveValidation}`,
        aura && 'az-aura',
        !label && !description ? className : undefined,
      )}
      {...rest}
    >
      <span className="az-toggle__thumb" aria-hidden="true">
        {thumbContent}
      </span>
    </button>
  );

  if (label === undefined && description === undefined && effectiveValidation !== 'invalid') {
    return switchButton;
  }

  return (
    <div className={cn('az-toggle-field', className)}>
      <div
        className={cn(
          'az-toggle-row',
          labelPosition === 'left' && 'az-toggle-row--left',
        )}
      >
        {switchButton}
        {(label !== undefined || description !== undefined) && (
          <div className="az-toggle-text">
            {label !== undefined && label !== null && (
              <label
                htmlFor={controlId}
                className="az-toggle-label"
                style={disabled ? { cursor: 'not-allowed', color: 'var(--az-color-on-surface-variant)' } : undefined}
              >
                {label}
              </label>
            )}
            {description !== undefined && description !== null && (
              <span className="az-toggle-desc">{description}</span>
            )}
          </div>
        )}
      </div>

      {effectiveValidation === 'invalid' && (
        <ValidatorHint state="invalid" errorMessage={errorMessage} showOnlyWhenInvalid />
      )}
    </div>
  );
});

