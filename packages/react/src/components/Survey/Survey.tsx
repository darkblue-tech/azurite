import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowBackIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  ErrorIcon,
  MailIcon,
  StarIcon,
  XCircleIcon,
} from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button/Button';
import { Select, type SelectOption } from '../Select/Select';

/* ============================================================================
 * 1. SurveyChoiceQuestion — Single/Multiple Choice Cards, Custom "Other",
 *    Feedback States (Correct/Incorrect), Visual State Matrix & Compact Lists
 * ============================================================================ */

export interface SurveyOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  status?: 'correct' | 'incorrect';
  visualState?: 'default' | 'hover' | 'focused' | 'selected';
  allowCustomInput?: boolean;
  customRequired?: boolean;
  customPlaceholder?: string;
  customAriaLabel?: string;
}

export interface SurveyChoiceQuestionProps
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  mode?: 'single' | 'multiple';
  variant?: 'cards' | 'list';
  surface?: 'low' | 'surface';
  question?: ReactNode;
  required?: boolean;
  options: SurveyOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (next: string | string[]) => void;
  customValue?: string;
  defaultCustomValue?: string;
  onCustomValueChange?: (val: string) => void;
  customError?: ReactNode;
  error?: ReactNode;
  readOnly?: boolean;
  name?: string;
}

