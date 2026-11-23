import {
  Children,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

export type StackDirection = 'top' | 'bottom' | 'start' | 'end';
export type StackDepth = 'shadow' | 'tonal';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Offset direction for receding stack layers. */
  direction?: StackDirection;
  /** Depth separation methodology: layered soft shadows vs M3 surface tones. */
  depth?: StackDepth;
  /** Decorative backing card count (2..4) when a single front child is provided. */
  layers?: number;
  /** Width of the front card in px or CSS length (default 300). */
  width?: number | string;
  /** Height of the front card in px or CSS length (default 140). */
  height?: number | string;
  /** Expands layer offsets slightly on hover (default true). */
  hoverExpand?: boolean;
  /** Enables click/keyboard cycling when multiple card children are provided. */
  interactive?: boolean;
  children?: ReactNode;
}

function stepTransform(depthIndex: number): string {
  const scale = Math.max(0.82, 1 - depthIndex * 0.05);
  return `translate(calc(var(--az-stack-step-x) * ${depthIndex}), calc(var(--az-stack-step-y) * ${depthIndex})) scale(${scale})`;
}

/**
 * Layered card Stack composition supporting Top, Bottom, Start, and End directional
 * offsets in either Shadow-based Elevation or zero-shadow Tonal Contrast depth.
 */
export function Stack({
  direction = 'top',
  depth = 'shadow',
  layers = 3,
  width = 300,
  height = 140,
  hoverExpand = true,
  interactive = false,
  className,
  style,
  children,
  onClick,
  onKeyDown,
  ...rest
}: StackProps) {
  const items = Children.toArray(children);
  const [frontIndex, setFrontIndex] = useState(0);

  const hasMultiChildren = items.length > 1;
  const totalLayers = hasMultiChildren ? Math.min(items.length, 4) : Math.max(2, Math.min(4, layers));

  const cycleFront = () => {
    if (!interactive || !hasMultiChildren) return;
    setFrontIndex((prev) => (prev + 1) % items.length);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (interactive && hasMultiChildren && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      cycleFront();
    }
    onKeyDown?.(e);
  };

  const widthCss = typeof width === 'number' ? `${width}px` : width;
  const heightCss = typeof height === 'number' ? `${height}px` : height;

  // Render layers back-to-front so paint order aligns with zIndex
  const orderedIndices = Array.from({ length: totalLayers }, (_, k) => totalLayers - 1 - k);

  return (
    <div
      role={interactive && hasMultiChildren ? 'button' : undefined}
      tabIndex={interactive && hasMultiChildren ? 0 : undefined}
      className={cn(
        'az-stack',
        `az-stack--${direction}`,
        `az-stack--${depth}`,
        hoverExpand && 'az-stack--hover-expand',
        interactive && hasMultiChildren && 'az-stack--interactive',
        className,
      )}
      style={{
        width: widthCss,
        height: heightCss,
        ...style,
      }}
      onClick={(e) => {
        cycleFront();
        onClick?.(e);
      }}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {orderedIndices.map((offsetIdx) => {
        const isFront = offsetIdx === 0;
        const backTier = offsetIdx >= 2 ? 'back-2' : offsetIdx === 1 ? 'back-1' : 'front';
        const layerStyle: CSSProperties = {
          zIndex: (totalLayers - offsetIdx) * 10,
          ...(isFront ? {} : { transform: stepTransform(offsetIdx) }),
        };

        const childContent = hasMultiChildren
          ? items[(frontIndex + offsetIdx) % items.length]
          : isFront
            ? items[0]
            : null;

        return (
          <div
            key={offsetIdx}
            aria-hidden={!isFront || undefined}
            className={cn('az-stack__layer', `az-stack__layer--${backTier}`)}
            style={layerStyle}
          >
            {childContent}
          </div>
        );
      })}
    </div>
  );
}

