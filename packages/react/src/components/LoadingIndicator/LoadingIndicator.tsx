import type { CSSProperties, HTMLAttributes } from 'react';
import type { AzuriteSize, AzuriteTone } from '../../types';
import { cn } from '../../utils/cn';

export type LoadingVariant =
  | 'spinner'
  | 'dots'
  | 'circles'
  | 'balls'
  | 'bars'
  | 'pulse-wave'
  | 'expanding-ring'
  | 'spokes';

export type LoadingSize = AzuriteSize | number;

export type LoadingTone = 'current' | Extract<
  AzuriteTone,
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'success' | 'warning' | 'error'
>;

export interface LoadingIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: LoadingVariant;
  size?: LoadingSize;
  tone?: LoadingTone;
  speed?: number;
  paused?: boolean;
  label?: string;
}

const SIZE_PX: Record<AzuriteSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 44,
  xl: 56,
};

function getSpinnerStrokeWidth(px: number): number {
  if (px <= 18) return 3;
  if (px <= 26) return 2.5;
  if (px <= 36) return 2.25;
  if (px <= 48) return 2;
  return 1.75;
}

/**
 * Animated loading indicator supporting 8 kinetic primitives across 5 calibrated scales (or custom px),
 * semantic accent tones, variable speed multiplier, and playback pause state.
 */
export function LoadingIndicator({
  variant = 'spinner',
  size = 'md',
  tone = 'current',
  speed = 1,
  paused = false,
  label = 'Loading',
  className,
  style,
  ...rest
}: LoadingIndicatorProps) {
  const numericPx = typeof size === 'number' ? size : SIZE_PX[size];
  const strokeWidth = getSpinnerStrokeWidth(numericPx);
  const speedMult = 1 / Math.max(speed, 0.1);

  const customStyle: CSSProperties = {
    ...(typeof size === 'number' ? { fontSize: size } : {}),
    ['--az-loader-speed-mult' as string]: speedMult,
    ['--az-loader-play-state' as string]: paused ? 'paused' : 'running',
    ...style,
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'az-loader',
        typeof size !== 'number' && `az-loader--${size}`,
        `az-loader--tone-${tone}`,
        className,
      )}
      style={customStyle}
      {...rest}
    >
      {variant === 'spinner' && (
        <svg className="az-loader__svg az-loader__spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth={strokeWidth} />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      )}

      {variant === 'dots' && (
        <span className="az-loader__dots" aria-hidden="true">
          <span className="az-loader__dot az-loader__dot--1" />
          <span className="az-loader__dot az-loader__dot--2" />
          <span className="az-loader__dot az-loader__dot--3" />
        </span>
      )}

      {variant === 'circles' && (
        <span className="az-loader__circles" aria-hidden="true">
          <span className="az-loader__circle-outer" />
          <span className="az-loader__circle-inner" />
        </span>
      )}

      {variant === 'balls' && (
        <span className="az-loader__balls" aria-hidden="true">
          <span className="az-loader__ball az-loader__ball--1" />
          <span className="az-loader__ball az-loader__ball--2" />
          <span className="az-loader__ball az-loader__ball--3" />
        </span>
      )}

      {variant === 'bars' && (
        <span className="az-loader__bars" aria-hidden="true">
          <span className="az-loader__bar az-loader__bar--1" />
          <span className="az-loader__bar az-loader__bar--2" />
          <span className="az-loader__bar az-loader__bar--3" />
          <span className="az-loader__bar az-loader__bar--4" />
        </span>
      )}

      {variant === 'pulse-wave' && (
        <span className="az-loader__wave-wrap" aria-hidden="true">
          <span className="az-loader__wave az-loader__wave--1" />
          <span className="az-loader__wave az-loader__wave--2" />
          <span className="az-loader__wave-core" />
        </span>
      )}

      {variant === 'expanding-ring' && (
        <span className="az-loader__ring-wrap" aria-hidden="true">
          <span className="az-loader__ring az-loader__ring--1" />
          <span className="az-loader__ring az-loader__ring--2" />
        </span>
      )}

      {variant === 'spokes' && (
        <svg className="az-loader__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="11" y="2" width="2" height="5" rx="1" className="az-loader__spoke-1" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(45 12 12)" className="az-loader__spoke-2" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(90 12 12)" className="az-loader__spoke-3" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(135 12 12)" className="az-loader__spoke-4" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(180 12 12)" className="az-loader__spoke-5" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(225 12 12)" className="az-loader__spoke-6" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(270 12 12)" className="az-loader__spoke-7" />
          <rect x="11" y="2" width="2" height="5" rx="1" transform="rotate(315 12 12)" className="az-loader__spoke-8" />
        </svg>
      )}
    </span>
  );
}
