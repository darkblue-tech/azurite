import {
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 'grid' uses pure CSS 9-zone hover tilt; 'pointer' uses continuous cursor tilt without blocking clicks inside. */
  mode?: 'grid' | 'pointer';
  /** Aspect ratio (default '1.586 / 1' standard ISO ID-1 banking card ratio). */
  aspectRatio?: string;
  /** Maximum tilt degrees for `mode="pointer"` (default 6). */
  maxTilt?: number;
  /** 3D perspective distance in px (default 1200). */
  perspective?: number;
  /** Enables radial hover glare highlight overlay (default true). */
  glare?: boolean;
  /** Optional className applied to inner surface article. */
  cardClassName?: string;
  /** Optional style applied to inner surface article. */
  cardStyle?: CSSProperties;
  children?: ReactNode;
}

/**
 * Interactive 3D perspective TiltCard supporting pure CSS 9-zone matrix hover
 * and continuous pointer-tracked parallax tilt with elevated depth layers and glare.
 */
export function TiltCard({
  mode = 'grid',
  aspectRatio = '1.586 / 1',
  maxTilt = 6,
  perspective = 1200,
  glare = true,
  cardClassName,
  cardStyle,
  className,
  style,
  children,
  ...rest
}: TiltCardProps) {
  const [pointerTilt, setPointerTilt] = useState<{
    active: boolean;
    rx: number;
    ry: number;
    gx: number;
    gy: number;
  }>({ active: false, rx: 0, ry: 0, gx: 50, gy: 50 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (mode !== 'pointer') return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 2 * maxTilt;
    const ry = (px - 0.5) * 2 * maxTilt;
    setPointerTilt({
      active: true,
      rx,
      ry,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handlePointerLeave = () => {
    if (mode !== 'pointer') return;
    setPointerTilt({ active: false, rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const dynamicCardStyle: CSSProperties =
    mode === 'pointer' && pointerTilt.active
      ? {
          transform: `rotateX(${pointerTilt.rx.toFixed(2)}deg) rotateY(${pointerTilt.ry.toFixed(2)}deg) scale(1.015)`,
          boxShadow: '0 24px 52px rgba(15, 23, 42, 0.12)',
          ...cardStyle,
        }
      : { ...cardStyle };

  return (
    <div
      className={cn(
        'az-tilt-stage',
        mode === 'pointer' && pointerTilt.active && 'az-tilt-stage--pointer-active',
        className,
      )}
      style={
        {
          '--az-tilt-perspective': `${perspective}px`,
          ...(mode === 'pointer'
            ? {
                '--az-glare-x': `${pointerTilt.gx.toFixed(1)}%`,
                '--az-glare-y': `${pointerTilt.gy.toFixed(1)}%`,
              }
            : {}),
          ...style,
        } as CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {mode === 'grid' &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((zone) => (
          <div
            key={zone}
            className={`az-tilt-zone az-tilt-zone-${zone}`}
            aria-hidden="true"
          />
        ))}

      <article
        className={cn('az-tilt-card', cardClassName)}
        style={{ aspectRatio, ...dynamicCardStyle }}
      >
        {glare && <div className="az-tilt-glare" aria-hidden="true" />}
        {children}
      </article>
    </div>
  );
}

/**
 * Elevated Z-axis parallax layer (translateZ 18px) nested inside TiltCard.
 */
export function TiltDepthLayer({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('az-tilt-depth-layer', className)} {...rest}>
      {children}
    </div>
  );
}