export function SurveyChoiceQuestion({
  mode = 'single',
  variant = 'cards',
  surface = 'low',
  question,
  required = false,
  options,
  value,
  defaultValue,
  onChange,
  customValue,
  defaultCustomValue = '',
  onCustomValueChange,
  customError,
  error,
  readOnly = false,
  name,
  className,
  ...rest
}: SurveyChoiceQuestionProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const customErrorId = useId();
  const listErrorId = useId();

  const [selected, setSelected] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (mode === 'multiple' ? [] : ''),
    onChange,
  });

  const [customText, setCustomText] = useControllableState<string>({
    value: customValue,
    defaultValue: defaultCustomValue,
    onChange: onCustomValueChange,
  });

  const isSelected = (optValue: string): boolean => {
    if (mode === 'multiple') {
      return Array.isArray(selected) ? selected.includes(optValue) : false;
    }
    return selected === optValue;
  };

  const toggleOption = (opt: SurveyOption) => {
    if (readOnly || opt.disabled) return;
    if (mode === 'single') {
      setSelected(opt.value);
      return;
    }
    const prev = Array.isArray(selected) ? selected : [];
    const exists = prev.includes(opt.value);
    const next = exists ? prev.filter((v) => v !== opt.value) : [...prev, opt.value];
    setSelected(next);
  };

  return (
    <fieldset className={cn('az-survey-fieldset', className)} {...rest}>
      {question !== undefined && (
        <legend className="az-survey-legend">
          {question}
          {required && (
            <>
              {' '}
              <span className="az-survey-required" aria-hidden="true">
                *
              </span>
            </>
          )}
        </legend>
      )}

      {variant === 'list' ? (
        <div className="az-survey-list">
          {options.map((opt) => {
            const checked = opt.visualState === 'selected' ? true : isSelected(opt.value);
            return (
              <label key={opt.value} className="az-survey-list__item">
                <input
                  type={mode === 'multiple' ? 'checkbox' : 'radio'}
                  name={mode === 'single' ? groupName : undefined}
                  value={opt.value}
                  checked={checked}
                  disabled={opt.disabled}
                  readOnly={readOnly}
                  onChange={() => toggleOption(opt)}
                  className="az-survey__native-input"
                />
                <span
                  className={cn(
                    'az-survey-control',
                    mode === 'multiple' ? 'az-survey-control--checkbox' : 'az-survey-control--radio',
                    checked && 'is-checked',
                  )}
                  aria-hidden="true"
                >
                  {mode === 'multiple' ? (
                    <span className="az-survey-control__check">
                      <CheckIcon size={12} />
                    </span>
                  ) : (
                    <span className="az-survey-control__dot" />
                  )}
                </span>
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div
          className="az-survey-options"
          aria-describedby={error ? listErrorId : undefined}
        >
          {options.map((opt) => {
            const isFeedbackChecked = readOnly && (opt.status === 'correct' || opt.status === 'incorrect');
            const checked = opt.visualState === 'selected' || isFeedbackChecked ? true : isSelected(opt.value);
            const showCorrect = opt.status === 'correct';
            const showIncorrect = opt.status === 'incorrect';
            const activeSelected =
              !showCorrect && !showIncorrect && (checked || opt.visualState === 'selected');
            const isErrorBorder =
              !showCorrect && !activeSelected && (showIncorrect || Boolean(error));

            const showCustomBox = Boolean(opt.allowCustomInput && checked);
            const effectiveCustomErr =
              customError !== undefined
                ? customError
                : opt.customRequired && customText.trim() === ''
                  ? 'Please specify an option.'
                  : undefined;

            return (
              <div
                key={opt.value}
                className={cn(
                  'az-survey-option',
                  surface === 'surface' && 'az-survey-option--surface',
                  activeSelected && 'az-survey-option--selected',
                  showCorrect && 'az-survey-option--correct',
                  showIncorrect && 'az-survey-option--incorrect',
                  isErrorBorder && !showIncorrect && 'az-survey-option--error',
                  (readOnly || Boolean(opt.visualState)) && 'az-survey-option--readonly',
                  opt.disabled && 'az-survey-option--disabled',
                  opt.visualState && `az-survey-option--state-${opt.visualState}`,
                )}
              >
                <label className="az-survey-option__row">
                  <span className="az-survey-option__main">
                    <input
                      type={mode === 'multiple' ? 'checkbox' : 'radio'}
                      name={mode === 'single' ? `${groupName}-${opt.status ?? 'choice'}` : undefined}
                      value={opt.value}
                      checked={checked}
                      disabled={opt.disabled}
                      readOnly={readOnly || Boolean(opt.visualState)}
                      onChange={() => toggleOption(opt)}
                      className="az-survey__native-input"
                    />
                    <span
                      className={cn(
                        'az-survey-control',
                        mode === 'multiple'
                          ? 'az-survey-control--checkbox'
                          : 'az-survey-control--radio',
                        checked && 'is-checked',
                        (showIncorrect || Boolean(error)) && 'is-error',
                      )}
                      aria-hidden="true"
                    >
                      {mode === 'multiple' ? (
                        <span className="az-survey-control__check">
                          <CheckIcon size={12} />
                        </span>
                      ) : (
                        <span className="az-survey-control__dot" />
                      )}
                    </span>
                    <span className="az-survey-option__label">{opt.label}</span>
                  </span>

                  {showCorrect && (
                    <CheckCircleIcon
                      size={20}
                      style={{ color: 'var(--az-color-primary)', flexShrink: 0 }}
                    />
                  )}
                  {showIncorrect && (
                    <XCircleIcon
                      size={20}
                      style={{ color: 'var(--az-color-error)', flexShrink: 0 }}
                    />
                  )}
                </label>

                {showCustomBox && (
                  <div className="az-survey-option__custom">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder={opt.customPlaceholder ?? 'Specify...'}
                      aria-label={opt.customAriaLabel ?? 'Specify custom option'}
                      aria-invalid={Boolean(effectiveCustomErr) || undefined}
                      aria-describedby={effectiveCustomErr ? customErrorId : undefined}
                      className={cn(
                        'az-survey-option__custom-input',
                        Boolean(effectiveCustomErr) && 'az-survey-option__custom-input--error',
                      )}
                    />
                    {effectiveCustomErr && (
                      <div id={customErrorId} className="az-survey-error-msg">
                        <ErrorIcon size={16} />
                        <span>{effectiveCustomErr}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div id={listErrorId} className="az-survey-error-msg">
          <ErrorIcon size={16} />
          <span>{error}</span>
        </div>
      )}
    </fieldset>
  );
}

/* ============================================================================
 * 2. SurveyMatrix — Radio Grid & Checkbox Grid
 * ============================================================================ */

export interface SurveyMatrixColumn {
  id: string;
  label: ReactNode;
}

export interface SurveyMatrixRow {
  id: string;
  label: ReactNode;
}

export interface SurveyMatrixBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  question?: ReactNode;
  required?: boolean;
  rowHeaderLabel: ReactNode;
  columns: SurveyMatrixColumn[];
  rows: SurveyMatrixRow[];
}

export interface SurveyMatrixRadioProps extends SurveyMatrixBaseProps {
  mode: 'radio';
  value?: Record<string, string>;
  defaultValue?: Record<string, string>;
  onChange?: (next: Record<string, string>) => void;
}

export interface SurveyMatrixCheckboxProps extends SurveyMatrixBaseProps {
  mode: 'checkbox';
  value?: Record<string, string[]>;
  defaultValue?: Record<string, string[]>;
  onChange?: (next: Record<string, string[]>) => void;
}

export type SurveyMatrixProps = SurveyMatrixRadioProps | SurveyMatrixCheckboxProps;

export function SurveyMatrix(props: SurveyMatrixProps) {
  const {
    mode,
    question,
    required = false,
    rowHeaderLabel,
    columns,
    rows,
    value,
    defaultValue,
    onChange,
    className,
    ...rest
  } = props;

  const baseId = useId();
  const [radioState, setRadioState] = useControllableState<Record<string, string>>({
    value: mode === 'radio' ? (value as Record<string, string> | undefined) : undefined,
    defaultValue: mode === 'radio' ? ((defaultValue as Record<string, string> | undefined) ?? {}) : {},
    onChange: mode === 'radio' ? (onChange as ((next: Record<string, string>) => void) | undefined) : undefined,
  });

  const [checkState, setCheckState] = useControllableState<Record<string, string[]>>({
    value: mode === 'checkbox' ? (value as Record<string, string[]> | undefined) : undefined,
    defaultValue: mode === 'checkbox' ? ((defaultValue as Record<string, string[]> | undefined) ?? {}) : {},
    onChange: mode === 'checkbox' ? (onChange as ((next: Record<string, string[]>) => void) | undefined) : undefined,
  });

  const handleCellToggle = (rowId: string, colId: string) => {
    if (mode === 'radio') {
      setRadioState((prev) => ({ ...prev, [rowId]: colId }));
    } else {
      setCheckState((prev) => {
        const current = prev[rowId] ?? [];
        const exists = current.includes(colId);
        return {
          ...prev,
          [rowId]: exists ? current.filter((c) => c !== colId) : [...current, colId],
        };
      });
    }
  };

  return (
    <div className={cn('az-survey-matrix', className)} {...rest}>
      {question !== undefined && (
        <div className="az-survey-legend">
          {question}
          {required && (
            <>
              {' '}
              <span className="az-survey-required" aria-hidden="true">
                *
              </span>
            </>
          )}
        </div>
      )}

      <div className="az-survey-matrix__wrap">
        <table className="az-survey-matrix__table">
          <thead>
            <tr>
              <th className="az-survey-matrix__th">{rowHeaderLabel}</th>
              {columns.map((col) => (
                <th key={col.id} className="az-survey-matrix__th az-survey-matrix__th--col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="az-survey-matrix__row">
                <td className="az-survey-matrix__row-label">{row.label}</td>
                {columns.map((col) => {
                  const checked =
                    mode === 'radio'
                      ? radioState[row.id] === col.id
                      : (checkState[row.id] ?? []).includes(col.id);
                  const ariaLabel = `${typeof row.label === 'string' ? row.label : row.id} ${typeof col.label === 'string' ? col.label : col.id}`;

                  return (
                    <td key={col.id} className="az-survey-matrix__cell">
                      <label className="az-survey-matrix__cell-label">
                        <input
                          type={mode === 'radio' ? 'radio' : 'checkbox'}
                          name={mode === 'radio' ? `${baseId}-${row.id}` : undefined}
                          aria-label={ariaLabel}
                          checked={checked}
                          onChange={() => handleCellToggle(row.id, col.id)}
                          className="az-survey__native-input"
                        />
                        <span
                          className={cn(
                            'az-survey-control',
                            mode === 'checkbox'
                              ? 'az-survey-control--checkbox'
                              : 'az-survey-control--radio',
                            checked && 'is-checked',
                          )}
                          aria-hidden="true"
                        >
                          {mode === 'checkbox' ? (
                            <span className="az-survey-control__check">
                              <CheckIcon size={12} />
                            </span>
                          ) : (
                            <span className="az-survey-control__dot" />
                          )}
                        </span>
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. SurveyScale — Linear Scale 1..N Tile Selector
 * ============================================================================ */

export interface SurveyScaleProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  question?: ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  name?: string;
}

export function SurveyScale({
  question,
  required = false,
  min = 1,
  max = 5,
  minLabel,
  maxLabel,
  value,
  defaultValue,
  onChange,
  name,
  className,
  ...rest
}: SurveyScaleProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const [selected, setSelected] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? -1,
    onChange,
  });

  const steps: number[] = [];
  for (let i = min; i <= max; i++) {
    steps.push(i);
  }

  return (
    <fieldset className={cn('az-survey-fieldset', className)} {...rest}>
      {question !== undefined && (
        <legend className="az-survey-legend">
          {question}
          {required && (
            <>
              {' '}
              <span className="az-survey-required" aria-hidden="true">
                *
              </span>
            </>
          )}
        </legend>
      )}

      <div className="az-survey-scale">
        <div
          className="az-survey-scale__grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step) => {
            const active = selected === step;
            return (
              <label
                key={step}
                className={cn('az-survey-scale__tile', active && 'is-selected')}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={step}
                  checked={active}
                  onChange={() => setSelected(step)}
                  className="az-survey__native-input"
                />
                <span>{step}</span>
              </label>
            );
          })}
        </div>

        {(minLabel !== undefined || maxLabel !== undefined) && (
          <div className="az-survey-scale__labels">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        )}
      </div>
    </fieldset>
  );
}

/* ============================================================================
 * 4. SurveyRating — Interactive Star Tile Rating
 * ============================================================================ */

export interface SurveyRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  question?: ReactNode;
  required?: boolean;
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
}

export function SurveyRating({
  question,
  required = false,
  max = 5,
  value,
  defaultValue = 0,
  onChange,
  className,
  ...rest
}: SurveyRatingProps) {
  const [rating, setRating] = useControllableState<number>({
    value,
    defaultValue,
    onChange,
  });
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? rating;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setRating(Math.min(max, rating + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setRating(Math.max(1, rating - 1));
    }
  };

  return (
    <div className={cn('az-survey-fieldset', className)} {...rest}>
      {question !== undefined && (
        <div className="az-survey-legend">
          {question}
          {required && (
            <>
              {' '}
              <span className="az-survey-required" aria-hidden="true">
                *
              </span>
            </>
          )}
        </div>
      )}

      <div
        className="az-survey-rating-row"
        role="radiogroup"
        aria-label={typeof question === 'string' ? question : 'Star rating'}
        onMouseLeave={() => setHovered(null)}
        onKeyDown={handleKeyDown}
      >
        {Array.from({ length: max }, (_, idx) => {
          const star = idx + 1;
          const active = star <= displayValue;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => setRating(star)}
              className={cn('az-survey-star-btn', active && 'is-active')}
            >
              <StarIcon size={22} filled={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. SurveyField — Date, Date-Time, Dropdown (Azurite Select), Number, Email,
 *    Long Text & Live Validation Errors
 * ============================================================================ */

export interface SurveyFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select';
  label: ReactNode;
  labelVariant?: 'title' | 'label';
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  leadingIcon?: ReactNode | null;
  options?: SelectOption[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  compactWidth?: boolean;
  error?: ReactNode;
  validate?: (value: string) => string | null;
  validateOnMount?: boolean;
}

export function SurveyField({
  type,
  label,
  labelVariant = 'title',
  required = false,
  value,
  defaultValue = '',
  onChange,
  placeholder,
  leadingIcon,
  options = [],
  rows = 4,
  min,
  max,
  step,
  compactWidth,
  error,
  validate,
  validateOnMount = false,
  className,
  ...rest
}: SurveyFieldProps) {
  const inputId = useId();
  const errorId = useId();

  const [currentVal, setCurrentVal] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });

  const [touched, setTouched] = useState(validateOnMount);

  const handleChange = (next: string) => {
    if (!touched) setTouched(true);
    setCurrentVal(next);
  };

  const liveError = validate && (touched || validateOnMount) ? validate(currentVal) : null;
  const activeError = error !== undefined ? error : liveError;
  const hasError = Boolean(activeError);

  const resolvedIcon =
    leadingIcon === null
      ? null
      : leadingIcon ?? (type === 'email' ? <MailIcon size={20} /> : null);

  const isCompact = compactWidth ?? type === 'number';
  const isTabular = type === 'number' || type === 'date' || type === 'datetime-local';

  return (
    <div className={cn('az-survey-field', className)} {...rest}>
      <label
        htmlFor={type === 'select' ? undefined : inputId}
        className={
          labelVariant === 'label'
            ? 'az-survey-field__label--label'
            : 'az-survey-field__label--title'
        }
      >
        {label}
        {required && (
          <>
            {' '}
            <span className="az-survey-required" aria-hidden="true">
              *
            </span>
          </>
        )}
      </label>

      {type === 'select' ? (
        <Select
          options={options}
          value={currentVal}
          onValueChange={handleChange}
          shape="rounded"
          variant="filled"
          size="lg"
          placeholder={placeholder}
          aria-label={typeof label === 'string' ? label : undefined}
          validationState={hasError ? 'invalid' : undefined}
          errorMessage={hasError ? activeError : undefined}
        />
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          rows={rows}
          value={currentVal}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            'az-survey-field__textarea',
            hasError && 'az-survey-field__textarea--error',
          )}
        />
      ) : (
        <div
          className={cn(
            'az-survey-field__control-wrap',
            isCompact && 'az-survey-field__control-wrap--compact',
          )}
        >
          {resolvedIcon && (
            <span
              className={cn(
                'az-survey-field__leading',
                hasError && 'az-survey-field__leading--error',
              )}
              aria-hidden="true"
            >
              {resolvedIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            value={currentVal}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            onChange={(e) => handleChange(e.target.value)}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={cn(
              'az-survey-field__input',
              Boolean(resolvedIcon) && 'az-survey-field__input--with-icon',
              isTabular && 'az-survey-field__input--tabular',
              hasError && 'az-survey-field__input--error',
            )}
          />
        </div>
      )}

      {type !== 'select' && hasError && (
        <div id={errorId} className="az-survey-error-msg">
          <ErrorIcon size={16} />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 6. SurveyProgress — Counter & Segmented Progress Indicators
 * ============================================================================ */

export interface SurveyProgressProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'counter' | 'segmented';
  current: number;
  total: number;
  prompt?: ReactNode;
  label?: ReactNode;
  showPercent?: boolean;
  bare?: boolean;
}

export function SurveyProgress({
  variant = 'counter',
  current,
  total,
  prompt,
  label,
  showPercent = true,
  bare = false,
  className,
  ...rest
}: SurveyProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.max(0, Math.min(safeTotal, current));
  const pct = Math.round((safeCurrent / safeTotal) * 100);
  const resolvedLabel = label ?? `Question ${safeCurrent} of ${safeTotal}`;

  return (
    <div
      className={cn('az-survey-progress', bare && 'az-survey-progress--bare', className)}
      {...rest}
    >
      {variant === 'counter' ? (
        <div className="az-survey-progress__meta">
          <span className="az-survey-progress__step">{resolvedLabel}</span>
          {showPercent && <span className="az-survey-progress__pct">{pct}%</span>}
        </div>
      ) : (
        <div
          className="az-survey-progress__segments"
          style={{ gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))` }}
          role="progressbar"
          aria-valuenow={safeCurrent}
          aria-valuemin={0}
          aria-valuemax={safeTotal}
          aria-label={
            typeof resolvedLabel === 'string'
              ? resolvedLabel
              : `Progress ${safeCurrent} of ${safeTotal}`
          }
        >
          {Array.from({ length: safeTotal }, (_, idx) => (
            <span
              key={idx}
              className={cn('az-survey-progress__segment', idx < safeCurrent && 'is-active')}
            />
          ))}
        </div>
      )}

      {prompt !== undefined && <p className="az-survey-progress__prompt">{prompt}</p>}
    </div>
  );
}

/* ============================================================================
 * 7. SurveyForm — Card Form Wrapper with Multi-Stage & Submit Navigation
 * ============================================================================ */

export interface SurveyFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  submitLabel?: ReactNode;
  onSubmit?: () => void;
  showPrevious?: boolean;
  previousLabel?: ReactNode;
  onPrevious?: () => void;
  nextLabel?: ReactNode;
  onNext?: () => void;
  footer?: ReactNode;
}

export function SurveyForm({
  submitLabel,
  onSubmit,
  showPrevious = false,
  previousLabel = 'Previous',
  onPrevious,
  nextLabel,
  onNext,
  footer,
  children,
  className,
  ...rest
}: SurveyFormProps) {
  const hasPrev = showPrevious || onPrevious !== undefined;
  const hasNext = nextLabel !== undefined || onNext !== undefined;
  const hasSubmit = submitLabel !== undefined;
  const hasFooter = footer !== undefined || hasPrev || hasNext || hasSubmit;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('az-survey-form', className)}
      {...rest}
    >
      {children}

      {hasFooter && (
        <div
          className={cn(
            'az-survey-form__footer',
            hasPrev && 'az-survey-form__footer--between',
          )}
        >
          {footer ?? (
            <>
              {hasPrev && (
                <Button
                  variant="outline"
                  tone="neutral"
                  leadingIcon={<ArrowBackIcon size={18} />}
                  onClick={onPrevious}
                >
                  {previousLabel}
                </Button>
              )}

              {hasNext ? (
                <Button
                  variant="solid"
                  tone="primary"
                  trailingIcon={<ArrowRightIcon size={18} />}
                  onClick={onNext}
                >
                  {nextLabel ?? 'Next'}
                </Button>
              ) : hasSubmit ? (
                <Button type="submit" variant="solid" tone="primary">
                  {submitLabel}
                </Button>
              ) : null}
            </>
          )}
        </div>
      )}
    </form>
  );
}

/* ============================================================================
 * 8. SurveyModal — Modal Window Quiz Variant (Inline Stage & Animated Portal)
 * ============================================================================ */

export interface SurveyModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  inline?: boolean;
  stepLabel?: ReactNode;
  question: ReactNode;
  required?: boolean;
  onClose?: () => void;
  onSkip?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  skipLabel?: ReactNode;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

export function SurveyModal({
  open = true,
  inline = false,
  stepLabel,
  question,
  required = false,
  onClose,
  onSkip,
  onPrevious,
  onNext,
  skipLabel = 'Skip',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
  className,
  ...rest
}: SurveyModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (inline) {
      setRendered(open);
      setClosing(false);
      return;
    }
    if (open) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [open, inline, rendered]);

  useEffect(() => {
    if (inline || !open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [inline, open, closeOnEsc, onClose]);

  if (!rendered) return null;

  const dialogCard = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={cn(
        'az-survey-modal',
        !inline && 'az-survey-modal--portal',
        closing && 'az-survey-modal--closing',
        className,
      )}
      {...rest}
    >
      <div className="az-survey-modal__header">
        <div>
          {stepLabel !== undefined && (
            <span className="az-survey-modal__step">{stepLabel}</span>
          )}
          <h3 id={titleId} className="az-survey-modal__title">
            {question}
            {required && (
              <>
                {' '}
                <span className="az-survey-required" aria-hidden="true">
                  *
                </span>
              </>
            )}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="az-survey-modal__close"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {children}

      <div className="az-survey-modal__footer">
        <Button variant="ghost" tone="neutral" size="sm" onClick={onSkip}>
          {skipLabel}
        </Button>

        <div className="az-survey-modal__nav">
          <Button variant="soft" tone="neutral" size="sm" onClick={onPrevious}>
            {previousLabel}
          </Button>
          <Button variant="solid" tone="primary" size="sm" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return <div className="az-survey-modal-stage">{dialogCard}</div>;
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn('az-survey-modal-backdrop', closing && 'az-survey-modal-backdrop--closing')}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {dialogCard}
    </div>,
    document.body,
  );
}

/* ============================================================================
 * 9. SurveyResults — Poll & Quiz Result Breakdown Cards
 * ============================================================================ */

export interface SurveyResultItem {
  id: string;
  label: ReactNode;
  percentage: number;
  correct?: boolean;
  selected?: boolean;
  highlight?: boolean;
}

export interface SurveyResultsProps extends HTMLAttributes<HTMLDivElement> {
  question: ReactNode;
  responseCount?: ReactNode;
  variant?: 'bar-fill' | 'progress-list';
  items: SurveyResultItem[];
}

export function SurveyResults({
  question,
  responseCount,
  variant = 'bar-fill',
  items,
  className,
  ...rest
}: SurveyResultsProps) {
  return (
    <div className={cn('az-survey-results', className)} {...rest}>
      <div className="az-survey-results__head">
        <span className="az-survey-results__title">{question}</span>
        {responseCount !== undefined && (
          <span className="az-survey-results__count">{responseCount}</span>
        )}
      </div>

      {variant === 'progress-list' ? (
        <div className="az-survey-results__progress-list">
          {items.map((item) => {
            const pct = Math.max(0, Math.min(100, item.percentage));
            return (
              <div key={item.id} className="az-survey-results__prog-item">
                <div className="az-survey-results__prog-head">
                  <span>{item.label}</span>
                  <span className="az-survey-results__prog-pct">{pct}%</span>
                </div>
                <div className="az-survey-results__prog-track">
                  <div
                    className="az-survey-results__prog-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="az-survey-results__list">
          {items.map((item) => {
            const pct = Math.max(0, Math.min(100, item.percentage));
            return (
              <div
                key={item.id}
                className={cn(
                  'az-survey-results__bar-row',
                  item.correct && 'az-survey-results__bar-row--correct',
                )}
              >
                <div
                  className={cn(
                    'az-survey-results__bar-fill',
                    item.correct && 'az-survey-results__bar-fill--correct',
                    !item.correct && item.highlight && 'az-survey-results__bar-fill--highlight',
                  )}
                  style={{ width: `${pct}%` }}
                />
                <div className="az-survey-results__bar-content">
                  <div className="az-survey-results__bar-left">
                    {item.correct && (
                      <CheckCircleIcon
                        size={18}
                        style={{ color: 'var(--az-color-primary)', flexShrink: 0 }}
                      />
                    )}
                    {!item.correct && item.selected && (
                      <CheckIcon
                        size={18}
                        style={{ color: 'var(--az-color-on-surface-variant)', flexShrink: 0 }}
                      />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={cn(
                      'az-survey-results__bar-pct',
                      item.correct && 'az-survey-results__bar-pct--correct',
                      !item.correct && item.highlight && 'az-survey-results__bar-pct--highlight',
                    )}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
