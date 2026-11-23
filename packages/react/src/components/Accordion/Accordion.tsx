import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import {
  Collapse,
  type CollapseForceState,
  type CollapseIndicator,
} from '../Collapse/Collapse';

export type AccordionVariant = 'joined' | 'separate';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  badge?: ReactNode;
  forceState?: CollapseForceState;
}

export interface AccordionProps {
  items: AccordionItem[];
  variant?: AccordionVariant;
  indicator?: CollapseIndicator;
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (openIds: string[]) => void;
  className?: string;
}

/**
 * Grouped Accordion built on top of `Collapse` supporting joined (hairline-divided) and
 * separate (spaced card) layouts, exclusive or multi-open behavior, and forced-state items.
 */
export function Accordion({
  items,
  variant = 'joined',
  indicator = 'arrow',
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const handleToggleItem = (item: AccordionItem, nextOpen: boolean) => {
    if (item.forceState) return;
    if (multiple) {
      if (nextOpen) {
        setOpenIds(Array.from(new Set([...openIds, item.id])));
      } else {
        setOpenIds(openIds.filter((id) => id !== item.id));
      }
    } else {
      setOpenIds(nextOpen ? [item.id] : []);
    }
  };

  return (
    <div className={cn('az-accordion', `az-accordion--${variant}`, className)}>
      {items.map((item) => {
        const isOpen =
          item.forceState === 'open'
            ? true
            : item.forceState === 'closed'
              ? false
              : openIds.includes(item.id);

        return (
          <Collapse
            key={item.id}
            title={item.title}
            badge={item.badge}
            indicator={indicator}
            forceState={item.forceState}
            open={isOpen}
            framed={variant === 'separate'}
            onOpenChange={(next) => handleToggleItem(item, next)}
          >
            {item.content}
          </Collapse>
        );
      })}
    </div>
  );
}

