import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type TooltipTone =
  | 'inverse'
  | 'primary'
  | 'primary-container'
  | 'tertiary'
  | 'secondary'
  | 'error'
  | 'surface';

export type TooltipSize = 'sm' | 'md';
export type TooltipVariant = 'plain' | 'rich';

export interface TooltipProps {
  content?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  placement?: TooltipPlacement;
  tone?: TooltipTone;
  size?: TooltipSize;
  variant?: TooltipVariant;
  offset?: number;
  crossOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  alwaysOpen?: boolean;
  pinOnClick?: boolean;
  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  inline?: boolean;
  delay?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  bubbleClassName?: string;
  bubbleStyle?: CSSProperties;
  children?: ReactNode;
}

/**
 * Contextual directional and rich tooltip across 8 placements, 7 semantic surface roles,
 * optional hover delay, and click-to-pin support.
 */
export function Tooltip({
  content,
  title,
  description,
  icon,
  iconPosition = 'start',
  placement = 'top',
  tone = 'inverse',
  size = 'md',
  variant,
  offset = 6,
  crossOffset = 0,
  open,
  defaultOpen = false,
  onOpenChange,
  alwaysOpen = false,
  pinOnClick = false,
  pinned,
  defaultPinned = false,
  onPinnedChange,
  inline = false,
  delay = 0,
  disabled = false,
  className,
  style,
  bubbleClassName,
  bubbleStyle,
  children,
}: TooltipProps) {
  const bubbleId = useId();
  const timerRef = useRef<number | null>(null);
  const [hoveredOrFocused, setHoveredOrFocused] = useState(false);

  const [controlledOpen, setControlledOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [isPinned, setIsPinned] = useControllableState<boolean>({
    value: pinned,
    defaultValue: defaultPinned,
    onChange: onPinnedChange,
  });

  const resolvedVariant: TooltipVariant =
    variant ?? (title !== undefined && description !== undefined ? 'rich' : 'plain');

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const showWithDelay = useCallback(() => {
    if (disabled) return;
    clearTimer();
    if (delay > 0) {
      timerRef.current = window.setTimeout(() => {
        setHoveredOrFocused(true);
        setControlledOpen(true);
      }, delay);
    } else {
      setHoveredOrFocused(true);
      setControlledOpen(true);
    }
  }, [clearTimer, delay, disabled, setControlledOpen]);

  const hideNow = useCallback(() => {
    clearTimer();
    setHoveredOrFocused(false);
    setControlledOpen(false);
  }, [clearTimer, setControlledOpen]);

  const handleClick = useCallback(() => {
    if (disabled || !pinOnClick) return;
    setIsPinned(!isPinned);
  }, [disabled, isPinned, pinOnClick, setIsPinned]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Escape') {
        if (isPinned) setIsPinned(false);
        hideNow();
      }
    },
    [hideNow, isPinned, setIsPinned],
  );

  const isInline = inline || children === undefined;

  const bubbleClasses = cn(
    'az-tooltip__bubble',
    `az-tooltip__bubble--${size}`,
    `az-tooltip__bubble--tone-${tone}`,
    resolvedVariant === 'rich' && 'az-tooltip__bubble--rich',
    isInline ? 'az-tooltip__bubble--inline' : `az-tooltip__bubble--${placement}`,
    bubbleClassName,
  );

  const bubbleContent =
    resolvedVariant === 'rich' ? (
      <>
        {icon && <span className="az-tooltip__icon" aria-hidden="true">{icon}</span>}
        <span className="az-tooltip__body">
          {title !== undefined && <span className="az-tooltip__title">{title}</span>}
          {description !== undefined && (
            <span className="az-tooltip__description">{description}</span>
          )}
          {title === undefined && description === undefined && content}
        </span>
      </>
    ) : (
      <>
        {icon && iconPosition === 'start' && (
          <span className="az-tooltip__icon" aria-hidden="true">{icon}</span>
        )}
        {title !== undefined ? <span className="az-tooltip__title">{title}</span> : content}
        {icon && iconPosition === 'end' && (
          <span className="az-tooltip__icon" aria-hidden="true">{icon}</span>
        )}
      </>
    );

  if (isInline) {
    return (
      <div
        id={bubbleId}
        role="tooltip"
        className={cn(bubbleClasses, className)}
        style={{ ...bubbleStyle, ...style }}
      >
        {bubbleContent}
      </div>
    );
  }

  const isControlled = open !== undefined;
  const isVisible =
    !disabled &&
    (alwaysOpen || isPinned || (isControlled ? Boolean(controlledOpen) : hoveredOrFocused));
  const useCssHover = !disabled && !isControlled && delay === 0;

  return (
    <span
      className={cn('az-tooltip', useCssHover && 'az-tooltip--css-hover', className)}
      data-open={isVisible ? 'true' : 'false'}
      data-pinned={!disabled && isPinned ? 'true' : 'false'}
      style={{
        ['--az-tooltip-offset' as string]: `${offset}px`,
        ['--az-tooltip-cross-offset' as string]: `${crossOffset}px`,
        ...style,
      }}
      onMouseEnter={showWithDelay}
      onMouseLeave={hideNow}
      onFocus={showWithDelay}
      onBlur={hideNow}
      onKeyDown={handleKeyDown}
    >
      <span
        className="az-tooltip__trigger"
        aria-describedby={!disabled ? bubbleId : undefined}
        onClick={handleClick}
      >
        {children}
      </span>
      {!disabled && (
        <span
          id={bubbleId}
          role="tooltip"
          className={bubbleClasses}
          style={bubbleStyle}
        >
          {bubbleContent}
        </span>
      )}
    </span>
  );
}

