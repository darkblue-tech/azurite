import type { ReactNode } from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Fieldset } from '../Fieldset/Fieldset';
import { Checkbox, type CheckboxTone, type CheckboxVariant } from './Checkbox';

export interface CheckboxGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  /** When set, renders a synced tri-state parent Checkbox controlling all options. */
  selectAllLabel?: ReactNode;
  legend?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  validationState?: ValidationState;
  divided?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: AzuriteSize;
  variant?: CheckboxVariant;
  tone?: CheckboxTone;
  disabled?: boolean;
  className?: string;
}

/**
 * Grouped checkbox fieldset supporting optional tri-state "Select all" parent synchronization
 * and hairline-divided rows.
 */
export function CheckboxGroup({
  options,
  values,
  defaultValues = [],
  onValuesChange,
  selectAllLabel,
  legend,
  helperText,
  errorText,
  validationState = 'neutral',
  divided = false,
  orientation = 'vertical',
  size = 'md',
  variant = 'solid',
  tone = 'primary',
  disabled = false,
  className,
}: CheckboxGroupProps) {
  const [selected, setSelected] = useControllableState<string[]>({
    value: values,
    defaultValue: defaultValues,
    onChange: onValuesChange,
  });

  const enabledOptions = options.filter((o) => !o.disabled);
  const selectedSet = new Set(selected);
  const checkedEnabledCount = enabledOptions.filter((o) => selectedSet.has(o.value)).length;

  const allSelected =
    enabledOptions.length > 0 && checkedEnabledCount === enabledOptions.length;
  const someSelected = checkedEnabledCount > 0 && checkedEnabledCount < enabledOptions.length;

  const handleToggleAll = (nextChecked: boolean) => {
    if (nextChecked) {
      const next = Array.from(
        new Set([...selected, ...enabledOptions.map((o) => o.value)]),
      );
      setSelected(next);
    } else {
      const enabledSet = new Set(enabledOptions.map((o) => o.value));
      setSelected(selected.filter((v) => !enabledSet.has(v)));
    }
  };

  const handleToggleOption = (optionValue: string, nextChecked: boolean) => {
    if (nextChecked) {
      setSelected(Array.from(new Set([...selected, optionValue])));
    } else {
      setSelected(selected.filter((v) => v !== optionValue));
    }
  };

  const itemList = options.map((opt) => (
    <Checkbox
      key={opt.value}
      size={selectAllLabel && size === 'md' ? 'sm' : size}
      variant={variant}
      tone={tone}
      disabled={disabled || opt.disabled}
      checked={selectedSet.has(opt.value)}
      onCheckedChange={(next) => handleToggleOption(opt.value, next)}
      label={opt.label}
      description={opt.description}
    />
  ));

  const content = selectAllLabel ? (
    <div className={cn('az-cb-group', className)}>
      <Checkbox
        size={size}
        variant={variant}
        tone={tone}
        disabled={disabled}
        checked={allSelected}
        indeterminate={someSelected}
        onCheckedChange={handleToggleAll}
        label={selectAllLabel}
      />
      <div
        className={cn(
          'az-cb-group__children',
          orientation === 'vertical' && 'az-cb-group__children--vertical',
        )}
      >
        {itemList}
      </div>
    </div>
  ) : (
    <div
      className={cn('az-cb-group', className)}
      style={
        orientation === 'horizontal'
          ? { flexDirection: 'row', flexWrap: 'wrap', gap: '24px' }
          : undefined
      }
    >
      {itemList}
    </div>
  );

  if (legend !== undefined || divided || helperText || errorText) {
    return (
      <Fieldset
        legend={legend}
        divided={divided && !selectAllLabel}
        helperText={helperText}
        errorText={errorText}
        validationState={validationState}
        disabled={disabled}
      >
        {selectAllLabel ? content : itemList}
      </Fieldset>
    );
  }

  return content;
}

