import { useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type CountdownVariant =
  | 'digit'
  | 'digit-large'
  | 'letters'
  | 'colons'
  | 'side-labels'
  | 'bottom-labels'
  | 'boxed';

export interface CountdownLabels {
  hours?: string;
  minutes?: string;
  seconds?: string;
}

export interface CountdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Display layout mirroring all 7 Countdown variations from the spec sheet. */
  variant?: CountdownVariant;
  /** Initial countdown seconds (e.g. 59 or 12 * 3600 + 45 * 60 + 30). */
  seconds?: number;
  /** Optional target timestamp; when set, counts remaining seconds down to `targetDate`. */
  targetDate?: Date | number | string;
  /** Loops back to `loopResetSeconds ?? seconds` upon reaching zero. */
  loop?: boolean;
  /** Reset value used when `loop` triggers (defaults to initial `seconds`). */
  loopResetSeconds?: number;
  /** Pauses live second ticking. */
  paused?: boolean;
  /** Enables subtle 1.4s colon pulse for `colons` variant. */
  pulseColons?: boolean;
  /** Highlights seconds box in primary-container for `boxed` variant. */
  highlightSeconds?: boolean;
  /** Custom unit labels for letters/side-labels/bottom-labels/boxed modes. */
  labels?: CountdownLabels;
  /** Fires each second with remaining seconds. */
  onTick?: (remaining: number) => void;
  /** Fires when timer reaches zero (before looping if `loop` is true). */
  onComplete?: () => void;
}

function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}

function resolveInitialSeconds(seconds?: number, targetDate?: Date | number | string): number {
  if (targetDate !== undefined) {
    const targetMs =
      targetDate instanceof Date
        ? targetDate.getTime()
        : typeof targetDate === 'number'
          ? targetDate
          : Date.parse(targetDate);
    return Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
  }
  return Math.max(0, Math.floor(seconds ?? 59));
}

/**
 * Real-time tabular numeral Countdown timer supporting 2-digit readouts and
 * 5 structured clock presentations (letters, pulsing colons, side labels, bottom labels, boxed cards).
 */
export function Countdown({
  variant = 'colons',
  seconds,
  targetDate,
  loop = false,
  loopResetSeconds,
  paused = false,
  pulseColons = true,
  highlightSeconds = true,
  labels,
  onTick,
  onComplete,
  className,
  ...rest
}: CountdownProps) {
  const [remaining, setRemaining] = useState<number>(() =>
    resolveInitialSeconds(seconds, targetDate),
  );

  useEffect(() => {
    setRemaining(resolveInitialSeconds(seconds, targetDate));
  }, [seconds, targetDate]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      if (targetDate !== undefined) {
        const next = resolveInitialSeconds(undefined, targetDate);
        setRemaining(next);
        onTick?.(next);
        if (next === 0) onComplete?.();
        return;
      }

      setRemaining((prev) => {
        if (prev > 0) {
          const next = prev - 1;
          onTick?.(next);
          if (next === 0) onComplete?.();
          return next;
        }
        if (loop) {
          const resetTo = Math.max(0, Math.floor(loopResetSeconds ?? seconds ?? 59));
          onTick?.(resetTo);
          return resetTo;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, targetDate, loop, loopResetSeconds, seconds, onTick, onComplete]);

  if (variant === 'digit' || variant === 'digit-large') {
    return (
      <div
        role="timer"
        aria-live="off"
        className={cn('az-countdown', `az-countdown--${variant}`, className)}
        {...rest}
      >
        <span>{pad2(remaining)}</span>
      </div>
    );
  }

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  if (variant === 'letters') {
    const hLbl = labels?.hours ?? 'H';
    const mLbl = labels?.minutes ?? 'M';
    const sLbl = labels?.seconds ?? 'S';
    return (
      <div role="timer" aria-live="off" className={cn('az-countdown', 'az-countdown--letters', className)} {...rest}>
        <span className="az-countdown__unit-letters">
          <span className="az-countdown__num">{pad2(h)}</span>
          <span className="az-countdown__letter">{hLbl}</span>
        </span>
        <span className="az-countdown__unit-letters">
          <span className="az-countdown__num">{pad2(m)}</span>
          <span className="az-countdown__letter">{mLbl}</span>
        </span>
        <span className="az-countdown__unit-letters">
          <span className="az-countdown__num">{pad2(s)}</span>
          <span className="az-countdown__letter">{sLbl}</span>
        </span>
      </div>
    );
  }

  if (variant === 'colons') {
    const colonClass = cn('az-countdown__colon', pulseColons && 'az-countdown__colon--pulse');
    return (
      <div role="timer" aria-live="off" className={cn('az-countdown', 'az-countdown--colons', className)} {...rest}>
        <span className="az-countdown__num">{pad2(h)}</span>
        <span className={colonClass} aria-hidden="true">:</span>
        <span className="az-countdown__num">{pad2(m)}</span>
        <span className={colonClass} aria-hidden="true">:</span>
        <span className="az-countdown__num">{pad2(s)}</span>
      </div>
    );
  }

  if (variant === 'side-labels') {
    const hLbl = labels?.hours ?? 'hrs';
    const mLbl = labels?.minutes ?? 'min';
    const sLbl = labels?.seconds ?? 'sec';
    return (
      <div role="timer" aria-live="off" className={cn('az-countdown', 'az-countdown--side-labels', className)} {...rest}>
        <div className="az-countdown__unit-side">
          <span className="az-countdown__num">{pad2(h)}</span>
          <span className="az-countdown__side-label">{hLbl}</span>
        </div>
        <div className="az-countdown__unit-side">
          <span className="az-countdown__num">{pad2(m)}</span>
          <span className="az-countdown__side-label">{mLbl}</span>
        </div>
        <div className="az-countdown__unit-side">
          <span className="az-countdown__num">{pad2(s)}</span>
          <span className="az-countdown__side-label">{sLbl}</span>
        </div>
      </div>
    );
  }

  const hLbl = labels?.hours ?? 'Hours';
  const mLbl = labels?.minutes ?? 'Minutes';
  const sLbl = labels?.seconds ?? 'Seconds';

  if (variant === 'bottom-labels') {
    return (
      <div role="timer" aria-live="off" className={cn('az-countdown', 'az-countdown--bottom-labels', className)} {...rest}>
        <div className="az-countdown__unit-bottom">
          <span className="az-countdown__num">{pad2(h)}</span>
          <span className="az-countdown__side-label">{hLbl}</span>
        </div>
        <div className="az-countdown__unit-bottom">
          <span className="az-countdown__num">{pad2(m)}</span>
          <span className="az-countdown__side-label">{mLbl}</span>
        </div>
        <div className="az-countdown__unit-bottom">
          <span className="az-countdown__num">{pad2(s)}</span>
          <span className="az-countdown__side-label">{sLbl}</span>
        </div>
      </div>
    );
  }

  return (
    <div role="timer" aria-live="off" className={cn('az-countdown', 'az-countdown--boxed', className)} {...rest}>
      <div className="az-countdown__box">
        <span className="az-countdown__num">{pad2(h)}</span>
        <span className="az-countdown__box-label">{hLbl}</span>
      </div>
      <div className="az-countdown__box">
        <span className="az-countdown__num">{pad2(m)}</span>
        <span className="az-countdown__box-label">{mLbl}</span>
      </div>
      <div className={cn('az-countdown__box', highlightSeconds && 'az-countdown__box--highlight')}>
        <span className="az-countdown__num">{pad2(s)}</span>
        <span className="az-countdown__box-label">{sLbl}</span>
      </div>
    </div>
  );
}

