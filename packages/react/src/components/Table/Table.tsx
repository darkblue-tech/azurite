import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { ArrowDownwardIcon, ArrowUpwardIcon, UnfoldMoreIcon } from '../../icons';
import { cn } from '../../utils/cn';

export type TableSurface = 'plain' | 'tonal' | 'outlined';
export type TableDensity = 'compact' | 'default' | 'spacious';
export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc' | 'none';
export type TableCellEmphasis = 'default' | 'title' | 'muted' | 'primary' | 'headline';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  surface?: TableSurface;
  density?: TableDensity;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  caption?: ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
}

/**
 * Structured editorial data table across 3 tonal surface treatments, 3 density presets,
 * zebra striping, active/hover row highlight states, and sortable column headers.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    surface = 'plain',
    density = 'default',
    striped = false,
    hoverable = false,
    stickyHeader = false,
    caption,
    wrapperClassName,
    wrapperStyle,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={cn(
        'az-table-wrap',
        `az-table-wrap--${surface}`,
        striped && 'az-table-wrap--striped',
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      <table
        ref={ref}
        className={cn(
          'az-table',
          `az-table--density-${density}`,
          striped && 'az-table--striped',
          hoverable && 'az-table--hoverable',
          stickyHeader && 'az-table--sticky-header',
          className,
        )}
        {...rest}
      >
        {caption !== undefined && <caption className="az-table__caption">{caption}</caption>}
        {children}
      </table>
    </div>
  );
});

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHead(props, ref) {
    return <thead ref={ref} {...props} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody(props, ref) {
    return <tbody ref={ref} {...props} />;
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter(props, ref) {
    return <tfoot ref={ref} {...props} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  active?: boolean;
  interactive?: boolean;
}

/** Table row supporting active highlight fill and pointer interaction. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { active = false, interactive = false, className, ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={active || undefined}
      className={cn(
        'az-table__row',
        (interactive || rest.onClick !== undefined) && 'az-table__row--interactive',
        active && 'az-table__row--active',
        className,
      )}
      {...rest}
    />
  );
});

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

/** Table header cell with alignment and optional interactive sort control. */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    {
      align = 'left',
      sortable = false,
      sortDirection = 'none',
      onSort,
      scope = 'col',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const ariaSort =
      sortable && sortDirection !== 'none'
        ? sortDirection === 'asc'
          ? 'ascending'
          : 'descending'
        : undefined;

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={ariaSort}
        className={cn('az-table__th', `az-table__align-${align}`, className)}
        {...rest}
      >
        {sortable ? (
          <button type="button" className="az-table__sort-btn" onClick={onSort}>
            <span>{children}</span>
            {sortDirection === 'asc' ? (
              <ArrowUpwardIcon size={14} />
            ) : sortDirection === 'desc' ? (
              <ArrowDownwardIcon size={14} />
            ) : (
              <UnfoldMoreIcon size={14} />
            )}
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
  numeric?: boolean;
  emphasis?: TableCellEmphasis;
}

/** Table data cell with tabular numerals and typographic emphasis variants. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = 'left', numeric = false, emphasis = 'default', className, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(
        'az-table__cell',
        `az-table__align-${align}`,
        numeric && 'az-table__cell--numeric',
        `az-table__cell--${emphasis}`,
        className,
      )}
      {...rest}
    />
  );
});

