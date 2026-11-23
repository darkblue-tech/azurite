import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { CloseIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button/Button';
import { FieldLabel } from '../Label/Label';
import { useValidatedFormField, validateValue, ValidatorHint } from '../Validator/Validator';

export type TextareaVariant = 'default' | 'ghost';

const DEFAULT_ROWS_BY_SIZE: Record<AzuriteSize, number> = {
  xs: 2,
  sm: 3,
  md: 3,
  lg: 4,
  xl: 5,
};

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'defaultValue'> {
  /** Core bordered vs hover/focus reveal ghost surface. */
  variant?: TextareaVariant;
  /** Five density steps XS (12px) through XL (16px editorial). */
  size?: AzuriteSize;
  /** Top accessible field label. */
  label?: ReactNode;
  /** Right-aligned header tag beside label (e.g. "Required"). */
  labelHint?: ReactNode;
  /** Guidance text placed beneath the field (or validation error/success). */
  helperText?: ReactNode;
  /** Displays live character counter (`len / maxLength` or `len`). */
  showCount?: boolean;
  /** Renders a pill Clear action button in the footer bar. */
  clearable?: boolean;
  /** Optional footer actions slot beside Clear/count. */
  actions?: ReactNode;
  /** CSS resize behavior (disabled state always locks resize). */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Automatically expands height vertically to match content. */
  autoResize?: boolean;
  /** Optional AI ambient aura border glow. */
  aura?: boolean;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  validateOnMount?: boolean;
  autoValidate?: boolean;
  validate?: (value: string) => string | boolean | null | undefined;
  errorMessage?: ReactNode;
  successMessage?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Multi-line Textarea field calibrated across 5 proportional density steps,
 * Default & Ghost surfaces, live character counters, Clear utility, auto-resize,
 * and ValidatedForm integration.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant = 'default',
    size = 'md',
    label,
    labelHint,
    helperText,
    showCount = false,
    clearable = false,
    actions,
    resize = 'vertical',
    autoResize = false,
    aura = false,
    validationState,
    defaultValidationState = 'neutral',
    validateOnMount = false,
    autoValidate = false,
    validate,
    errorMessage,
    successMessage,
    value,
    defaultValue = '',
    onValueChange,
    onChange,
    onBlur,
    disabled = false,
    required,
    minLength,
    maxLength,
    rows,
    className,
    id,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const hintId = `${textareaId}-hint`;
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  const [currentValue, setCurrentValue] = useControllableState<string>({
    value: value !== undefined ? String(value) : undefined,
    defaultValue: String(defaultValue),
    onChange: onValueChange,
  });

  const [internalValidation, setInternalValidation] =
    useState<ValidationState>(() => {
      if (!validateOnMount) return defaultValidationState;
      const initialVal = String(value !== undefined ? value : defaultValue);
      if (!required && !validate && initialVal.trim() === '') return 'neutral';
      const res = validateValue(initialVal, {
        required,
        minLength,
        maxLength,
        validate,
        defaultErrorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
      });
      return res.valid ? 'valid' : 'invalid';
    });

  const [dynamicError, setDynamicError] = useState<string | undefined>(undefined);

  const runValidation = useCallback(
    (nextVal?: string, el?: HTMLTextAreaElement | null): boolean => {
      const targetVal = nextVal ?? currentValue;
      if (!required && !validate && targetVal.trim() === '') {
        setInternalValidation('neutral');
        setDynamicError(undefined);
        return true;
      }

      const result = validateValue(
        targetVal,
        {
          required,
          minLength,
          maxLength,
          validate,
          defaultErrorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
        },
        el !== undefined ? el : innerRef.current,
      );

      if (!result.valid) {
        setInternalValidation('invalid');
        setDynamicError(result.message);
        return false;
      }

      setInternalValidation('valid');
      setDynamicError(undefined);
      return true;
    },
    [currentValue, required, minLength, maxLength, validate, errorMessage],
  );

  const handleFormReset = useCallback(() => {
    if (value === undefined) setCurrentValue(String(defaultValue));
    setInternalValidation('neutral');
    setDynamicError(undefined);
  }, [value, defaultValue, setCurrentValue]);

  useValidatedFormField(textareaId, () => runValidation(), handleFormReset);

  useEffect(() => {
    if (!autoResize || !innerRef.current) return;
    const el = innerRef.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, currentValue]);

  const activeValidation = validationState ?? internalValidation;
  const effectiveError = errorMessage ?? dynamicError;
  const resolvedRows = rows ?? DEFAULT_ROWS_BY_SIZE[size];

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setCurrentValue(next);
    if (autoValidate || internalValidation !== 'neutral') {
      runValidation(next, e.currentTarget);
    }
    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    if (autoValidate) {
      runValidation(currentValue, e.currentTarget);
    }
    onBlur?.(e);
  };

  const handleClear = () => {
    if (disabled) return;
    setCurrentValue('');
    if (autoValidate) runValidation('', innerRef.current);
    innerRef.current?.focus();
  };

  const count = currentValue.length;
  const nearLimit = maxLength !== undefined && count >= maxLength * 0.9 && count < maxLength;
  const atLimit = maxLength !== undefined && count >= maxLength;

  const hasControlsFooter = showCount || clearable || Boolean(actions);
  const showInlineHelper = Boolean(helperText) && activeValidation === 'neutral';

  return (
    <div className={cn('az-textarea-field', className)}>
      {(label || labelHint) && (
        <div className="az-textarea-header">
          {label ? (
            <FieldLabel htmlFor={textareaId} size={size === 'xs' || size === 'sm' ? 'sm' : 'lg'} required={required}>
              {label}
            </FieldLabel>
          ) : (
            <span />
          )}
          {labelHint && <span className="az-textarea-hint-tag">{labelHint}</span>}
        </div>
      )}

      <div className={cn('az-textarea-shell', aura && 'az-aura')}>
        <textarea
          ref={innerRef}
          id={textareaId}
          rows={resolvedRows}
          value={currentValue}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={activeValidation === 'invalid' || undefined}
          aria-describedby={hasControlsFooter || helperText || effectiveError ? hintId : undefined}
          className={cn(
            'az-textarea',
            `az-textarea--${size}`,
            variant === 'ghost' && 'az-textarea--ghost',
            `az-textarea--resize-${autoResize ? 'none' : resize}`,
            activeValidation !== 'neutral' && `az-textarea--${activeValidation}`,
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
      </div>

      {hasControlsFooter ? (
        <div className="az-textarea-footer">
          {showInlineHelper ? (
            <span id={hintId} className="az-textarea-helper">
              {helperText}
            </span>
          ) : (
            <ValidatorHint
              id={hintId}
              state={activeValidation}
              errorMessage={effectiveError}
              validMessage={successMessage}
            />
          )}

          <div className="az-textarea-controls">
            {showCount && (
              <span
                className={cn(
                  'az-textarea-count',
                  nearLimit && 'az-textarea-count--near',
                  atLimit && 'az-textarea-count--limit',
                )}
              >
                {maxLength !== undefined ? `${count} / ${maxLength}` : count}
              </span>
            )}
            {clearable && (
              <Button
                variant="outline"
                tone="neutral"
                size="sm"
                leadingIcon={<CloseIcon size={14} />}
                disabled={disabled || count === 0}
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
            {actions}
          </div>
        </div>
      ) : (
        (helperText || effectiveError || successMessage) && (
          <ValidatorHint
            id={hintId}
            state={activeValidation}
            errorMessage={effectiveError}
            validMessage={successMessage}
            helperText={helperText}
          />
        )
      )}
    </div>
  );
});

