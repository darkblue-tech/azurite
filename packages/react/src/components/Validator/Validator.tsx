import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react';
import type { ValidationState } from '../../types';
import { cn } from '../../utils/cn';

export interface ValidatorHintProps {
  state?: ValidationState;
  errorMessage?: ReactNode;
  validMessage?: ReactNode;
  helperText?: ReactNode;
  /** When true, hides the hint unless `state === 'invalid'`. */
  showOnlyWhenInvalid?: boolean;
  id?: string;
  className?: string;
}

/**
 * Animated validation/helper message that smoothly expands and collapses below controls.
 */
export function ValidatorHint({
  state = 'neutral',
  errorMessage,
  validMessage,
  helperText,
  showOnlyWhenInvalid = false,
  id,
  className,
}: ValidatorHintProps) {
  let content: ReactNode = null;

  if (state === 'invalid' && errorMessage) {
    content = errorMessage;
  } else if (!showOnlyWhenInvalid) {
    if (state === 'valid' && validMessage) {
      content = validMessage;
    } else if (helperText) {
      content = helperText;
    }
  }

  const visible = Boolean(content);

  return (
    <div
      id={id}
      aria-live={state === 'invalid' ? 'polite' : undefined}
      className={cn(
        'az-validator-hint',
        visible && 'az-validator-hint--visible',
        state !== 'neutral' && `az-validator-hint--${state}`,
        className,
      )}
    >
      <div className="az-validator-hint__inner">{content}</div>
    </div>
  );
}

export interface ValidationRuleOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  pattern?: string;
  type?: string;
  validate?: (value: string) => string | boolean | null | undefined;
  defaultErrorMessage?: string;
}

/**
 * Evaluates a value against HTML5 constraints and an optional custom validator function.
 */
export function validateValue(
  value: string,
  rules: ValidationRuleOptions,
  nativeElement?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null,
): { valid: boolean; message?: string } {
  if (rules.validate) {
    const custom = rules.validate(value);
    if (custom === false) {
      return { valid: false, message: rules.defaultErrorMessage || 'Invalid value' };
    }
    if (typeof custom === 'string' && custom.length > 0) {
      return { valid: false, message: custom };
    }
    if (custom === true) {
      return { valid: true };
    }
  }

  const trimmed = value.trim();
  if (rules.required && trimmed === '') {
    return { valid: false, message: rules.defaultErrorMessage || 'Required' };
  }

  if (value.length > 0) {
    if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return { valid: false, message: rules.defaultErrorMessage || 'Enter valid email address' };
    }
    if (rules.type === 'url' && !/^https?:\/\/.+\..+/.test(trimmed)) {
      return { valid: false, message: rules.defaultErrorMessage || 'Must be valid URL' };
    }
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return {
        valid: false,
        message: rules.defaultErrorMessage || `Minimum ${rules.minLength} characters`,
      };
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return {
        valid: false,
        message: rules.defaultErrorMessage || `Maximum ${rules.maxLength} characters`,
      };
    }
    if (rules.pattern) {
      try {
        const regex = new RegExp(`^(?:${rules.pattern})$`);
        if (!regex.test(value)) {
          return {
            valid: false,
            message: rules.defaultErrorMessage || 'Does not match required format',
          };
        }
      } catch {
        // Defer to native element validation if pattern is not valid JS regex
      }
    }
    if (rules.type === 'number') {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { valid: false, message: rules.defaultErrorMessage || 'Enter a valid number' };
      }
      if (rules.min !== undefined && num < Number(rules.min)) {
        return {
          valid: false,
          message: rules.defaultErrorMessage || `Must be at least ${rules.min}`,
        };
      }
      if (rules.max !== undefined && num > Number(rules.max)) {
        return {
          valid: false,
          message: rules.defaultErrorMessage || `Must be at most ${rules.max}`,
        };
      }
    }
    if (rules.type === 'date') {
      if (rules.min !== undefined && value < String(rules.min)) {
        return {
          valid: false,
          message: rules.defaultErrorMessage || `Must be on or after ${rules.min}`,
        };
      }
      if (rules.max !== undefined && value > String(rules.max)) {
        return {
          valid: false,
          message: rules.defaultErrorMessage || `Must be on or before ${rules.max}`,
        };
      }
    }
  }

  if (
    nativeElement &&
    typeof nativeElement.checkValidity === 'function' &&
    nativeElement.value === value
  ) {
    const ok = nativeElement.checkValidity();
    if (!ok) {
      return {
        valid: false,
        message: rules.defaultErrorMessage || nativeElement.validationMessage || 'Invalid value',
      };
    }
  }

  return { valid: true };
}

/* Form Validation Context */
type FieldValidator = () => boolean;

interface ValidatedFormContextValue {
  registerField: (id: string, validator: FieldValidator) => () => void;
  resetToken: number;
  submitToken: number;
}

const ValidatedFormContext = createContext<ValidatedFormContextValue | null>(null);

export function useValidatedFormField(
  id: string,
  validator: FieldValidator,
  onFormReset?: () => void,
) {
  const ctx = useContext(ValidatedFormContext);
  const validatorRef = useRef(validator);
  validatorRef.current = validator;

  useEffect(() => {
    if (!ctx) return;
    return ctx.registerField(id, () => validatorRef.current());
  }, [ctx, id]);

  const initialResetRef = useRef(ctx?.resetToken ?? 0);
  useEffect(() => {
    if (!ctx) return;
    if (ctx.resetToken !== initialResetRef.current) {
      initialResetRef.current = ctx.resetToken;
      onFormReset?.();
    }
  }, [ctx?.resetToken, ctx, onFormReset]);

  return ctx;
}

export interface ValidatedFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onValidSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onInvalidSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>, isValid: boolean) => void;
}

/**
 * Form wrapper that coordinates `ValidatedForm` child fields (`Input`, `Select`, `Checkbox`, `Toggle`)
 * on submit and restores neutral state on reset.
 */
export function ValidatedForm({
  onValidSubmit,
  onInvalidSubmit,
  onSubmit,
  onReset,
  children,
  noValidate = true,
  ...rest
}: ValidatedFormProps) {
  const fieldsRef = useRef<Map<string, FieldValidator>>(new Map());
  const [resetToken, setResetToken] = useState(0);
  const [submitToken, setSubmitToken] = useState(0);

  const registerField = useCallback((id: string, validator: FieldValidator) => {
    fieldsRef.current.set(id, validator);
    return () => {
      fieldsRef.current.delete(id);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitToken((t) => t + 1);

    let allValid = true;
    fieldsRef.current.forEach((validateFn) => {
      if (!validateFn()) {
        allValid = false;
      }
    });

    if (allValid && fieldsRef.current.size === 0) {
      allValid = event.currentTarget.checkValidity();
    }

    onSubmit?.(event, allValid);
    if (allValid) {
      onValidSubmit?.(event);
    } else {
      onInvalidSubmit?.(event);
    }
  };

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    setResetToken((t) => t + 1);
    onReset?.(event);
  };

  const contextValue = useMemo(
    () => ({ registerField, resetToken, submitToken }),
    [registerField, resetToken, submitToken],
  );

  return (
    <ValidatedFormContext.Provider value={contextValue}>
      <form noValidate={noValidate} onSubmit={handleSubmit} onReset={handleReset} {...rest}>
        {children}
      </form>
    </ValidatedFormContext.Provider>
  );
}

