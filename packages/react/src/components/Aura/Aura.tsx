import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import type { AzuriteSize } from '../../types';
import { cn } from '../../utils/cn';

export type AuraVariant = 'single' | 'dual' | 'rainbow' | 'wide';
export type AuraPreset = 'azure' | 'emerald' | 'violet' | 'amber' | 'rainbow';
export type AuraSpeed = 'fast' | 'standard' | 'slow' | 'ambient';
export type AuraRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full' | (string & {});

const BASE_DURATION_MS = 4000;

const SPEED_DURATION_MS: Record<AuraSpeed, number> = {
  fast: 1500,
  standard: 4000,
  slow: 8000,
  ambient: 12000,
};

const VARIANT_DEFAULT_MS: Record<AuraVariant, number> = {
  single: 4000,
  dual: 4500,
  rainbow: 5000,
  wide: 4000,
};

const STANDARD_RADII = new Set(['sm', 'md', 'lg', 'xl', 'full']);

function parseDurationMs(value: string | number): number {
  if (typeof value === 'number') return Math.max(200, value);
  const trimmed = value.trim().toLowerCase();
  if (trimmed.endsWith('ms')) {
    const n = parseFloat(trimmed);
    return Number.isFinite(n) && n > 0 ? n : BASE_DURATION_MS;
  }
  if (trimmed.endsWith('s')) {
    const n = parseFloat(trimmed);
    return Number.isFinite(n) && n > 0 ? n * 1000 : BASE_DURATION_MS;
  }
  const n = parseFloat(trimmed);
  return Number.isFinite(n) && n > 0 ? n : BASE_DURATION_MS;
}

export interface AuraProps extends HTMLAttributes<HTMLDivElement> {
  /** Orbital beam geometry variant. */
  variant?: AuraVariant;
  /** Thematic conic gradient color preset. */
  preset?: AuraPreset;
  /** Border thickness scale: xs (1px), sm (1.5px), md (2px), lg (3px), xl (4px). */
  size?: AzuriteSize;
  /** Semantic orbital speed preset. */
  speed?: AuraSpeed;
  /** Custom animation duration (e.g. '3.5s' or number in ms). Overrides `speed`. */
  duration?: string | number;
  /** Border radius token ('sm' | 'md' | 'lg' | 'xl' | 'full') or custom CSS length. */
  radius?: AuraRadius;
  /** Custom CSS gradient expression for the orbiting beam. */
  gradient?: string;
  /** Shrink-wraps inline content such as pill buttons and badges. */
  inline?: boolean;
  /** Renders the soft outer blurred glow halo behind the crisp ring. */
  glow?: boolean;
  /** Opacity of the blurred outer glow layer (default 0.38). */
  glowOpacity?: number;
  /** Pauses orbital animation when true. */
  paused?: boolean;
  /** Class name applied to the inner foreground wrapper. */
  innerClassName?: string;
  /** Inline style applied to the inner foreground wrapper. */
  innerStyle?: CSSProperties;
  children?: ReactNode;
}

/**
 * Animated conic-gradient orbital border-light wrapper engineered to highlight
 * priority cards, containers, and pill triggers. Uses smooth Web Animations
 * playback-rate ramping so speed transitions never snap or jump angle.
 */
export function Aura({
  variant = 'single',
  preset,
  size = 'md',
  speed,
  duration,
  radius = 'xl',
  gradient,
  inline = false,
  glow = true,
  glowOpacity,
  paused = false,
  innerClassName,
  innerStyle,
  className,
  style,
  children,
  ...rest
}: AuraProps) {
  const ringBeamRef = useRef<HTMLSpanElement | null>(null);
  const glowBeamRef = useRef<HTMLSpanElement | null>(null);

  const resolvedPreset: AuraPreset =
    preset ?? (variant === 'rainbow' ? 'rainbow' : 'azure');

  const resolvedMs =
    duration !== undefined
      ? parseDurationMs(duration)
      : speed
        ? SPEED_DURATION_MS[speed]
        : VARIANT_DEFAULT_MS[variant];

  const targetRate = BASE_DURATION_MS / Math.max(200, resolvedMs);

  // Single clean updatePlaybackRate per change keeps orbital phase intact with zero compositor jitter
  useEffect(() => {
    const targets = [ringBeamRef.current, glowBeamRef.current].filter(
      (el): el is HTMLSpanElement => el !== null && typeof el.getAnimations === 'function',
    );
    for (const el of targets) {
      for (const anim of el.getAnimations()) {
        try {
          anim.updatePlaybackRate(targetRate);
        } catch {
          anim.playbackRate = targetRate;
        }
      }
    }
  }, [targetRate, glow, variant]);

  const isStandardRadius = STANDARD_RADII.has(radius);

  const customVars: CSSProperties = {
    '--az-aura-duration': `${resolvedMs}ms`,
    ...(!isStandardRadius ? { '--az-aura-radius': radius } : {}),
    ...(gradient ? { '--az-aura-gradient': gradient } : {}),
    ...(glowOpacity !== undefined ? { '--az-aura-glow-opacity': glowOpacity } : {}),
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn(
        'az-aura-frame',
        `az-aura-frame--${variant}`,
        resolvedPreset !== 'azure' && `az-aura-frame--preset-${resolvedPreset}`,
        `az-aura-frame--${size}`,
        isStandardRadius && `az-aura-frame--radius-${radius}`,
        inline && 'az-aura-frame--inline',
        paused && 'az-aura-frame--paused',
        className,
      )}
      style={customVars}
      {...rest}
    >
      {glow && (
        <span className="az-aura-frame__glow" aria-hidden="true">
          <span ref={glowBeamRef} className="az-aura-frame__beam" />
        </span>
      )}
      <span className="az-aura-frame__ring" aria-hidden="true">
        <span ref={ringBeamRef} className="az-aura-frame__beam" />
      </span>
      <div className={cn('az-aura-frame__inner', innerClassName)} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
