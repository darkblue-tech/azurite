import { useState, type HTMLAttributes, type ReactNode } from 'react';
import type { AzuriteSize } from '../../types';
import { ChevronDownIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Tooltip } from '../Tooltip/Tooltip';

export type MenuOrientation = 'vertical' | 'horizontal';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  href?: string;
  tooltip?: string;
  defaultExpanded?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Hierarchical menu items (leaf links or collapsible subtrees). */
  items: MenuItem[];
  /** Vertical stack vs horizontal bar. */
  orientation?: MenuOrientation;
  /** Five calibrated density tiers (XS -> XL). */
  size?: AzuriteSize;
  /** Compact square icon-only mode. */
  iconOnly?: boolean;
  /** Displays contextual Tooltips on hover/focus (recommended for icon-only menus). */
  showTooltips?: boolean;
  /** Active highlight style: subtle 'soft' primary-container or 'solid' primary fill. */
  activeStyle?: 'soft' | 'solid';
  /** Optional titled menu header bar separated by a hairline border. */
  header?: ReactNode;
  /** Controlled active item ID. */
  value?: string;
  /** Initial uncontrolled active item ID. */
  defaultValue?: string;
  /** Callback when leaf item is activated. */
  onChange?: (id: string, item: MenuItem) => void;
  /** Controlled list of expanded branch IDs for nested menus. */
  expandedIds?: string[];
  /** Initial expanded branch IDs (defaults to items with `defaultExpanded: true`). */
  defaultExpandedIds?: string[];
  /** Fires when nested collapsible sections expand or collapse. */
  onExpandedChange?: (ids: string[]) => void;
  /** Wraps menu in bordered surface container (default true). */
  contained?: boolean;
  ariaLabel?: string;
}

function collectDefaultExpanded(items: MenuItem[]): string[] {
  const result: string[] = [];
  const walk = (list: MenuItem[]) => {
    for (const item of list) {
      if (item.children && item.children.length > 0) {
        if (item.defaultExpanded) result.push(item.id);
        walk(item.children);
      }
    }
  };
  walk(items);
  return result;
}

/**
 * Interactive Menu component supporting vertical & horizontal bars, icon-only strips
 * with hover Tooltips, 5 proportional sizes (XS–XL), badges, titled headers,
 * disabled states, and nested collapsible tree hierarchies.
 */
export function Menu({
  items,
  orientation = 'vertical',
  size = 'md',
  iconOnly = false,
  showTooltips = false,
  activeStyle = 'soft',
  header,
  value,
  defaultValue,
  onChange,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  contained = true,
  ariaLabel = 'Menu navigation',
  className,
  ...rest
}: MenuProps) {
  const firstSelectable = items.find((i) => !i.disabled && (!i.children || i.children.length === 0))?.id ?? '';

  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstSelectable,
  });

  const [localExpanded, setLocalExpanded] = useState<string[]>(() =>
    defaultExpandedIds ?? collectDefaultExpanded(items),
  );

  const currentExpanded = expandedIds ?? localExpanded;

  const toggleExpand = (id: string) => {
    const next = currentExpanded.includes(id)
      ? currentExpanded.filter((x) => x !== id)
      : [...currentExpanded, id];
    if (expandedIds === undefined) setLocalExpanded(next);
    onExpandedChange?.(next);
  };

  const handleSelect = (item: MenuItem) => {
    if (item.disabled) return;
    setActiveId(item.id);
    item.onClick?.();
    onChange?.(item.id, item);
  };

  const renderLeaf = (item: MenuItem, isChild = false) => {
    const active = item.id === activeId && !item.disabled;
    const itemClass = cn(
      'az-menu__item',
      active && 'az-menu__item--active',
      item.disabled && 'az-menu__item--disabled',
    );

    const inner = iconOnly ? (
      <span aria-hidden="true">{item.icon}</span>
    ) : (
      <>
        <span className="az-menu__item-lead">
          {item.icon && <span aria-hidden="true">{item.icon}</span>}
          <span>{item.label}</span>
        </span>
        {item.badge}
      </>
    );

    const node = item.href ? (
      <a
        href={item.disabled ? undefined : item.href}
        role="menuitem"
        aria-label={iconOnly ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        aria-disabled={item.disabled || undefined}
        className={itemClass}
        style={isChild ? { paddingBlock: 6 } : undefined}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          handleSelect(item);
        }}
      >
        {inner}
      </a>
    ) : (
      <button
        type="button"
        role="menuitem"
        disabled={item.disabled}
        aria-label={iconOnly ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={itemClass}
        style={isChild ? { paddingBlock: 6 } : undefined}
        onClick={() => handleSelect(item)}
      >
        {inner}
      </button>
    );

    if (showTooltips && !item.disabled) {
      return (
        <Tooltip
          content={item.tooltip ?? item.label}
          placement={orientation === 'horizontal' ? 'bottom' : 'right'}
          size="sm"
        >
          {node}
        </Tooltip>
      );
    }

    return node;
  };

  const renderNodes = (nodes: MenuItem[], isNested = false): ReactNode =>
    nodes.map((item) => {
      const hasChildren = Boolean(item.children && item.children.length > 0 && !iconOnly && orientation === 'vertical');
      if (!hasChildren) {
        return <li key={item.id} role="none">{renderLeaf(item, isNested)}</li>;
      }

      const isExpanded = currentExpanded.includes(item.id);
      return (
        <li key={item.id} role="none">
          <button
            type="button"
            aria-expanded={isExpanded}
            className="az-menu__item az-menu__parent-trigger"
            style={isNested ? { paddingBlock: 6 } : undefined}
            onClick={() => toggleExpand(item.id)}
          >
            <span className="az-menu__item-lead">
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
            <span
              className={cn('az-menu__chevron', isExpanded && 'az-menu__chevron--expanded')}
              aria-hidden="true"
            >
              <ChevronDownIcon size={18} />
            </span>
          </button>

          <div className={cn('az-menu__branch', isExpanded && 'az-menu__branch--expanded')}>
            <div className="az-menu__branch-inner">
              <ul className="az-menu__sublist" role="group">
                {renderNodes(item.children!, true)}
              </ul>
            </div>
          </div>
        </li>
      );
    });

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'az-menu',
        `az-menu--${orientation}`,
        `az-menu--${size}`,
        iconOnly && 'az-menu--icon-only',
        activeStyle === 'solid' && 'az-menu--solid',
        !contained && 'az-menu--uncontained',
        className,
      )}
      {...rest}
    >
      {header && !iconOnly && <div className="az-menu__header">{header}</div>}
      <ul
        role={orientation === 'horizontal' ? 'menubar' : 'menu'}
        className="az-menu__list"
      >
        {renderNodes(items)}
      </ul>
    </nav>
  );
}

