import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { Button } from '../Button/Button';

export type ModalVariant = 'standard' | 'dialog' | 'simple' | 'wide';
export type ModalSize = 'sm' | 'md' | 'lg' | 'wide';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controls dialog visibility. */
  open: boolean;
  /** Callback invoked when Close button, Escape key, or backdrop is activated. */
  onClose?: () => void;
  /** Architectural preset mirroring Standard, Dialog (text-only), Simple, and Wide variants. */
  variant?: ModalVariant;
  /** Optional explicit max-width override. */
  size?: ModalSize;
  /** Renders inline in normal document flow instead of a fullscreen portal overlay. */
  inline?: boolean;
  /** Dialog heading (omitted for `simple` notifications). */
  title?: ReactNode;
  /** Body description paragraph. */
  description?: ReactNode;
  /** Custom modal body content appended below description. */
  children?: ReactNode;
  /** Custom footer actions replacing the default Close text action. */
  footer?: ReactNode;
  /** Displays the bottom-right Close action button (defaults false for `dialog`, true otherwise). */
  showCloseAction?: boolean;
  /** Displays a top-right circular close icon button (defaults true for `dialog` and `wide`). */
  showCloseIcon?: boolean;
  /** Label for the default Close button. */
  closeLabel?: string;
  /** Closes modal on backdrop click (overlay mode). */
  closeOnBackdrop?: boolean;
  /** Closes modal on Escape key press (overlay mode). */
  closeOnEsc?: boolean;
}

/**
 * Dialog window component supporting Standard, informational Dialog, compact Simple,
 * and Wide audit architectures in both animated portal overlay and inline flow modes.
 */
export function Modal({
  open,
  onClose,
  variant = 'standard',
  size,
  inline = false,
  title,
  description,
  children,
  footer,
  showCloseAction,
  showCloseIcon,
  closeLabel = 'Close',
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
  ...rest
}: ModalProps) {
  const titleId = useId();
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
      const timer = setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, inline, rendered]);

  // Overlay keyboard Escape + body scroll lock + focus restore
  useEffect(() => {
    if (inline || !open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
      prevFocus?.focus?.();
    };
  }, [inline, open, closeOnEsc, onClose]);

  if (!rendered) return null;

  const hasClose = showCloseAction ?? variant !== 'dialog';
  const hasCloseIcon = showCloseIcon ?? (variant === 'dialog' || variant === 'wide');
  const hasFooter = Boolean(footer || hasClose);

  const cardNode = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={!inline || undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? 'Dialog modal' : undefined}
      tabIndex={-1}
      className={cn(
        'az-modal',
        `az-modal--${variant}`,
        size && `az-modal--${size}`,
        hasFooter && 'az-modal--has-footer',
        hasCloseIcon && 'az-modal--has-close-icon',
        !title && 'az-modal--no-title',
        closing && 'az-modal--closing',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...rest}
    >
      {!title && hasCloseIcon && (
        <button
          type="button"
          className="az-modal__close-icon az-modal__close-icon--floating"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon size={18} />
        </button>
      )}

      <div className="az-modal__header">
        {title && (
          <div className="az-modal__title-row">
            <h3 id={titleId} className="az-modal__title">
              {title}
            </h3>
            {hasCloseIcon && (
              <button
                type="button"
                className="az-modal__close-icon"
                aria-label={closeLabel}
                onClick={onClose}
              >
                <CloseIcon size={18} />
              </button>
            )}
          </div>
        )}
        {description && <p className="az-modal__body">{description}</p>}
        {children}
      </div>

      {hasFooter && (
        <div className="az-modal__footer">
          {footer ?? (
            <Button variant="ghost" tone="primary" size="md" onClick={onClose}>
              {closeLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (inline) {
    return cardNode;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={cn('az-modal-backdrop', closing && 'az-modal-backdrop--closing')}
      onClick={() => closeOnBackdrop && onClose?.()}
    >
      {cardNode}
    </div>,
    document.body,
  );
}

