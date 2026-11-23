import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { CheckIcon, CloseIcon, EyeIcon, EyeOffIcon } from '../../icons';
import { Fieldset } from '../Fieldset/Fieldset';
import { AddonGroup, FieldLabel, FloatingLabelWrapper, type AddonTone } from '../Label/Label';
import { useValidatedFormField, validateValue, ValidatorHint } from '../Validator/Validator';

export type InputVariant = 'standard' | 'ghost' | 'fieldset' | 'floating' | 'pill';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  variant?: InputVariant;
  size?: AzuriteSize;
  responsive?: boolean;
  label?: ReactNode;
  inlineLabel?: ReactNode;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  startAddonTone?: AddonTone;
  endAddonTone?: AddonTone;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  actionButton?: ReactNode;
  passwordToggle?: boolean;
  clearable?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  validateOnMount?: boolean;
  autoValidate?: boolean;
  validate?: (value: string) => string | boolean | null | undefined;
  showValidationIcon?: boolean;
  errorMessage?: ReactNode;
  successMessage?: ReactNode;
  helperText?: ReactNode;
  hintMode?: 'always' | 'invalid-only';
  aura?: boolean;
  onValueChange?: (value: string) => void;
}

/**
 * Full-featured Azurite text input supporting standard, ghost, fieldset, floating, and pill variants,
 * start/end addons, joined action buttons, password visibility toggle, autocomplete suggestions,
 * AI ambient aura, and built-in constraint validation.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'standard',
    size = 'md',
    responsive = false,
    label,
    inlineLabel,
    startAddon,
    endAddon,
    startAddonTone = 'neutral',
    endAddonTone = 'neutral',
    leadingIcon,
    trailingIcon,
    prefix,
    suffix,
    actionButton,
    passwordToggle = false,
    clearable = false,
    suggestions,
    onSuggestionSelect,
    validationState,
    defaultValidationState = 'neutral',
    validateOnMount = false,
    autoValidate = false,
    validate,
    showValidationIcon = false,
    errorMessage,
    successMessage,
    helperText,
    hintMode = 'always',
    aura = false,
    value,
    defaultValue = '',
    onValueChange,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    type = 'text',
    disabled = false,
    required,
    minLength,
    maxLength,
    min,
    max,
    pattern,
    placeholder,
    className,
    id,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const fieldWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current!);

  const [currentValue, setCurrentValue] = useControllableState<string>({
    value: value !== undefined ? String(value) : undefined,
    defaultValue: String(defaultValue),
    onChange: onValueChange,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [internalValidation, setInternalValidation] = useState<ValidationState>(() => {
    if (!validateOnMount) return defaultValidationState;
    const initialVal = String(value !== undefined ? value : defaultValue);
    if (!required && !validate && initialVal.trim() === '') return 'neutral';
    const initialRes = validateValue(initialVal, {
      required,
      minLength,
      maxLength,
      min,
      max,
      pattern,
      type,
      validate,
      defaultErrorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
    });
    return initialRes.valid ? 'valid' : 'invalid';
  });
  const [dynamicError, setDynamicError] = useState<string | undefined>(() => {
    if (!validateOnMount) return undefined;
    const initialVal = String(value !== undefined ? value : defaultValue);
    if (!required && !validate && initialVal.trim() === '') return undefined;
    const initialRes = validateValue(initialVal, {
      required,
      minLength,
      maxLength,
      min,
      max,
      pattern,
      type,
      validate,
      defaultErrorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
    });
    return initialRes.valid ? undefined : initialRes.message;
  });

  useOutsideClick(fieldWrapRef, () => setSuggestionsOpen(false), suggestionsOpen);

  const filteredSuggestions = useMemo(() => {
    if (!suggestions || suggestions.length === 0) return [];
    const q = currentValue.trim().toLowerCase();
    if (!q) return suggestions;
    const matches = suggestions.filter((s) => s.toLowerCase().includes(q));
    return matches.length > 0 ? matches : suggestions;
  }, [suggestions, currentValue]);

  const runValidation = useCallback(
    (nextVal?: string, nativeEl?: HTMLInputElement | null): boolean => {
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
          min,
          max,
          pattern,
          type,
          validate,
          defaultErrorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
        },
        nativeEl !== undefined ? nativeEl : inputRef.current,
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
    [currentValue, required, minLength, maxLength, min, max, pattern, type, validate, errorMessage],
  );

  const handleFormReset = useCallback(() => {
    if (value === undefined) {
      setCurrentValue(String(defaultValue));
    }
    setInternalValidation('neutral');
    setDynamicError(undefined);
    setSuggestionsOpen(false);
  }, [value, defaultValue, setCurrentValue]);

  useValidatedFormField(inputId, () => runValidation(), handleFormReset);

  const effectiveValidation = validationState ?? internalValidation;
  const effectiveErrorMessage = errorMessage ?? dynamicError;
  const resolvedType = passwordToggle && type === 'password' && showPassword ? 'text' : type;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setCurrentValue(next);
    if (suggestions && suggestions.length > 0) {
      setSuggestionsOpen(true);
      setActiveIndex(-1);
    }
    if (autoValidate) {
      runValidation(next, event.currentTarget);
    }
    onChange?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (suggestions && suggestions.length > 0) {
      setSuggestionsOpen(true);
    }
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (autoValidate) {
      runValidation(event.target.value, event.currentTarget);
    }
    onBlur?.(event);
  };

  const selectSuggestion = (item: string) => {
    setCurrentValue(item);
    setSuggestionsOpen(false);
    setActiveIndex(-1);
    onSuggestionSelect?.(item);
    if (autoValidate) {
      runValidation(item, null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions && filteredSuggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSuggestionsOpen(true);
        setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSuggestionsOpen(true);
        setActiveIndex((prev) =>
          prev <= 0 ? filteredSuggestions.length - 1 : prev - 1,
        );
      } else if (event.key === 'Enter' && suggestionsOpen && activeIndex >= 0) {
        event.preventDefault();
        selectSuggestion(filteredSuggestions[activeIndex]);
      } else if (event.key === 'Escape') {
        setSuggestionsOpen(false);
      }
    }
    onKeyDown?.(event);
  };

  const inputElement = (
    <input
      ref={inputRef}
      id={inputId}
      type={resolvedType}
      value={currentValue}
      disabled={disabled}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      min={min}
      max={max}
      pattern={pattern}
      placeholder={variant === 'floating' ? placeholder ?? ' ' : placeholder}
      aria-invalid={effectiveValidation === 'invalid' || undefined}
      aria-expanded={suggestions ? suggestionsOpen : undefined}
      aria-autocomplete={suggestions ? 'list' : undefined}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="az-input-el"
      {...rest}
    />
  );

  const rightControls = (
    <>
      {clearable && currentValue.length > 0 && !disabled && (
        <button
          type="button"
          aria-label="Clear input"
          onClick={() => {
            setCurrentValue('');
            inputRef.current?.focus();
          }}
          className="az-input__icon-btn"
        >
          <CloseIcon size={14} />
        </button>
      )}
      {showValidationIcon && effectiveValidation === 'valid' && (
        <span className="az-input__icon az-input__icon--valid" aria-hidden="true">
          <CheckIcon size={16} />
        </span>
      )}
      {passwordToggle && type === 'password' && (
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((prev) => !prev)}
          className="az-input__icon-btn"
        >
          {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      )}
      {trailingIcon && <span className="az-input__icon">{trailingIcon}</span>}
      {suffix && <span className="az-input__suffix">{suffix}</span>}
      {actionButton && <div className="az-input__joined-action">{actionButton}</div>}
    </>
  );

  let controlNode: ReactNode;

  if (variant === 'fieldset') {
    controlNode = (
      <Fieldset
        variant="inline"
        legend={label}
        validationState={effectiveValidation}
        disabled={disabled}
        className={aura ? 'az-aura' : undefined}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '24px',
          }}
        >
          {inlineLabel !== undefined && (
            <>
              <span className="az-input__inline-label">{inlineLabel}</span>
              <span className="az-input__inline-divider" aria-hidden="true" />
            </>
          )}
          {leadingIcon && <span className="az-input__icon">{leadingIcon}</span>}
          {prefix && <span className="az-input__prefix">{prefix}</span>}
          {inputElement}
          {rightControls}
        </div>
      </Fieldset>
    );
  } else if (startAddon !== undefined || endAddon !== undefined) {
    controlNode = (
      <>
        {label !== undefined && label !== null && (
          <FieldLabel htmlFor={inputId} required={required} tone={disabled ? 'muted' : 'default'}>
            {label}
          </FieldLabel>
        )}
        <AddonGroup
          startAddon={startAddon}
          endAddon={endAddon}
          startTone={startAddonTone}
          endTone={endAddonTone}
          size={size}
          validationState={effectiveValidation}
          disabled={disabled}
          aura={aura}
        >
          {inputElement}
        </AddonGroup>
      </>
    );
  } else {
    const shell = (
      <div
        className={cn(
          'az-input-shell',
          responsive ? 'az-input-shell--responsive' : `az-input-shell--${size}`,
          variant === 'ghost' && 'az-input-shell--ghost',
          variant === 'pill' && 'az-input-shell--pill',
          Boolean(actionButton) && 'az-input-shell--has-action',
          effectiveValidation !== 'neutral' && `az-input-shell--${effectiveValidation}`,
          disabled && 'az-input-shell--disabled',
          aura && 'az-aura',
        )}
      >
        {leadingIcon && (
          <span
            className={cn(
              'az-input__icon',
              effectiveValidation === 'invalid' && 'az-input__icon--invalid',
              effectiveValidation === 'valid' && 'az-input__icon--valid',
            )}
          >
            {leadingIcon}
          </span>
        )}
        {prefix && <span className="az-input__prefix">{prefix}</span>}
        {inputElement}
        {rightControls}
      </div>
    );

    if (variant === 'floating' && label !== undefined) {
      controlNode = (
        <FloatingLabelWrapper
          label={label}
          htmlFor={inputId}
          size={size}
          responsive={responsive}
          empty={currentValue.length === 0}
          validationState={effectiveValidation}
        >
          {shell}
        </FloatingLabelWrapper>
      );
    } else {
      controlNode = (
        <>
          {label !== undefined && label !== null && (
            <FieldLabel htmlFor={inputId} required={required} tone={disabled ? 'muted' : 'default'}>
              {label}
            </FieldLabel>
          )}
          {shell}
        </>
      );
    }
  }

  return (
    <div ref={fieldWrapRef} className={cn('az-input-field', className)}>
      {controlNode}

      {suggestions && suggestionsOpen && filteredSuggestions.length > 0 && (
        <div role="listbox" aria-label="Autocomplete suggestions" className="az-input-suggestions">
          {filteredSuggestions.map((item, idx) => {
            const isSelected = item === currentValue;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(item);
                }}
                className={cn(
                  'az-input-suggestion',
                  isSelected && 'az-input-suggestion--selected',
                  isActive && 'az-input-suggestion--active',
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      <ValidatorHint
        state={effectiveValidation}
        errorMessage={effectiveErrorMessage}
        validMessage={successMessage}
        helperText={helperText}
        showOnlyWhenInvalid={hintMode === 'invalid-only'}
      />
    </div>
  );
});

