import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { CheckIcon, ChevronDownIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';

export type JointOrientation = 'horizontal' | 'vertical';
export type JointShape = 'pill' | 'rounded';
export type JointButtonTone = 'primary' | 'primary-container' | 'surface' | 'action' | 'tonal';

export interface JointProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: JointOrientation;
  shape?: JointShape;
  responsive?: boolean;
  fullWidth?: boolean;
  focusRing?: boolean;
  aura?: boolean;
}

/**
 * Unified multi-part container uniting buttons, text inputs, and custom inline selectors
 * under a single M3 Expressive outer contour with crisp 1px internal dividers.
 */
export const Joint = forwardRef<HTMLDivElement, JointProps>(function Joint(
  {
    orientation = 'horizontal',
    shape,
    responsive = false,
    fullWidth = false,
    focusRing = true,
    aura = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const resolvedShape: JointShape =
    orientation === 'vertical' ? 'rounded' : (shape ?? 'pill');

  return (
    <div
      ref={ref}
      className={cn(
        'az-joint',
        responsive ? 'az-joint--responsive' : `az-joint--${orientation}`,
        !responsive && `az-joint--${resolvedShape}`,
        fullWidth && 'az-joint--full',
        focusRing && 'az-joint--focus-ring',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface JointButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: JointButtonTone;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  mutedTrailingIcon?: boolean;
  align?: 'center' | 'between' | 'start';
}

/** Interactive button segment inside a Joint container. */
export const JointButton = forwardRef<HTMLButtonElement, JointButtonProps>(function JointButton(
  {
    selected = false,
    tone,
    leadingIcon,
    trailingIcon,
    mutedTrailingIcon = false,
    align = 'center',
    type = 'button',
    className,
    children,
    ...rest
  },
  ref,
) {
  const resolvedTone: JointButtonTone = tone ?? (selected ? 'primary' : 'surface');

  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected || undefined}
      className={cn(
        'az-joint__btn',
        `az-joint__btn--${resolvedTone}`,
        selected && 'az-joint__btn--selected',
        align !== 'center' && `az-joint__btn--${align}`,
        className,
      )}
      {...rest}
    >
      {leadingIcon && <span className="az-joint__btn-icon" aria-hidden="true">{leadingIcon}</span>}
      {children !== undefined && <span>{children}</span>}
      {trailingIcon && (
        <span
          className={cn(
            'az-joint__btn-icon',
            mutedTrailingIcon && !selected && 'az-joint__btn-icon--muted',
          )}
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
});

export interface JointInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
}

/** Borderless inline text input segment inside a Joint container. */
export const JointInput = forwardRef<HTMLInputElement, JointInputProps>(function JointInput(
  { leadingIcon, className, ...rest },
  ref,
) {
  return (
    <div className="az-joint__input-wrap">
      {leadingIcon && <span className="az-joint__input-icon" aria-hidden="true">{leadingIcon}</span>}
      <input ref={ref} className={cn('az-joint__input', className)} {...rest} />
    </div>
  );
});

export interface JointSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface JointSelectProps {
  options: JointSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
  className?: string;
  menuClassName?: string;
}

/** Styled accessible custom scope selector segment inside a Joint container. */
export const JointSelect = forwardRef<HTMLButtonElement, JointSelectProps>(function JointSelect(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Select...',
    disabled = false,
    name,
    id,
    'aria-label': ariaLabel,
    className,
    menuClassName,
  },
  forwardedRef,
) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const listboxId = `${controlId}-listbox`;
  const wrapRef = useRef<HTMLDivElement>(null);

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? options.find((o) => !o.disabled)?.value ?? '',
    onChange: onValueChange,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === selectedValue),
    ),
  );

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOutsideClick(wrapRef, closeMenu, isOpen);

  const selectedOption = options.find((o) => o.value === selectedValue);

  const moveHighlight = (delta: number) => {
    if (options.length === 0) return;
    let next = highlightedIndex;
    for (let i = 0; i < options.length; i++) {
      next = (next + delta + options.length) % options.length;
      if (!options[next]?.disabled) {
        setHighlightedIndex(next);
        break;
      }
    }
  };

  const commitOption = (opt: JointSelectOption) => {
    if (opt.disabled) return;
    setSelectedValue(opt.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setHighlightedIndex(Math.max(0, options.findIndex((o) => o.value === selectedValue)));
        setIsOpen(true);
      } else {
        moveHighlight(1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setHighlightedIndex(Math.max(0, options.findIndex((o) => o.value === selectedValue)));
        setIsOpen(true);
      } else {
        moveHighlight(-1);
      }
    } else if (e.key === 'Home' && isOpen) {
      e.preventDefault();
      const first = options.findIndex((o) => !o.disabled);
      if (first >= 0) setHighlightedIndex(first);
    } else if (e.key === 'End' && isOpen) {
      e.preventDefault();
      const rev = [...options].reverse().findIndex((o) => !o.disabled);
      if (rev >= 0) setHighlightedIndex(options.length - 1 - rev);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen) {
        const activeOpt = options[highlightedIndex];
        if (activeOpt && !activeOpt.disabled) commitOption(activeOpt);
      } else {
        setHighlightedIndex(Math.max(0, options.findIndex((o) => o.value === selectedValue)));
        setIsOpen(true);
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Tab' && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={cn('az-joint__select-wrap', className)}>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <button
        ref={forwardedRef}
        id={controlId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        className="az-joint__select-trigger"
        onClick={() => {
          if (disabled) return;
          if (!isOpen) {
            setHighlightedIndex(Math.max(0, options.findIndex((o) => o.value === selectedValue)));
          }
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="az-joint__select-chevron" aria-hidden="true">
          <ChevronDownIcon size={16} />
        </span>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn('az-joint__select-menu', menuClassName)}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === selectedValue;
            const isHighlighted = idx === highlightedIndex;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                className={cn(
                  'az-joint__select-option',
                  isHighlighted && 'az-joint__select-option--highlighted',
                )}
                onMouseEnter={() => !opt.disabled && setHighlightedIndex(idx)}
                onClick={() => commitOption(opt)}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="az-joint__select-check" aria-hidden="true">
                    <CheckIcon size={15} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<JointProps, 'children' | 'onChange'> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  align?: 'center' | 'between' | 'start';
  hoverTone?: 'surface' | 'tonal';
}

/**
 * Turnkey single-selection segmented switcher built atop Joint with arrow-key navigation.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  align,
  hoverTone = 'surface',
  className,
  ...jointProps
}: SegmentedControlProps) {
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? options.find((o) => !o.disabled)?.value ?? '',
    onChange: onValueChange,
  });

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const resolvedAlign = align ?? (orientation === 'vertical' ? 'between' : 'center');

  const moveFocus = (fromIdx: number, delta: number) => {
    const enabled = options
      .map((o, i) => ({ o, i }))
      .filter(({ o }) => !o.disabled);
    if (enabled.length === 0) return;
    const pos = enabled.findIndex(({ i }) => i === fromIdx);
    const nextPos = (pos + delta + enabled.length) % enabled.length;
    const next = enabled[nextPos];
    setSelectedValue(next.o.value);
    buttonRefs.current[next.i]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (
      (orientation === 'horizontal' && e.key === 'ArrowRight') ||
      (orientation === 'vertical' && e.key === 'ArrowDown')
    ) {
      e.preventDefault();
      moveFocus(idx, 1);
    } else if (
      (orientation === 'horizontal' && e.key === 'ArrowLeft') ||
      (orientation === 'vertical' && e.key === 'ArrowUp')
    ) {
      e.preventDefault();
      moveFocus(idx, -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = options.findIndex((o) => !o.disabled);
      if (first >= 0) {
        setSelectedValue(options[first].value);
        buttonRefs.current[first]?.focus();
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = [...options].reverse().findIndex((o) => !o.disabled);
      if (last >= 0) {
        const idxLast = options.length - 1 - last;
        setSelectedValue(options[idxLast].value);
        buttonRefs.current[idxLast]?.focus();
      }
    }
  };

  return (
    <Joint
      role="group"
      orientation={orientation}
      focusRing={false}
      className={cn('az-segmented', className)}
      {...jointProps}
    >
      {options.map((option, idx) => {
        const isSelected = selectedValue === option.value;
        return (
          <JointButton
            key={option.value}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            selected={isSelected}
            tone={isSelected ? 'primary' : hoverTone}
            disabled={option.disabled}
            leadingIcon={option.icon}
            trailingIcon={option.trailingIcon}
            mutedTrailingIcon={Boolean(option.trailingIcon)}
            align={resolvedAlign}
            onClick={() => setSelectedValue(option.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            {option.label}
          </JointButton>
        );
      })}
    </Joint>
  );
}
