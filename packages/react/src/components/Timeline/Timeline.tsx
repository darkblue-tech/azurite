import type { OlHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type TimelineLayout = 'both-sides' | 'left' | 'right' | 'alternating';
export type TimelineNodeVariant = 'icon' | 'dot';
export type TimelineCardVariant = 'outlined' | 'tonal' | 'plain';
export type TimelineSize = 'md' | 'lg';
export type TimelineTone =
  | 'primary'
  | 'primary-container'
  | 'tertiary'
  | 'tertiary-container'
  | 'secondary'
  | 'neutral';
export type TimelineConnectorTone = 'default' | 'primary' | 'tertiary' | 'secondary' | 'success' | 'error';

export interface TimelineItem {
  id?: string;
  date?: ReactNode;
  dateMuted?: boolean;
  meta?: ReactNode;
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: TimelineTone;
  connectorTone?: TimelineConnectorTone;
  content?: ReactNode;
}

export interface TimelineProps extends OlHTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
  layout?: TimelineLayout;
  nodeVariant?: TimelineNodeVariant;
  cardVariant?: TimelineCardVariant;
  size?: TimelineSize;
  animated?: boolean;
}

/**
 * Vertical chronological timeline supporting bilateral, unilateral (left/right),
 * alternating zigzag, colored axis connectors, dot-only, and large editorial layouts.
 */
export function Timeline({
  items,
  layout = 'right',
  nodeVariant = 'icon',
  cardVariant,
  size = 'md',
  animated = false,
  className,
  ...rest
}: TimelineProps) {
  const resolvedCardVariant: TimelineCardVariant =
    cardVariant ?? (nodeVariant === 'dot' ? 'plain' : 'outlined');

  return (
    <ol
      className={cn(
        'az-timeline',
        `az-timeline--${layout}`,
        `az-timeline--${nodeVariant}`,
        `az-timeline--${size}`,
        className,
      )}
      {...rest}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const resolvedTone: TimelineTone = item.tone ?? (idx === 0 ? 'primary' : 'neutral');
        const dotTone =
          item.tone === 'primary' ||
          item.tone === 'tertiary' ||
          item.tone === 'secondary' ||
          item.tone === 'neutral'
            ? item.tone
            : idx === 0
              ? 'primary'
              : 'neutral';
        const connectorTone: TimelineConnectorTone = item.connectorTone ?? 'default';
        const isAltLeft = layout === 'alternating' && idx % 2 === 0;

        const cardNode = (
          <div className="az-timeline__content">
            <div className={cn('az-timeline__card', `az-timeline__card--${resolvedCardVariant}`)}>
              {(layout !== 'both-sides' && (item.date !== undefined || item.badge !== undefined)) && (
                <div className="az-timeline__card-header">
                  {item.date !== undefined && (
                    <span
                      className={cn(
                        'az-timeline__eyebrow',
                        item.dateMuted && 'az-timeline__eyebrow--muted',
                      )}
                    >
                      {item.date}
                    </span>
                  )}
                  {item.badge}
                </div>
              )}

              <h3 className="az-timeline__title">{item.title}</h3>
              {item.description !== undefined && (
                <p className="az-timeline__desc">{item.description}</p>
              )}
              {item.content}
            </div>
          </div>
        );

        const railNode = (
          <div className="az-timeline__rail">
            {nodeVariant === 'dot' ? (
              <span className={cn('az-timeline__dot', `az-timeline__dot--${dotTone}`)} aria-hidden="true" />
            ) : (
              <span className={cn('az-timeline__node', `az-timeline__node--${resolvedTone}`)}>
                {item.icon}
              </span>
            )}
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  'az-timeline__connector',
                  connectorTone !== 'default' && 'az-timeline__connector--colored',
                  connectorTone !== 'default' && `az-timeline__connector--${connectorTone}`,
                )}
              />
            )}
          </div>
        );

        return (
          <li
            key={item.id ?? idx}
            className={cn(
              'az-timeline__item',
              animated && 'az-timeline__item--animated',
              layout === 'alternating' &&
                (isAltLeft ? 'az-timeline__item--alt-left' : 'az-timeline__item--alt-right'),
            )}
            style={animated ? { animationDelay: `${idx * 45}ms` } : undefined}
          >
            {layout === 'both-sides' && (
              <>
                <div className="az-timeline__side-meta">
                  {item.date !== undefined && <span className="az-timeline__date">{item.date}</span>}
                  {item.meta !== undefined && <span className="az-timeline__meta">{item.meta}</span>}
                </div>
                {railNode}
                {cardNode}
              </>
            )}

            {layout === 'left' && (
              <>
                {cardNode}
                {railNode}
              </>
            )}

            {layout === 'right' && (
              <>
                {railNode}
                {cardNode}
              </>
            )}

            {layout === 'alternating' && (
              <>
                {isAltLeft ? cardNode : <div className="az-timeline__empty-slot" aria-hidden="true" />}
                {railNode}
                {isAltLeft ? <div className="az-timeline__empty-slot" aria-hidden="true" /> : cardNode}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

