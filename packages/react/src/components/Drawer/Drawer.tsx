import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { BrandMark } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Tooltip } from '../Tooltip/Tooltip';

export type DrawerVariant = 'icons' | 'text' | 'combined';

export interface DrawerItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  href?: string;
  ariaLabel?: string;
}

export interface DrawerSection {
  id?: string;
  ariaLabel?: string;
  title?: ReactNode;
  items: DrawerItem[];
}

export interface DrawerProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Compact icon-only rail, typographic list, or standard combined icon-label sidebar. */
  variant?: DrawerVariant;
  /** Navigation sections separated by 1px hairline rules. */
  sections: DrawerSection[];
  /** Controlled active item ID. */
  value?: string;
  /** Initial uncontrolled active item ID. */
  defaultValue?: string;
  /** Fires when user activates a drawer item. */
  onChange?: (id: string, item: DrawerItem) => void;
  /** Custom brand header element (replaces default BrandMark + brandTitle header). */
  brand?: ReactNode;
  /** Brand title string rendered in `text` and `combined` variants (default 'Studio'). */
  brandTitle?: ReactNode;
  /** Footer slot anchored at bottom of sidebar. */
  footer?: ReactNode;
  /** Enables animated slide-over portal drawer mode. */
  overlay?: boolean;
  /** Open state when `overlay={true}` (defaults true for static flow mode). */
  open?: boolean;
  /** Callback when overlay drawer closes via Escape or backdrop click. */
  onClose?: () => void;
  /** Screen edge for overlay slide-over mode. */
  side?: 'left' | 'right';
  /** Closes overlay drawer on backdrop click. */
  closeOnBackdrop?: boolean;
  /** Closes overlay drawer on Escape key. */
  closeOnEsc?: boolean;
  ariaLabel?: string;
}

/**
 * Navigation sidebar Drawer supporting compact Icon-Only rails (with hover Tooltips),
 * pure Typographic menus, standard Icons + Labels sidebars, and slide-over Portal mode.
 */
export function Drawer({
  variant = 'combined',
  sections,
  value,
  defaultValue,
  onChange,
  brand,
  brandTitle = 'Studio',
  footer,
  overlay = false,
  open = true,
  onClose,
  side = 'left',
  closeOnBackdrop = true,
  closeOnEsc = true,
  ariaLabel = 'Sidebar navigation',
  className,
  ...rest
}: DrawerProps) {
  const flatItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const firstEnabledId = flatItems.find((i) => !i.disabled)?.id ?? flatItems[0]?.id ?? '';

  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabledId,
  });

  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!overlay) {
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
  }, [overlay, open, rendered]);

  useEffect(() => {
    if (!overlay || !open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => asideRef.current?.focus());

    const handleKey = (e: globalThis.KeyboardEvent) => {
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
  }, [overlay, open, closeOnEsc, onClose]);

  if (!rendered) return null;

  const handleSelect = (item: DrawerItem) => {
    if (item.disabled) return;
    setActiveId(item.id);
    onChange?.(item.id, item);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, flatIdx: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const enabled = flatItems
      .map((item, idx) => (!item.disabled ? idx : -1))
      .filter((idx) => idx !== -1);
    if (enabled.length === 0) return;

    const pos = enabled.indexOf(flatIdx);
    let nextIdx = flatIdx;
    if (e.key === 'ArrowDown') nextIdx = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowUp') nextIdx = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') nextIdx = enabled[0];
    else if (e.key === 'End') nextIdx = enabled[enabled.length - 1];

    itemRefs.current[nextIdx]?.focus();
  };

  const defaultBrandNode = (
    <div className="az-drawer__brand">
      {variant !== 'text' && (
        <span className="az-drawer__logo-box" aria-hidden="true">
          <BrandMark size={variant === 'icons' ? 18 : 14} />
        </span>
      )}
      {variant !== 'icons' && (
        <span className="az-drawer__brand-title">{brandTitle}</span>
      )}
    </div>
  );

  let runningIndex = 0;

  const asideNode = (
    <aside
      ref={asideRef}
      aria-label={ariaLabel}
      tabIndex={overlay ? -1 : undefined}
      className={cn(
        'az-drawer',
        `az-drawer--${variant}`,
        overlay && 'az-drawer--overlay',
        className,
      )}
      onClick={(e) => overlay && e.stopPropagation()}
      {...rest}
    >
      {brand !== undefined ? <div className="az-drawer__brand">{brand}</div> : defaultBrandNode}

      {sections.map((section, sIdx) => (
        <nav
          key={section.id ?? sIdx}
          aria-label={section.ariaLabel ?? (typeof section.title === 'string' ? section.title : `Section ${sIdx + 1}`)}
          className="az-drawer__section"
        >
          {variant !== 'icons' && section.title && (
            <span className="az-drawer__section-title">{section.title}</span>
          )}

          {section.items.map((item) => {
            const idx = runningIndex++;
            const active = item.id === activeId;
            const commonClass = cn('az-drawer__item', active && 'az-drawer__item--active');

            const content =
              variant === 'icons' ? (
                <span aria-hidden="true">{item.icon}</span>
              ) : variant === 'text' ? (
                <>
                  <span>{item.label}</span>
                  {item.badge}
                </>
              ) : (
                <>
                  <span className="az-drawer__item-lead">
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                  {item.badge}
                </>
              );

            const control = item.href ? (
              <a
                key={item.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                href={item.disabled ? undefined : item.href}
                aria-label={item.ariaLabel ?? item.label}
                aria-current={active ? 'page' : undefined}
                aria-disabled={item.disabled || undefined}
                className={commonClass}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  handleSelect(item);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {content}
              </a>
            ) : (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                disabled={item.disabled}
                aria-label={item.ariaLabel ?? item.label}
                aria-current={active ? 'page' : undefined}
                className={commonClass}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {content}
              </button>
            );

            if (variant === 'icons') {
              return (
                <Tooltip
                  key={item.id}
                  content={item.label}
                  placement={side === 'right' ? 'left' : 'right'}
                  size="sm"
                >
                  {control}
                </Tooltip>
              );
            }

            return control;
          })}
        </nav>
      ))}

      {footer && <div className="az-drawer__footer">{footer}</div>}
    </aside>
  );

  if (!overlay) {
    return asideNode;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'az-drawer-backdrop',
        side === 'right' && 'az-drawer-backdrop--right',
        closing && 'az-drawer-backdrop--closing',
      )}
      onClick={() => closeOnBackdrop && onClose?.()}
    >
      {asideNode}
    </div>,
    document.body,
  );
}

