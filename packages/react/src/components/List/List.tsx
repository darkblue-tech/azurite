import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ListVariant = 'unnumbered' | 'numbered' | 'editorial';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ListVariant;
  framed?: boolean;
  divided?: boolean;
  interactive?: boolean;
  header?: ReactNode;
  headerBadge?: ReactNode;
}

/**
 * Swiss-inspired list container supporting unnumbered bulleted lists, oversized numbered sequences,
 * and rich editorial ranked lists with optional header and badge.
 */
export function List({
  variant = 'unnumbered',
  framed = true,
  divided,
  interactive = false,
  header,
  headerBadge,
  className,
  children,
  ...rest
}: ListProps) {
  const isDivided = divided ?? variant !== 'unnumbered';
  const ListTag = variant === 'unnumbered' ? 'ul' : 'ol';

  return (
    <div
      className={cn(
        'az-list-card',
        `az-list-card--${variant}`,
        framed && 'az-list-card--framed',
        className,
      )}
      {...rest}
    >
      {(header !== undefined || headerBadge !== undefined) && (
        <div className="az-list-header">
          {header !== undefined && <h3 className="az-list-header__title">{header}</h3>}
          {headerBadge}
        </div>
      )}

      <ListTag
        className={cn(
          'az-list',
          `az-list--${variant}`,
          isDivided && 'az-list--divided',
          interactive && 'az-list--interactive',
        )}
      >
        {children}
      </ListTag>
    </div>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  variant?: ListVariant;
  index?: string | number;
  title: ReactNode;
  subtitle?: ReactNode;
  media?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  active?: boolean;
}

/**
 * Individual row for `List` supporting bullet, oversized tabular index, thumbnail media,
 * primary/secondary typography, tabular metadata, and trailing action slot.
 */
export function ListItem({
  variant = 'unnumbered',
  index,
  title,
  subtitle,
  media,
  meta,
  action,
  active = false,
  className,
  ...rest
}: ListItemProps) {
  const formattedIndex =
    typeof index === 'number' ? String(index).padStart(2, '0') : index;

  return (
    <li
      className={cn(
        'az-list-item',
        active && 'az-list-item--active',
        className,
      )}
      {...rest}
    >
      <div className="az-list-item__left">
        {variant === 'unnumbered' && <span className="az-list-item__bullet" aria-hidden="true" />}

        {variant !== 'unnumbered' && formattedIndex !== undefined && (
          <span
            className={cn(
              'az-list-item__index',
              variant === 'editorial' && formattedIndex === '01' && 'az-list-item__index--lead',
            )}
          >
            {formattedIndex}
          </span>
        )}

        {media && <div className="az-list-item__media">{media}</div>}

        <div className="az-list-item__text">
          <span className="az-list-item__title">{title}</span>
          {subtitle !== undefined && subtitle !== null && (
            <span className="az-list-item__subtitle">{subtitle}</span>
          )}
        </div>
      </div>

      {(meta !== undefined || action !== undefined) && (
        <div className="az-list-item__right">
          {meta !== undefined && meta !== null && (
            <span className="az-list-item__meta">{meta}</span>
          )}
          {action}
        </div>
      )}
    </li>
  );
}

