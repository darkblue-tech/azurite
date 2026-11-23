import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { AzuriteSize, ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { CloseIcon } from '../../icons';
import { Fieldset } from '../Fieldset/Fieldset';
import { FieldLabel } from '../Label/Label';
import { ValidatorHint } from '../Validator/Validator';

export type FileInputVariant = 'standard' | 'ghost' | 'fieldset';

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> {
  variant?: FileInputVariant;
  size?: AzuriteSize;
  label?: ReactNode;
  buttonLabel?: ReactNode;
  placeholder?: string;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  validationState?: ValidationState;
  maxSize?: number;
  clearable?: boolean;
  onFilesChange?: (files: File[]) => void;
}

/**
 * Compact single-line file input supporting standard, ghost, and fieldset variants across 5 sizes.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  {
    variant = 'standard',
    size = 'md',
    label,
    buttonLabel = 'Choose File',
    placeholder = 'No file chosen',
    helperText,
    errorMessage,
    validationState,
    maxSize,
    clearable = true,
    disabled = false,
    onFilesChange,
    onChange,
    className,
    id,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState<string | undefined>(undefined);

  const effectiveValidation: ValidationState =
    validationState ?? (sizeError ? 'invalid' : selectedFiles.length > 0 ? 'valid' : 'neutral');

  const displayName =
    selectedFiles.length === 0
      ? placeholder
      : selectedFiles.length === 1
        ? selectedFiles[0].name
        : `${selectedFiles.length} files selected`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (maxSize !== undefined && files.some((f) => f.size > maxSize)) {
      setSizeError(`File exceeds maximum size of ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      setSelectedFiles([]);
      onFilesChange?.([]);
    } else {
      setSizeError(undefined);
      setSelectedFiles(files);
      onFilesChange?.(files);
    }
    onChange?.(event);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (innerRef.current) {
      innerRef.current.value = '';
    }
    setSelectedFiles([]);
    setSizeError(undefined);
    onFilesChange?.([]);
  };

  const hiddenInput = (
    <input
      ref={innerRef}
      id={inputId}
      type="file"
      disabled={disabled}
      onChange={handleChange}
      className="az-sr-only"
      {...rest}
    />
  );

  return (
    <div className={cn('az-file-field', className)}>
      {variant === 'fieldset' ? (
        <Fieldset
          variant="inline"
          legend={label}
          validationState={effectiveValidation}
          disabled={disabled}
        >
          <label htmlFor={inputId} className="az-file-fieldset-row">
            {hiddenInput}
            <span className="az-file-fieldset-btn">{buttonLabel}</span>
            <span
              className={cn(
                'az-file-ctrl__name',
                selectedFiles.length > 0 && 'az-file-ctrl__name--selected',
              )}
            >
              {displayName}
            </span>
            {clearable && selectedFiles.length > 0 && !disabled && (
              <button
                type="button"
                aria-label="Clear selected file"
                onClick={handleClear}
                className="az-file-clear"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </label>
        </Fieldset>
      ) : (
        <>
          {label !== undefined && label !== null && (
            <FieldLabel htmlFor={inputId} tone={disabled ? 'muted' : 'default'}>
              {label}
            </FieldLabel>
          )}
          <label
            htmlFor={inputId}
            className={cn(
              'az-file-ctrl',
              `az-file-ctrl--${size}`,
              variant === 'ghost' && 'az-file-ctrl--ghost',
              effectiveValidation !== 'neutral' && `az-file-ctrl--${effectiveValidation}`,
              disabled && 'az-file-ctrl--disabled',
            )}
          >
            {hiddenInput}
            <span className="az-file-ctrl__btn">{buttonLabel}</span>
            <span
              className={cn(
                'az-file-ctrl__name',
                selectedFiles.length > 0 && 'az-file-ctrl__name--selected',
              )}
            >
              {displayName}
            </span>
            {clearable && selectedFiles.length > 0 && !disabled && (
              <button
                type="button"
                aria-label="Clear selected file"
                onClick={handleClear}
                className="az-file-clear"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </label>
        </>
      )}

      <ValidatorHint
        state={effectiveValidation}
        errorMessage={errorMessage ?? sizeError}
        helperText={helperText}
      />
    </div>
  );
});

