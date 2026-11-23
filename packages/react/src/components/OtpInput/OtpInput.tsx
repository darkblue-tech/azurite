import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useValidatedFormField, ValidatorHint } from '../Validator/Validator';

export type OtpVariant = 'joined' | 'separated';
export type OtpMode = 'numeric' | 'alphanumeric';

export interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Number of verification cells (default 6). */
  length?: number;
  /** Joined strip with internal dividers vs separated spaced cells. */
  variant?: OtpVariant;
  /** Proportional square cell sizes XS (32px) through XL (64px). */
  size?: AzuriteSize;
  /** Visual emphasis tone ('default' | 'primary'). */
  tone?: 'default' | 'primary';
  /** Controlled passcode string. */
  value?: string;
  /** Initial uncontrolled passcode string. */
  defaultValue?: string;
  /** Fires whenever passcode digits change. */
  onChange?: (value: string) => void;
  /** Fires once all `length` characters have been populated. */
  onComplete?: (value: string) => void;
  /** Accepted character set (default 'numeric'). */
  mode?: OtpMode;
  /** Masks entered digits using password bullets. */
  mask?: boolean;
  /** Empty cell placeholder glyph (default '·'). */
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  errorMessage?: ReactNode;
  validMessage?: ReactNode;
  helperText?: ReactNode;
  ariaLabel?: string;
}

function sanitizeChar(char: string, mode: OtpMode): string {
  return mode === 'numeric' ? char.replace(/\D/g, '') : char.replace(/[^0-9a-zA-Z]/g, '');
}

/**
 * One-time passcode input supporting Joined and Separated layouts, 4/6+ digit lengths,
 * 5 calibrated cell sizes (32px–64px), clipboard paste distribution, and ValidatedForm integration.
 */
export function OtpInput({
  length = 6,
  variant = 'separated',
  size = 'md',
  tone = 'default',
  value,
  defaultValue = '',
  onChange,
  onComplete,
  mode = 'numeric',
  mask = false,
  placeholder = '·',
  disabled = false,
  readOnly = false,
  required = false,
  validationState,
  defaultValidationState = 'neutral',
  errorMessage,
  validMessage,
  helperText,
  ariaLabel = 'One-time passcode',
  className,
  ...rest
}: OtpInputProps) {
  const autoId = useId();
  const hintId = `${autoId}-hint`;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [code, setCode] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });

  const [internalValidation, setInternalValidation] =
    useState<ValidationState>(defaultValidationState);

  const chars = Array.from({ length }, (_, idx) => code[idx] ?? '');

  const runValidation = useCallback((): boolean => {
    const clean = sanitizeChar(code, mode);
    if (required && clean.length < length) {
      setInternalValidation('invalid');
      return false;
    }
    if (clean.length === length) {
      setInternalValidation('valid');
      return true;
    }
    setInternalValidation('neutral');
    return true;
  }, [code, length, mode, required]);

  const handleFormReset = useCallback(() => {
    if (value === undefined) setCode(defaultValue);
    setInternalValidation('neutral');
  }, [value, defaultValue, setCode]);

  useValidatedFormField(autoId, runValidation, handleFormReset);

  const activeValidation = validationState ?? internalValidation;

  const commitChars = (nextChars: string[]) => {
    const joined = nextChars.join('').slice(0, length);
    setCode(joined);
    if (joined.length === length && nextChars.every((c) => c !== '')) {
      onComplete?.(joined);
    }
  };

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const cleaned = sanitizeChar(e.target.value, mode);
    const nextChars = [...chars];

    if (!cleaned) {
      nextChars[idx] = '';
      commitChars(nextChars);
      return;
    }

    // Handle multi-character autofill cleanly across subsequent cells
    for (let i = 0; i < cleaned.length && idx + i < length; i++) {
      nextChars[idx + i] = cleaned[i];
    }
    commitChars(nextChars);

    const nextFocus = Math.min(idx + cleaned.length, length - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    if (e.key === 'Backspace') {
      if (chars[idx]) {
        e.preventDefault();
        const nextChars = [...chars];
        nextChars[idx] = '';
        commitChars(nextChars);
      } else if (idx > 0) {
        e.preventDefault();
        const nextChars = [...chars];
        nextChars[idx - 1] = '';
        commitChars(nextChars);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      inputRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      inputRefs.current[length - 1]?.focus();
    }
  };

  const handlePaste = (idx: number, e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const raw = e.clipboardData.getData('text').trim();
    const cleaned = sanitizeChar(raw, mode);
    if (!cleaned) return;
    e.preventDefault();

    const start = cleaned.length >= length ? 0 : idx;
    const nextChars = [...chars];
    for (let i = 0; i < cleaned.length && start + i < length; i++) {
      nextChars[start + i] = cleaned[i];
    }
    commitChars(nextChars);

    const nextFocus = Math.min(start + cleaned.length, length - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const hasHint = Boolean(errorMessage || validMessage || helperText);

  return (
    <div className={cn('az-otp-field', className)} {...rest}>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-describedby={hasHint ? hintId : undefined}
        className={cn(
          'az-otp',
          `az-otp--${variant}`,
          `az-otp--${size}`,
          tone === 'primary' && 'az-otp--primary',
          activeValidation !== 'neutral' && `az-otp--${activeValidation}`,
          disabled && 'az-otp--disabled',
        )}
      >
        {chars.map((ch, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type={mask ? 'password' : 'text'}
            inputMode={mode === 'numeric' ? 'numeric' : 'text'}
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            value={ch}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={`Digit ${idx + 1}${disabled ? ' disabled' : ''}`}
            className="az-otp__cell"
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={(e) => handlePaste(idx, e)}
            onFocus={(e) => e.currentTarget.select()}
          />
        ))}
      </div>

      {hasHint && (
        <ValidatorHint
          id={hintId}
          state={activeValidation}
          errorMessage={errorMessage}
          validMessage={validMessage}
          helperText={helperText}
        />
      )}
    </div>
  );
}

