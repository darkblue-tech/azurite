import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import type { AzuriteSize } from '../../types';
import { cn } from '../../utils/cn';
import { Avatar, type AvatarProps, type AvatarShape } from './Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  total?: number;
  showOverflow?: boolean;
  size?: AzuriteSize | number;
  shape?: AvatarShape;
  overlap?: 'sm' | 'md' | 'lg';
  renderOverflow?: (count: number) => ReactNode;
}

/**
 * Overlapping horizontal avatar stack with automatic `+N` overflow counter.
 */
export function AvatarGroup({
  max,
  total,
  showOverflow = true,
  size = 'md',
  shape = 'circle',
  overlap = 'md',
  renderOverflow,
  className,
  children,
  ...rest
}: AvatarGroupProps) {
  const items = Children.toArray(children).filter(Boolean);
  const visibleCount = max !== undefined ? Math.min(max, items.length) : items.length;
  const visibleItems = items.slice(0, visibleCount);
  const computedTotal = total ?? items.length;
  const overflowCount = showOverflow ? Math.max(0, computedTotal - visibleCount) : 0;

  return (
    <div
      role="group"
      className={cn(
        'az-avatar-group',
        `az-avatar-group--overlap-${overlap}`,
        shape === 'squircle' && 'az-avatar-group--squircle',
        className,
      )}
      {...rest}
    >
      {visibleItems.map((child, index) => {
        const rendered = isValidElement<AvatarProps>(child)
          ? cloneElement(child, {
              size: child.props.size ?? size,
              shape: child.props.shape ?? shape,
            })
          : child;

        return (
          <span key={isValidElement(child) && child.key !== null ? child.key : index} className="az-avatar-group__item">
            {rendered}
          </span>
        );
      })}

      {overflowCount > 0 && (
        <span className="az-avatar-group__item">
          {renderOverflow ? (
            renderOverflow(overflowCount)
          ) : (
            <Avatar
              size={size}
              shape={shape}
              tone="primary-container"
              initials={`+${overflowCount}`}
              alt={`${overflowCount} more`}
            />
          )}
        </span>
      )}
    </div>
  );
}

