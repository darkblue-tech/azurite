import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { CheckIcon, ChevronDownIcon } from '../../icons';
import { Fieldset } from '../Fieldset/Fieldset';
import { AddonGroup, FieldLabel, type AddonTone } from '../Label/Label';
import { useValidatedFormField, ValidatorHint } from '../Validator/Validator';

export type SelectVariant = 'standard' | 'borderless' | 'filled' | 'fieldset';
export type SelectShape = 'pill' | 'rounded';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: SelectVariant;
  shape?: SelectShape;
  size?: AzuriteSize;
  label?: ReactNode;
  placeholder?: string;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  startAddonTone?: AddonTone;
  endAddonTone?: AddonTone;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  validationState?: ValidationState;
  defaultValidationState?: ValidationState;
  validateOnMount?: boolean;
  autoValidate?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  aura?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * Accessible custom combobox/listbox Select supporting standard, borderless, filled, and fieldset
 * variants, 5 sizes, start/end addons, keyboard navigation, and form validation.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue = '',
    onValueChange,
    variant = 'standard',
    shape = 'pill',
    size = 'md',
    label,
    placeholder = 'Choose an option...',
    startAddon,
    endAddon,
    startAddonTone = 'neutral',
    endAddonTone = 'neutral',
    helperText,
    errorMessage = 'Required',
    disabled = false,
    required = false,
    validationState,
    defaultValidationState = 'neutral',
    validateOnMount = false,
    autoValidate = false,
    open,
    defaultOpen = false,
    onOpenChange,
    aura = false,
    id,
    name,
    'aria-label': ariaLabel,
    className,
  },
  forwardedRef,
) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const labelId = `${controlId}-label`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(forwardedRef, () => triggerRef.current!);

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [highlightedIndex, setHighlightedIndex] = useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === selectedValue),
    ),
  );
  const [internalValidation, setInternalValidation] = useState<ValidationState>(() => {
    if (!validateOnMount) return defaultValidationState;
    const initial = value !== undefined ? value : defaultValue;
    if (required) return initial && initial.trim() !== '' ? 'valid' : 'invalid';
    return defaultValidationState;
  });

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useOutsideClick(wrapRef, closeMenu, isOpen);

  const validateNow = useCallback(
    (nextVal?: string): boolean => {
      const target = nextVal ?? selectedValue;
      if (required && (!target || target.trim() === '')) {
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
    [required, selectedValue],
  );

  const handleReset = useCallback(() => {
    if (value === undefined) {
      setSelectedValue(defaultValue);
    }
    setInternalValidation('neutral');
    setIsOpen(false);
  }, [value, defaultValue, setSelectedValue, setIsOpen]);

  useValidatedFormField(controlId, () => validateNow(), handleReset);

  const effectiveValidation = validationState ?? internalValidation;
  const selectedOption = options.find((o) => o.value === selectedValue);

  const selectOption = (opt: SelectOption) => {
    if (opt.disabled) return;
    setSelectedValue(opt.value);
    setIsOpen(false);
    if (autoValidate) {
      validateNow(opt.value);
    }
    triggerRef.current?.focus();
  };

  const moveHighlight = (delta: number) => {
    if (options.length === 0) return;
    let next = highlightedIndex;
    for (let i = 0; i < options.length; i += 1) {
      next = (next + delta + options.length) % options.length;
      if (!options[next].disabled) {
        setHighlightedIndex(next);
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          moveHighlight(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          moveHighlight(-1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && options[highlightedIndex] && !options[highlightedIndex].disabled) {
          selectOption(options[highlightedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 22 : 18;
  const hasAddons = startAddon !== undefined || endAddon !== undefined;

  const triggerButton = (
    <button
      ref={triggerRef}
      id={controlId}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-labelledby={label && variant !== 'fieldset' ? labelId : undefined}
      aria-label={ariaLabel}
      aria-invalid={effectiveValidation === 'invalid' || undefined}
      disabled={disabled}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      className={cn(
        'az-select-trigger',
        `az-select-trigger--${shape}`,
        `az-select-trigger--${size}`,
        `az-select-trigger--${variant}`,
        hasAddons && 'az-select-trigger--inside-addon',
        variant === 'fieldset' && 'az-select-trigger--inside-fieldset',
        effectiveValidation !== 'neutral' && `az-select-trigger--${effectiveValidation}`,
        aura && !hasAddons && variant !== 'fieldset' && 'az-aura',
      )}
    >
      <span
        className={cn(
          'az-select-value',
          !selectedOption && 'az-select-value--placeholder',
        )}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <span className="az-select-chevron" aria-hidden="true">
        <ChevronDownIcon size={iconSize} />
      </span>
    </button>
  );

  const menuNode = isOpen && !disabled && (
    <div role="listbox" className="az-select-menu">
      {options.map((opt, idx) => {
        const isSelected = opt.value === selectedValue;
        const isHighlighted = idx === highlightedIndex;
        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            disabled={opt.disabled}
            aria-selected={isSelected}
            onMouseEnter={() => setHighlightedIndex(idx)}
            onClick={() => selectOption(opt)}
            className={cn(
              'az-select-option',
              isHighlighted && 'az-select-option--highlighted',
            )}
          >
            <span>{opt.label}</span>
            {isSelected && (
              <span className="az-select-check" aria-hidden="true">
                <CheckIcon size={size === 'xs' || size === 'sm' ? 14 : 16} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={wrapRef} className={cn('az-select-field', className)}>
      {name && <input type="hidden" name={name} value={selectedValue} />}

      {variant === 'fieldset' ? (
        <div className="az-select-wrap">
          <Fieldset
            variant="inline"
            legend={label}
            validationState={effectiveValidation}
            disabled={disabled}
            className={aura ? 'az-aura' : undefined}
          >
            {triggerButton}
          </Fieldset>
          {menuNode}
        </div>
      ) : hasAddons ? (
        <>
          {label !== undefined && label !== null && (
            <FieldLabel id={labelId} htmlFor={controlId} required={required}>
              {label}
            </FieldLabel>
          )}
          <div className="az-select-wrap">
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
              {triggerButton}
            </AddonGroup>
            {menuNode}
          </div>
        </>
      ) : (
        <>
          {label !== undefined && label !== null && (
            <FieldLabel id={labelId} htmlFor={controlId} required={required}>
              {label}
            </FieldLabel>
          )}
          <div className="az-select-wrap">
            {triggerButton}
            {menuNode}
          </div>
        </>
      )}

      <ValidatorHint
        state={effectiveValidation}
        errorMessage={errorMessage}
        helperText={helperText}
      />
    </div>
  );
});

