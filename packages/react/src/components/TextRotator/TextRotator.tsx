import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import type { TypographyVariant } from '../Typography/Typography';
import { cn } from '../../utils/cn';

export type TextRotatorVariant = 'default' | 'inline-pill';
export type TextRotatorTone = 'primary' | 'default' | 'tertiary';

export interface TextRotatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Ordered phrases to cycle through smoothly. */
  words: string[];
  /** Cycle cadence in milliseconds (default 2400). */
  intervalMs?: number;
  /** Out/in transition duration in milliseconds (default 260). */
  transitionMs?: number;
  /** Standalone text vs rounded pill badge suited for inline sentences. */
  variant?: TextRotatorVariant;
  /** Color tone role. */
  tone?: TextRotatorTone;
  /** Typography scale class. */
  typography?: TypographyVariant;
  /** Renders a subtle tabular `1 / N` index readout below the rotating word. */
  showCounter?: boolean;
  /** Pauses rotation while hovered. */
  pauseOnHover?: boolean;
  /** Programmatically pauses word cycling. */
  paused?: boolean;
  /** Callback fired after each word change. */
  onWordChange?: (index: number, word: string) => void;
}

/**
 * Animated word & phrase TextRotator supporting standalone headlines,
 * indexed 6-word cycles, and inline primary-container pills.
 */
export function TextRotator({
  words,
  intervalMs = 2400,
  transitionMs = 260,
  variant = 'default',
  tone = 'primary',
  typography,
  showCounter = false,
  pauseOnHover = true,
  paused = false,
  onWordChange,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TextRotatorProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [hovered, setHovered] = useState(false);

  const onWordChangeRef = useRef(onWordChange);
  onWordChangeRef.current = onWordChange;

  const wordsKey = words.join('\u0000');

  useEffect(() => {
    setIndex(0);
    setPhase('in');
  }, [wordsKey]);

  const isPaused = paused || (pauseOnHover && hovered) || words.length <= 1;

  useEffect(() => {
    if (isPaused) return;
    let swapTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setPhase('out');
      swapTimer = setTimeout(() => {
        setIndex((prev) => {
          const next = (prev + 1) % words.length;
          onWordChangeRef.current?.(next, words[next]);
          return next;
        });
        setPhase('in');
      }, transitionMs);
    }, intervalMs);

    return () => {
      clearInterval(interval);
      if (swapTimer) clearTimeout(swapTimer);
    };
  }, [isPaused, intervalMs, transitionMs, words]);

  const activeWord = words[index] ?? '';
  const slotNode = (
    <span
      className={cn(
        'az-rotator',
        phase === 'out' ? 'az-rotator--out' : 'az-rotator--in',
        variant === 'inline-pill' && 'az-rotator--inline-pill',
        `az-rotator--tone-${tone}`,
        typography && `az-text--${typography}`,
        !showCounter && className,
      )}
      style={{ '--az-rotator-ms': `${transitionMs}ms`, ...style } as CSSProperties}
      onMouseEnter={(e) => {
        if (pauseOnHover) setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (pauseOnHover) setHovered(false);
        onMouseLeave?.(e);
      }}
      {...(!showCounter ? rest : {})}
    >
      {activeWord}
    </span>
  );

  if (!showCounter) {
    return slotNode;
  }

  return (
    <span
      className={cn(
        'az-rotator-stack',
        variant === 'inline-pill' && 'az-rotator-stack--inline',
        className,
      )}
      {...rest}
    >
      {slotNode}
      <span className="az-rotator-counter">
        {index + 1} / {words.length}
      </span>
    </span>
  );
}

