import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Tooltip } from '../Tooltip/Tooltip';

export type DockSize = 'xs' | 'sm' | 'regular' | 'md' | 'lg' | 'xl';

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface DockProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Navigation items rendered across the dock bar. */
  items: DockItem[];
  /** Controlled active item ID. */
  value?: string;
  /** Initial uncontrolled active item ID (defaults to first item). */
  defaultValue?: string;
  /** Fires when user activates a dock item. */
  onChange?: (id: string, item: DockItem) => void;
  /** Six calibrated dock height & layout tiers (xs 48px -> xl 96px). */
  size?: DockSize;
  /** Trailing action trigger (used prominently in `lg` studio dock). */
  action?: ReactNode;
  /** Applies floating ambient elevation shadow (default true). */
  floating?: boolean;
  /** Stretches bar to full available width. */
  fullWidth?: boolean;
  /** Accessible landmark label. */
  ariaLabel?: string;
}

/**
 * Material 3 Expressive bottom navigation Dock across six calibrated heights
 * (48px XS icon-only through 96px XL studio tiles) with animated active indicator pills
 * and arrow-key traversal.
 */
export function Dock({
  items,
  value,
  defaultValue,
  onChange,
  size = 'regular',
  action,
  floating = true,
  fullWidth = false,
  ariaLabel = 'Dock navigation',
  className,
  style,
  ...rest
}: DockProps) {
  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? items[0]?.id ?? '',
  });

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isStacked = size === 'regular' || size === 'md';
  const isIconOnly = size === 'xs';

  const handleSelect = (item: DockItem) => {
    if (item.disabled) return;
    setActiveId(item.id);
    onChange?.(item.id, item);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const enabledIndices = items
      .map((item, idx) => (!item.disabled ? idx : -1))
      .filter((idx) => idx !== -1);
    if (enabledIndices.length === 0) return;

    let targetIdx = index;
    const pos = enabledIndices.indexOf(index);
    if (e.key === 'ArrowRight') {
      targetIdx = enabledIndices[(pos + 1) % enabledIndices.length];
    } else if (e.key === 'ArrowLeft') {
      targetIdx = enabledIndices[(pos - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (e.key === 'Home') {
      targetIdx = enabledIndices[0];
    } else if (e.key === 'End') {
      targetIdx = enabledIndices[enabledIndices.length - 1];
    }

    const nextItem = items[targetIdx];
    btnRefs.current[targetIdx]?.focus();
    if (nextItem) handleSelect(nextItem);
  };

  const renderItem = (item: DockItem, index: number) => {
    const active = item.id === activeId;
    const buttonNode = (
      <button
        key={item.id}
        ref={(el) => {
          btnRefs.current[index] = el;
        }}
        type="button"
        disabled={item.disabled}
        aria-current={active ? 'page' : undefined}
        aria-label={item.ariaLabel ?? item.label}
        className={cn('az-dock__item', active && 'az-dock__item--active')}
        onClick={() => handleSelect(item)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      >
        {isStacked ? (
          <span className="az-dock__pill">
            <span className="az-dock__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
        ) : (
          <span className="az-dock__icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        {!isIconOnly && <span className="az-dock__label">{item.label}</span>}
      </button>
    );

    if (isIconOnly) {
      return (
        <Tooltip key={item.id} content={item.label} placement="top" size="sm">
          {buttonNode}
        </Tooltip>
      );
    }
    return buttonNode;
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'az-dock',
        `az-dock--${size}`,
        floating && 'az-dock--floating',
        fullWidth && 'az-dock--full-width',
        className,
      )}
      style={{ '--az-dock-cols': items.length, ...style } as CSSProperties}
      {...rest}
    >
      {size === 'lg' ? (
        <>
          <div className="az-dock__nav-group">{items.map(renderItem)}</div>
          {action && <div className="az-dock__action">{action}</div>}
        </>
      ) : (
        items.map(renderItem)
      )}
    </nav>
  );
}

