import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  ArrowBackIcon,
  ArrowDownwardIcon,
  ArrowRightIcon,
  ArrowUpwardIcon,
} from '../../icons';
import { cn } from '../../utils/cn';

export type CarouselVariant =
  | 'start'
  | 'center'
  | 'end'
  | 'full-width'
  | 'vertical'
  | 'half-width'
  | 'full-bleed';

export type CarouselGap = 'sm' | 'md' | 'lg' | 'xl';

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Snap & layout preset mirroring all 7 Carousel variations. */
  variant?: CarouselVariant;
  /** Optional scroll axis override. Automatically 'vertical' for `variant="vertical"`. */
  orientation?: 'horizontal' | 'vertical';
  /** Gap rhythm between slides. */
  gap?: CarouselGap;
  /** Height in px (or CSS length) for vertical carousels. */
  height?: number | string;
  /** Optional section title rendered alongside navigation arrows. */
  title?: ReactNode;
  /** Custom extra content rendered in the header controls area. */
  headerExtra?: ReactNode;
  /** Displays circular previous/next navigation buttons. */
  showControls?: boolean;
  /** Displays interactive pagination indicator dots below the track. */
  showDots?: boolean;
  /** Wraps back to opposite end when pressing prev/next at boundary. */
  loop?: boolean;
  /** Override scroll step distance in px. */
  stepSize?: number;
  /** Initial active slide index (useful for starting centered carousels on a middle slide). */
  defaultIndex?: number;
  /** ARIA label for the track region. */
  ariaLabel?: string;
  children?: ReactNode;
}

/**
 * Smooth scroll-snap Carousel supporting start, center, end, full-width, half-width,
 * vertical, and full-bleed layouts with responsive arrow state and optional dot indicators.
 */
