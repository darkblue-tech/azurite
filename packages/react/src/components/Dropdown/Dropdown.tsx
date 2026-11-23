import {
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { AzuriteSize } from '../../types';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { CheckIcon, ChevronDownIcon } from '../../icons';
import { Button, type ButtonTone, type ButtonVariant } from '../Button/Button';

export type DropdownPlacement =
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'left'
  | 'right';

export type DropdownItem =
  | {
      type?: 'action';
      id: string;
      label: ReactNode;
      icon?: ReactNode;
      trailingIcon?: ReactNode;
      checked?: boolean;
      destructive?: boolean;
      disabled?: boolean;
      shortcut?: string;
      onSelect?: () => void;
    }
  | {
      type: 'divider';
      id?: string;
    }
  | {
      type: 'label';
      id?: string;
      label: ReactNode;
    };

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  triggerLabel?: ReactNode;
  triggerVariant?: ButtonVariant;
  triggerTone?: ButtonTone;
  triggerSize?: AzuriteSize;
  triggerLeadingIcon?: ReactNode;
  triggerTrailingIcon?: ReactNode;
  placement?: DropdownPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  width?: number | string;
  className?: string;
}

/**
 * Button-initiated directional action menu supporting bottom, top, left, and right placements,
 * action items with icons, checkable toggles, dividers, and destructive actions.
 */
export function Dropdown({
  items,
  trigger,
  triggerLabel = 'Actions',
  triggerVariant = 'solid',
  triggerTone = 'primary',
  triggerSize = 'md',
  triggerLeadingIcon,
  triggerTrailingIcon,
  placement = 'bottom-start',
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  width,
  className,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const closeMenu = useCallback(() => setIsOpen(false), [setIsOpen]);
  useOutsideClick(rootRef, closeMenu, isOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  let triggerNode: ReactNode;
  if (trigger && isValidElement(trigger)) {
    const existingClick = (trigger.props as { onClick?: (e: unknown) => void }).onClick;
    triggerNode = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
      'aria-expanded': isOpen,
      'aria-haspopup': 'menu',
      onClick: (event: unknown) => {
        existingClick?.(event);
        toggleOpen();
      },
    });
  } else {
    triggerNode = (
      <Button
        variant={triggerVariant}
        tone={triggerTone}
        size={triggerSize}
        leadingIcon={triggerLeadingIcon}
        trailingIcon={
          triggerTrailingIcon ?? (
            <ChevronDownIcon
              size={16}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--az-duration-state-change) var(--az-ease-state-change)',
              }}
            />
          )
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleOpen}
      >
        {triggerLabel}
      </Button>
    );
  }

  return (
    <div ref={rootRef} className={cn('az-dropdown', className)}>
      {triggerNode}

      {isOpen && (
        <div
          role="menu"
          style={width ? { width } : undefined}
          className={cn('az-dropdown__menu', `az-dropdown__menu--${placement}`)}
        >
          {items.map((item, idx) => {
            if (item.type === 'divider') {
              return <hr key={item.id ?? `div-${idx}`} className="az-dropdown__divider" />;
            }
            if (item.type === 'label') {
              return (
                <div key={item.id ?? `lbl-${idx}`} className="az-dropdown__label">
                  {item.label}
                </div>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  if (closeOnSelect) setIsOpen(false);
                }}
                className={cn(
                  'az-dropdown__item',
                  item.destructive && 'az-dropdown__item--destructive',
                )}
              >
                <span className="az-dropdown__item-left">
                  {item.icon && (
                    <span className="az-dropdown__item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </span>
                {item.shortcut && <span className="az-dropdown__shortcut">{item.shortcut}</span>}
                {item.trailingIcon}
                {item.checked && (
                  <span className="az-dropdown__item-check" aria-hidden="true">
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
}

