import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { TypographyVariant } from '../Typography/Typography';
import { cn } from '../../utils/cn';

export type SkeletonVariant = 'rect' | 'rounded' | 'circle' | 'pill' | 'text';
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Geometric shape preset. */
  variant?: SkeletonVariant;
  /** Animation treatment ('pulse' | 'shimmer' | 'none'). */
  animation?: SkeletonAnimation;
  /** Width in px or CSS length. */
  width?: number | string;
  /** Height in px or CSS length. */
  height?: number | string;
  /** Optional custom border-radius override. */
  radius?: number | string;
  /** Renders stacked text placeholder lines when variant === 'text' and lines > 1. */
  lines?: number;
}

function toCssLen(v?: number | string): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

/**
 * Structural loading placeholder supporting circular avatars, pill triggers,
 * rounded frames, and multi-line shimmering copy blocks.
 */
export function Skeleton({
  variant = 'rounded',
  animation = 'pulse',
  width,
  height,
  radius,
  lines = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cn('az-skeleton-lines', className)} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }, (_, idx) => (
          <div
            key={idx}
            className={cn(
              'az-skeleton',
              `az-skeleton--${variant}`,
              animation !== 'none' && `az-skeleton--${animation}`,
            )}
            style={{
              width: idx === lines - 1 ? '78%' : toCssLen(width) ?? '100%',
              height: toCssLen(height) ?? '12px',
              ...(radius !== undefined ? { borderRadius: toCssLen(radius) } : {}),
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'az-skeleton',
        `az-skeleton--${variant}`,
        animation !== 'none' && `az-skeleton--${animation}`,
        className,
      )}
      style={{
        ...(width !== undefined ? { width: toCssLen(width) } : {}),
        ...(height !== undefined ? { height: toCssLen(height) } : {}),
        ...(radius !== undefined ? { borderRadius: toCssLen(radius) } : {}),
        ...style,
      }}
      {...rest}
    />
  );
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status phrase animated character by character (e.g. "AI is thinking"). */
  text: string;
  /** Calibrated Typography token scale. */
  typography?: TypographyVariant;
  /** Per-character animation delay stagger in ms (default 55). */
  staggerMs?: number;
  /** Full wave loop duration in ms (default 2200). */
  durationMs?: number;
}

/**
 * Material Design 3 Expressive spring-pulsed wave animating organically across
 * each character of live status typography.
 */
export function SkeletonText({
  text,
  typography = 'body-md',
  staggerMs = 55,
  durationMs = 2200,
  className,
  style,
  ...rest
}: SkeletonTextProps) {
  let charIndex = 0;

  return (
    <span
      aria-label={text}
      className={cn(
        'az-skeleton-expressive',
        `az-text--${typography}`,
        className,
      )}
      style={
        {
          '--az-char-stagger': `${staggerMs}ms`,
          '--az-char-duration': `${durationMs}ms`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {Array.from(text).map((ch, idx) => {
        if (ch === ' ') {
          return (
            <span key={idx} className="az-skeleton-space" aria-hidden="true">
              &nbsp;
            </span>
          );
        }
        const i = charIndex++;
        return (
          <span
            key={idx}
            className="az-skeleton-char"
            aria-hidden="true"
            style={{ '--az-char-i': i } as CSSProperties}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export type SkeletonCardPreset = 'media' | 'profile' | 'metric';

export interface SkeletonCardProps extends HTMLAttributes<HTMLElement> {
  preset?: SkeletonCardPreset;
}

/**
 * Precomposed 24px card skeleton layouts for Media, Profile, and Metric modules.
 */
export function SkeletonCard({ preset = 'media', className, ...rest }: SkeletonCardProps) {
  if (preset === 'profile') {
    return (
      <article
        aria-busy="true"
        aria-label="Profile card loading"
        className={cn('az-skeleton-card', 'az-skeleton-card--profile', className)}
        {...rest}
      >
        <div className="az-skeleton-card__section">
          <Skeleton variant="circle" width={64} height={64} />
          <Skeleton variant="pill" animation="shimmer" width={128} height={16} />
          <Skeleton variant="pill" width={96} height={12} />
          <div style={{ width: '100%', paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Skeleton variant="pill" width="100%" height={12} />
            <Skeleton variant="pill" width="80%" height={12} />
          </div>
        </div>
        <div className="az-skeleton-card__row">
          <Skeleton variant="pill" animation="shimmer" width="100%" height={36} style={{ flex: 1 }} />
          <Skeleton variant="pill" width="100%" height={36} style={{ flex: 1 }} />
        </div>
      </article>
    );
  }

  if (preset === 'metric') {
    return (
      <article
        aria-busy="true"
        aria-label="Metric card loading"
        className={cn('az-skeleton-card', className)}
        {...rest}
      >
        <div className="az-skeleton-card__section">
          <div className="az-skeleton-card__row">
            <Skeleton variant="pill" width={80} height={12} />
            <Skeleton variant="circle" width={32} height={32} />
          </div>
          <Skeleton variant="rounded" animation="shimmer" width={112} height={40} radius="var(--az-radius-md)" />
          <Skeleton variant="pill" width={144} height={12} />
        </div>
        <Skeleton variant="rounded" animation="shimmer" width="100%" height={80} radius="var(--az-radius-md)" />
      </article>
    );
  }

  return (
    <article
      aria-busy="true"
      aria-label="Media card loading"
      className={cn('az-skeleton-card', className)}
      {...rest}
    >
      <div className="az-skeleton-card__section">
        <Skeleton variant="rounded" animation="shimmer" width="100%" height={144} radius="var(--az-radius-md)" />
        <Skeleton variant="pill" animation="shimmer" width="75%" height={20} />
        <Skeleton variant="text" lines={2} />
      </div>
      <Skeleton variant="pill" width={112} height={40} />
    </article>
  );
}

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  fallback?: ReactNode;
  children?: ReactNode;
}

/**
 * Accessible loading boundary wrapping skeleton groups or switching seamlessly to live children.
 */
export function SkeletonGroup({
  loading = true,
  fallback,
  children,
  className,
  ...rest
}: SkeletonGroupProps) {
  if (!loading) {
    return <>{children}</>;
  }
  return (
    <div
      role="status"
      aria-busy="true"
      className={className}
      {...rest}
    >
      {fallback ?? children}
    </div>
  );
}

