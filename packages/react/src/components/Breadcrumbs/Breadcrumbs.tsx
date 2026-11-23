import { Fragment, type CSSProperties, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { ChevronRightIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export interface BreadcrumbItem {
  id?: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  expandable?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  scrollable?: boolean;
  maxWidth?: number | string;
  framed?: boolean;
  activeTone?: 'default' | 'primary';
}

type VisibleEntry =
  | { type: 'item'; item: BreadcrumbItem; index: number }
  | { type: 'ellipsis'; hiddenCount: number };

/**
 * Hierarchical breadcrumb navigation supporting simple links, leading icons,
 * collapsible middle truncation, and horizontal scrolling in narrow containers.
 */
export function Breadcrumbs({
  items,
  separator,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 2,
  expandable = true,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  scrollable = false,
  maxWidth,
  framed = true,
  activeTone = 'default',
  'aria-label': ariaLabel = 'Breadcrumb',
  className,
  style,
  ...rest
}: BreadcrumbsProps) {
  const [isExpanded, setIsExpanded] = useControllableState<boolean>({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });

  const resolvedSeparator = separator ?? <ChevronRightIcon size={16} />;

  const shouldCollapse =
    !isExpanded &&
    maxItems !== undefined &&
    items.length > maxItems &&
    itemsBeforeCollapse + itemsAfterCollapse < items.length;

  const visibleEntries: VisibleEntry[] = shouldCollapse
    ? [
        ...items
          .slice(0, itemsBeforeCollapse)
          .map((item, idx) => ({ type: 'item' as const, item, index: idx })),
        {
          type: 'ellipsis' as const,
          hiddenCount: items.length - itemsBeforeCollapse - itemsAfterCollapse,
        },
        ...items
          .slice(items.length - itemsAfterCollapse)
          .map((item, offset) => ({
            type: 'item' as const,
            item,
            index: items.length - itemsAfterCollapse + offset,
          })),
      ]
    : items.map((item, index) => ({ type: 'item' as const, item, index }));

  const navStyle: CSSProperties = {
    ...(maxWidth !== undefined ? { maxWidth } : {}),
    ...style,
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'az-breadcrumbs',
        framed && 'az-breadcrumbs--framed',
        scrollable && 'az-breadcrumbs--scrollable',
        className,
      )}
      style={navStyle}
      {...rest}
    >
      <ol className="az-breadcrumbs__list">
        {visibleEntries.map((entry, pos) => {
          const isLast = pos === visibleEntries.length - 1;
          return (
            <Fragment key={entry.type === 'ellipsis' ? 'ellipsis' : entry.item.id ?? entry.index}>
              <li
                className="az-breadcrumbs__item"
                aria-current={
                  entry.type === 'item' && (entry.item.current ?? isLast) ? 'page' : undefined
                }
              >
                {entry.type === 'ellipsis' ? (
                  expandable ? (
                    <button
                      type="button"
                      className="az-breadcrumbs__ellipsis"
                      aria-label={`Show ${entry.hiddenCount} hidden path segments`}
                      onClick={() => setIsExpanded(true)}
                    >
                      ...
                    </button>
                  ) : (
                    <span className="az-breadcrumbs__ellipsis" aria-hidden="true">
                      ...
                    </span>
                  )
                ) : (entry.item.current ?? isLast) ? (
                  <span
                    className={cn(
                      'az-breadcrumbs__current',
                      activeTone === 'primary' && 'az-breadcrumbs__current--primary',
                    )}
                  >
                    {entry.item.icon}
                    <span>{entry.item.label}</span>
                  </span>
                ) : entry.item.href ? (
                  <a
                    href={entry.item.href}
                    className="az-breadcrumbs__link"
                    onClick={entry.item.onClick}
                  >
                    {entry.item.icon}
                    <span>{entry.item.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="az-breadcrumbs__link"
                    onClick={entry.item.onClick}
                  >
                    {entry.item.icon}
                    <span>{entry.item.label}</span>
                  </button>
                )}
              </li>
              {!isLast && (
                <li className="az-breadcrumbs__separator" aria-hidden="true">
                  {resolvedSeparator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