export function Carousel({
  variant = 'start',
  orientation,
  gap,
  height = 420,
  title,
  headerExtra,
  showControls = true,
  showDots = false,
  loop = false,
  stepSize,
  defaultIndex = 0,
  ariaLabel,
  className,
  style,
  children,
  ...rest
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const isVertical = orientation ? orientation === 'vertical' : variant === 'vertical';
  const resolvedGap: CarouselGap =
    gap ?? (variant === 'center' ? 'xl' : variant === 'full-bleed' ? 'md' : 'lg');
  const childCount = Children.count(children);

  const getClosestCenterIndex = useCallback((el: HTMLDivElement): number => {
    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return 0;
    const viewportCenter = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < items.length; i++) {
      const c = items[i];
      const itemCenter = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(itemCenter - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, []);

  const syncCenterPad = useCallback(() => {
    const el = trackRef.current;
    if (!el || variant !== 'center') return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const pad = Math.max(0, Math.round((el.clientWidth - firstChild.offsetWidth) / 2));
    el.style.setProperty('--az-carousel-center-pad', `${pad}px`);
  }, [variant]);

  const scrollToSlide = useCallback(
    (idx: number, instant = false) => {
      const el = trackRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(el.children.length - 1, idx));
      const child = el.children[clamped] as HTMLElement | undefined;
      if (!child) return;

      const behavior: ScrollBehavior = instant ? 'auto' : 'smooth';
      if (isVertical) {
        el.scrollTo({ top: child.offsetTop, behavior });
        return;
      }

      if (variant === 'center') {
        const left = child.offsetLeft + child.offsetWidth / 2 - el.clientWidth / 2;
        el.scrollTo({ left: Math.max(0, left), behavior });
      } else if (variant === 'end') {
        const left = child.offsetLeft + child.offsetWidth - el.clientWidth;
        el.scrollTo({ left: Math.max(0, left), behavior });
      } else {
        el.scrollTo({ left: child.offsetLeft, behavior });
      }
    },
    [isVertical, variant],
  );

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (isVertical) {
      setCanPrev(el.scrollTop > 4);
      setCanNext(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
      const itemH = el.clientHeight || 1;
      setActiveIndex(Math.min(Math.max(0, childCount - 1), Math.round(el.scrollTop / itemH)));
    } else if (variant === 'center') {
      const closest = getClosestCenterIndex(el);
      setActiveIndex(closest);
      setCanPrev(closest > 0);
      setCanNext(closest < Math.max(0, childCount - 1));
    } else {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
      const firstChild = el.firstElementChild as HTMLElement | null;
      const step = firstChild ? firstChild.offsetWidth : el.clientWidth || 1;
      setActiveIndex(Math.min(Math.max(0, childCount - 1), Math.round(el.scrollLeft / step)));
    }
  }, [isVertical, variant, childCount, getClosestCenterIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleMeasure = () => {
      syncCenterPad();
      if (!initializedRef.current && el.clientWidth > 0) {
        initializedRef.current = true;
        if (defaultIndex > 0) {
          scrollToSlide(defaultIndex, true);
        }
      }
      updateScrollState();
    };

    handleMeasure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleMeasure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [syncCenterPad, updateScrollState, scrollToSlide, defaultIndex, children]);

  const scrollByStep = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;

    if (variant === 'center' && childCount > 0) {
      const current = getClosestCenterIndex(el);
      const next = loop
        ? (current + dir + childCount) % childCount
        : Math.max(0, Math.min(childCount - 1, current + dir));
      scrollToSlide(next);
      return;
    }

    if (loop) {
      if (dir === -1 && !canPrev) {
        el.scrollTo({
          left: isVertical ? 0 : el.scrollWidth,
          top: isVertical ? el.scrollHeight : 0,
          behavior: 'smooth',
        });
        return;
      }
      if (dir === 1 && !canNext) {
        el.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        return;
      }
    }

    let delta = stepSize;
    if (delta === undefined) {
      if (isVertical) {
        delta = el.clientHeight;
      } else if (variant === 'full-width' || variant === 'half-width') {
        delta = el.clientWidth;
      } else {
        const firstChild = el.firstElementChild as HTMLElement | null;
        const computedGap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '24') || 24;
        delta = firstChild ? firstChild.offsetWidth + computedGap : 364;
      }
    }

    el.scrollBy({
      left: isVertical ? 0 : dir * delta,
      top: isVertical ? dir * delta : 0,
      behavior: 'smooth',
    });
  };

  const heightCss = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'az-carousel',
        `az-carousel--${variant}`,
        `az-carousel--gap-${resolvedGap}`,
        isVertical && variant !== 'vertical' && 'az-carousel--vertical',
        className,
      )}
      style={{ '--az-carousel-height': heightCss, ...style } as CSSProperties}
      {...rest}
    >
      {(title || showControls || headerExtra) && (
        <div className="az-carousel__header">
          {title ? <h3 className="az-carousel__title">{title}</h3> : <span />}
          <div className="az-carousel__controls">
            {headerExtra}
            {showControls && (
              <>
                <button
                  type="button"
                  className="az-carousel__btn"
                  aria-label="Previous item"
                  disabled={!loop && !canPrev}
                  onClick={() => scrollByStep(-1)}
                >
                  {isVertical ? <ArrowUpwardIcon size={18} /> : <ArrowBackIcon size={18} />}
                </button>
                <button
                  type="button"
                  className="az-carousel__btn"
                  aria-label="Next item"
                  disabled={!loop && !canNext}
                  onClick={() => scrollByStep(1)}
                >
                  {isVertical ? <ArrowDownwardIcon size={18} /> : <ArrowRightIcon size={18} />}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Carousel')}
        className="az-carousel__track"
        onScroll={updateScrollState}
      >
        {children}
      </div>

      {showDots && childCount > 1 && (
        <div className="az-carousel__dots" role="tablist" aria-label="Slide navigation">
          {Array.from({ length: childCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Slide ${i + 1}`}
              className={cn('az-carousel__dot', activeIndex === i && 'az-carousel__dot--active')}
              onClick={() => scrollToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface CarouselItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Slide width in px or CSS length (omit for full-width/half-width variants). */
  width?: number | string;
  /** Aspect ratio of media frame (default '4 / 3'). */
  aspectRatio?: string;
  /** Optional slide image URL (when rendering a standard image slide). */
  imageSrc?: string;
  /** Accessible alt text for `imageSrc`. */
  imageAlt?: string;
  /** Slide title caption rendered below media frame. */
  caption?: ReactNode;
  children?: ReactNode;
}

/**
 * Structured Carousel slide container pairing a bordered M3 frame with an editorial caption.
 */
export function CarouselItem({
  width,
  aspectRatio = '4 / 3',
  imageSrc,
  imageAlt = '',
  caption,
  className,
  style,
  children,
  ...rest
}: CarouselItemProps) {
  const widthCss = width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined;

  return (
    <article
      className={cn('az-carousel-item', className)}
      style={{ ...(widthCss ? { width: widthCss } : {}), ...style }}
      {...rest}
    >
      <div className="az-carousel-item__frame" style={{ aspectRatio }}>
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className="az-carousel-item__media" />
        ) : (
          children
        )}
      </div>
      {caption && <h4 className="az-carousel-item__caption">{caption}</h4>}
    </article>
  );
}

