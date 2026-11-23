import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { ValidationState } from '../../types';
import { cn } from '../../utils/cn';
import { CloseIcon, UploadIcon } from '../../icons';
import { ValidatorHint } from '../Validator/Validator';

export interface FileDropZoneProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  maxSize?: number;
  validationState?: ValidationState;
  errorMessage?: ReactNode;
  onFilesChange?: (files: File[]) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Full-width dashed drag-and-drop file upload zone with floating upload icon animation,
 * drag-over highlighting, file list preview chips, and max-size validation.
 */
export const FileDropZone = forwardRef<HTMLInputElement, FileDropZoneProps>(function FileDropZone(
  {
    title = 'Drop files here or click to browse',
    subtitle = 'Supports SVG, PNG, JPG, and PDF up to 25MB',
    icon,
    maxSize,
    validationState,
    errorMessage,
    disabled = false,
    multiple = false,
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

  const dragDepthRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState<string | undefined>(undefined);

  const effectiveValidation: ValidationState =
    validationState ?? (sizeError ? 'invalid' : files.length > 0 ? 'valid' : 'neutral');

  const acceptFiles = (incoming: File[]) => {
    if (disabled) return;
    if (maxSize !== undefined && incoming.some((f) => f.size > maxSize)) {
      setSizeError(`One or more files exceed the ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`);
      return;
    }
    setSizeError(undefined);
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
    setFiles(next);
    onFilesChange?.(next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = event.target.files ? Array.from(event.target.files) : [];
    if (incoming.length > 0) {
      acceptFiles(incoming);
    }
    onChange?.(event);
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepthRef.current += 1;
    setDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setDragging(false);
    if (disabled) return;
    const dropped = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
    if (dropped.length > 0) {
      acceptFiles(dropped);
    }
  };

  const removeFileAt = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const next = files.filter((_, i) => i !== index);
    if (next.length === 0 && innerRef.current) {
      innerRef.current.value = '';
    }
    setFiles(next);
    onFilesChange?.(next);
  };

  return (
    <div className={cn('az-file-field', className)}>
      <label
        htmlFor={inputId}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'az-dropzone',
          dragging && 'az-dropzone--active',
          disabled && 'az-dropzone--disabled',
          effectiveValidation === 'invalid' && 'az-dropzone--invalid',
        )}
      >
        <input
          ref={innerRef}
          id={inputId}
          type="file"
          disabled={disabled}
          multiple={multiple}
          onChange={handleInputChange}
          className="az-sr-only"
          {...rest}
        />

        <div className="az-dropzone__icon" aria-hidden="true">
          {icon ?? <UploadIcon size={24} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <span className="az-dropzone__title">
            {files.length === 1 ? files[0].name : title}
          </span>
          <span className="az-dropzone__subtitle">{subtitle}</span>
        </div>

        {files.length > 0 && (
          <div className="az-dropzone__files">
            {files.map((file, idx) => (
              <span key={`${file.name}-${idx}`} className="az-dropzone__file-chip">
                <span>
                  {file.name} ({formatBytes(file.size)})
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={(e) => removeFileAt(idx, e)}
                  className="az-badge__remove"
                >
                  <CloseIcon size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </label>

      <ValidatorHint
        state={effectiveValidation}
        errorMessage={errorMessage ?? sizeError}
        showOnlyWhenInvalid
      />
    </div>
  );
});
