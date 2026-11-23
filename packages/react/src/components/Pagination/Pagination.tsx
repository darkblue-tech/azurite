import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import {
  ArrowBackIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type PaginationVariant = 'standard' | 'compact';
export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  variant?: PaginationVariant;
  size?: PaginationSize;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  formatPageLabel?: (page: number, totalPages: number) => ReactNode;
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

function buildPageTokens(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
  boundaryCount: number,
): PageToken[] {
  const safeTotal = Math.max(1, totalPages);
  const maxSlots = boundaryCount * 2 + siblingCount * 2 + 3;

  if (safeTotal <= maxSlots) {
    return Array.from({ length: safeTotal }, (_, i) => i + 1);
  }

  const edgeWindow = boundaryCount + siblingCount * 2 + 2;
  const tokens: PageToken[] = [];

  if (currentPage <= boundaryCount + siblingCount + 2) {
    for (let i = 1; i <= edgeWindow; i++) {
      tokens.push(i);
    }
    tokens.push('ellipsis-end');
    for (let i = safeTotal - boundaryCount + 1; i <= safeTotal; i++) {
      tokens.push(i);
    }
    return tokens;
  }

  if (currentPage >= safeTotal - (boundaryCount + siblingCount + 1)) {
    for (let i = 1; i <= boundaryCount; i++) {
      tokens.push(i);
    }
    tokens.push('ellipsis-start');
    for (let i = safeTotal - edgeWindow + 1; i <= safeTotal; i++) {
      tokens.push(i);
    }
    return tokens;
  }

  for (let i = 1; i <= boundaryCount; i++) {
    tokens.push(i);
  }
  tokens.push('ellipsis-start');
  for (let i = currentPage - siblingCount; i <= currentPage + siblingCount; i++) {
    tokens.push(i);
  }
  tokens.push('ellipsis-end');
  for (let i = safeTotal - boundaryCount + 1; i <= safeTotal; i++) {
    tokens.push(i);
  }
  return tokens;
}

/**
 * Swiss-calibrated pagination navigation supporting fixed-slot numeric pill sequences,
 * stable ellipsis range truncation, and centered compact Previous/Next layout.
 */
export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  variant = 'standard',
  size = 'md',
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  formatPageLabel,
  'aria-label': ariaLabel = 'Pagination',
  className,
  style,
  ...rest
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const [rawPage, setRawPage] = useControllableState<number>({
    value: page,
    defaultValue: Math.min(Math.max(1, defaultPage), safeTotal),
    onChange: onPageChange,
  });

  const currentPage = Math.min(Math.max(1, rawPage), safeTotal);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= safeTotal;

  const goTo = (next: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(1, next), safeTotal);
    if (clamped !== currentPage) setRawPage(clamped);
  };

  if (variant === 'compact') {
    return (
      <nav
        aria-label={ariaLabel}
        className={cn('az-pagination', 'az-pagination--compact', `az-pagination--${size}`, className)}
        style={style}
        {...rest}
      >
        <button
          type="button"
          className="az-pagination__compact-btn az-pagination__compact-btn--prev"
          disabled={disabled || isFirst}
          onClick={() => goTo(currentPage - 1)}
        >
          <ArrowBackIcon size={16} />
          <span>{prevLabel}</span>
        </button>

        <span className="az-pagination__compact-label">
          {formatPageLabel ? formatPageLabel(currentPage, safeTotal) : `Page ${currentPage}`}
        </span>

        <button
          type="button"
          className="az-pagination__compact-btn az-pagination__compact-btn--next"
          disabled={disabled || isLast}
          onClick={() => goTo(currentPage + 1)}
        >
          <span>{nextLabel}</span>
          <ArrowRightIcon size={16} />
        </button>
      </nav>
    );
  }

  const slotWidth =
    safeTotal >= 100
      ? size === 'sm' ? 34 : size === 'lg' ? 46 : 40
      : size === 'sm' ? 30 : size === 'lg' ? 42 : 36;

  const tokens = buildPageTokens(safeTotal, currentPage, siblingCount, boundaryCount);
  const navStyle: CSSProperties = {
    ['--az-pagination-slot-w' as string]: `${slotWidth}px`,
    ...style,
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('az-pagination', 'az-pagination--standard', `az-pagination--${size}`, className)}
      style={navStyle}
      {...rest}
    >
      <button
        type="button"
        aria-label={prevLabel}
        className="az-pagination__btn az-pagination__btn--nav"
        disabled={disabled || isFirst}
        onClick={() => goTo(currentPage - 1)}
      >
        <ChevronLeftIcon size={18} />
      </button>

      <div className="az-pagination__pages">
        {tokens.map((token) =>
          typeof token === 'string' ? (
            <span key={token} className="az-pagination__ellipsis" aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={token}
              type="button"
              disabled={disabled}
              aria-current={token === currentPage ? 'page' : undefined}
              className={cn(
                'az-pagination__btn',
                token === currentPage && 'az-pagination__btn--active',
              )}
              onClick={() => goTo(token)}
            >
              {token}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        aria-label={nextLabel}
        className="az-pagination__btn az-pagination__btn--nav"
        disabled={disabled || isLast}
        onClick={() => goTo(currentPage + 1)}
      >
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  );
}
