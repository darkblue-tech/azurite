import {
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export interface DiffProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Content revealed on the left/before side of the split handle. */
  before: ReactNode;
  /** Content shown on the right/after side of the split handle. */
  after: ReactNode;
  /** Controlled split percentage (within min..max). */
  value?: number;
  /** Initial uncontrolled split percentage (default 50). */
  defaultValue?: number;
  /** Fires whenever split percentage changes via drag, click, or keyboard. */
  onChange?: (percentage: number) => void;
  /** Minimum split percentage (default 5). */
  min?: number;
  /** Maximum split percentage (default 95). */
  max?: number;
  /** Arrow-key step percentage (default 4). */
  step?: number;
  /** CSS aspect-ratio for the comparison frame (default '16 / 9'). */
  aspectRatio?: string;
  /** Optional minimum height in px or CSS length. */
  minHeight?: number | string;
  /** Optional header caption (e.g. "Primary vs. Tonal Surface"). */
  caption?: ReactNode;
  /** Displays caption header & live tabular percentage readout. */
  showHeader?: boolean;
  /** Uses high-contrast surface line for photographic/image comparisons. */
  contrastDivider?: boolean;
  /** Accessible slider label. */
  ariaLabel?: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Side-by-side interactive before/after Diff comparator for typography and media,
 * driven by pointer capture, click-to-scrub, and an iconless pill slider handle.
 */
export function Diff({
  before,
  after,
  value,
  defaultValue = 50,
  onChange,
  min = 5,
  max = 95,
  step = 4,
  aspectRatio = '16 / 9',
  minHeight,
  caption,
  showHeader = true,
  contrastDivider = false,
  ariaLabel = 'Comparison slider',
  className,
  style,
  ...rest
}: DiffProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const [pct, setPct] = useControllableState<number>({
    value,
    defaultValue,
    onChange,
  });

  const clampedPct = clamp(pct, min, max);

  const updateFromClientX = (clientX: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const rounded = Number(clamp(raw, min, max).toFixed(1));
    setPct(rounded);
  };

  const handleStagePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handleStagePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handleStagePointerEnd = () => {
    setDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.shiftKey ? 1 : step;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPct(clamp(clampedPct - delta, min, max));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPct(clamp(clampedPct + delta, min, max));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPct(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPct(max);
    }
  };

  return (
    <div className={cn('az-diff', dragging && 'az-diff--dragging', className)} {...rest}>
      {showHeader && (
        <div className="az-diff__header">
          <span className="az-diff__labels">{caption}</span>
          <span className="az-diff__readout">{Math.round(clampedPct)}%</span>
        </div>
      )}

      <div
        ref={stageRef}
        className="az-diff__stage"
        style={
          {
            '--az-diff-pos': `${clampedPct}%`,
            aspectRatio,
            ...(minHeight !== undefined
              ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
              : {}),
            ...style,
          } as CSSProperties
        }
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerEnd}
        onPointerCancel={handleStagePointerEnd}
      >
        <div className="az-diff__after">{after}</div>
        <div className="az-diff__before">{before}</div>

        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Math.round(clampedPct)}
          className={cn('az-diff__bar', contrastDivider && 'az-diff__bar--contrast')}
          onKeyDown={handleKeyDown}
        >
          <div className="az-diff__capsule" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

