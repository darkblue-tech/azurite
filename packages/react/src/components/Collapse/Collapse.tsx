import { useId, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { ChevronDownIcon, MinusIcon, PlusIcon } from '../../icons';

export type CollapseIndicator = 'none' | 'arrow' | 'plus-minus';
export type CollapseForceState = 'open' | 'closed';

export interface CollapseProps {
  title: ReactNode;
  children: ReactNode;
  badge?: ReactNode;
  indicator?: CollapseIndicator;
  forceState?: CollapseForceState;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  framed?: boolean;
  className?: string;
}

/**
 * Progressive disclosure Collapse panel with smooth CSS grid-row height animation,
 * minimalist/arrow/plus-minus indicators, and forced open/closed state support.
 */
export function Collapse({
  title,
  children,
  badge,
  indicator = 'arrow',
  forceState,
  open,
  defaultOpen = false,
  onOpenChange,
  framed = true,
  className,
}: CollapseProps) {
  const panelId = useId();
  const [controlledOpen, setControlledOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const isForcedOpen = forceState === 'open';
  const isForcedClosed = forceState === 'closed';
  const isExpanded = isForcedOpen ? true : isForcedClosed ? false : controlledOpen;

  const handleToggle = () => {
    if (forceState) return;
    setControlledOpen(!isExpanded);
  };

  let iconNode: ReactNode = null;
  if (indicator === 'arrow') {
    iconNode = (
      <span
        className={cn('az-collapse__icon', isExpanded && 'az-collapse__icon--rotated')}
        aria-hidden="true"
      >
        <ChevronDownIcon size={20} />
      </span>
    );
  } else if (indicator === 'plus-minus') {
    iconNode = (
      <span className="az-collapse__icon" aria-hidden="true">
        {isExpanded ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
      </span>
    );
  }

  return (
    <div
      data-force-state={forceState}
      className={cn(
        'az-collapse',
        framed && 'az-collapse--framed',
        isForcedOpen && 'az-collapse--force-open',
        isForcedClosed && 'az-collapse--force-closed',
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-disabled={isForcedOpen || undefined}
        disabled={isForcedClosed}
        onClick={handleToggle}
        className="az-collapse__trigger"
      >
        <span className="az-collapse__title-wrap">
          <span className="az-collapse__title">{title}</span>
          {badge}
        </span>
        {iconNode}
      </button>

      <div
        id={panelId}
        aria-hidden={!isExpanded}
        className={cn('az-collapse__panel', isExpanded && 'az-collapse__panel--open')}
      >
        <div className="az-collapse__panel-inner">
          <div className="az-collapse__content">{children}</div>
        </div>
      </div>
    </div>
  );
}

