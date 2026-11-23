import { useCallback, useRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { PlusIcon } from '../../icons';
import { Tooltip } from '../Tooltip/Tooltip';
import { Fab, type FabTone } from './Fab';

export type SpeedDialLayout = 'vertical' | 'flower';
export type SpeedDialItemStyle = 'circle' | 'pill';
export type SpeedDialToggleMode = 'standard' | 'close-rotate' | 'main-action';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: ReactNode;
  tooltip?: string;
  tone?: FabTone;
  disabled?: boolean;
  alwaysShowTooltip?: boolean;
  onClick?: () => void;
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  layout?: SpeedDialLayout;
  itemStyle?: SpeedDialItemStyle;
  showLabels?: boolean;
  showTooltips?: boolean;
  toggleMode?: SpeedDialToggleMode;
  triggerIcon?: ReactNode;
  triggerLabel?: ReactNode;
  triggerAriaLabel?: string;
  triggerTone?: FabTone;
  radius?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnActionClick?: boolean;
  closeOnOutsideClick?: boolean;
  onMainAction?: () => void;
  aura?: boolean;
  className?: string;
}

/**
 * Interactive Speed Dial menu fanning actions in either a vertical stack or a
 * quarter-circle flower arc with staggered animations, inline labels, or radial tooltips.
 */
export function SpeedDial({
  actions,
  layout = 'vertical',
  itemStyle = 'circle',
  showLabels = false,
  showTooltips = false,
  toggleMode = 'standard',
  triggerIcon,
  triggerLabel = 'Main Action',
  triggerAriaLabel = 'Toggle speed dial',
  triggerTone,
  radius = 96,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnActionClick = true,
  closeOnOutsideClick = true,
  onMainAction,
  aura = false,
  className,
}: SpeedDialProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useOutsideClick(rootRef, handleClose, closeOnOutsideClick && isOpen);

  const resolvedTriggerTone: FabTone =
    toggleMode === 'close-rotate' && isOpen && (!triggerTone || triggerTone === 'primary')
      ? 'neutral'
      : (triggerTone ?? 'primary');

  const resolvedTriggerIcon = triggerIcon ?? <PlusIcon size={24} />;
  const shouldRotate = toggleMode === 'close-rotate' && isOpen;

  const handleActionClick = (action: SpeedDialAction) => {
    if (action.disabled) return;
    action.onClick?.();
    if (closeOnActionClick) {
      setIsOpen(false);
    }
  };

  const handleTriggerClick = () => {
    if (toggleMode === 'main-action' && isOpen && onMainAction) {
      onMainAction();
      if (closeOnActionClick) {
        setIsOpen(false);
      }
      return;
    }
    setIsOpen(!isOpen);
  };

  if (layout === 'flower') {
    const count = actions.length;
    return (
      <div
        ref={rootRef}
        data-open={isOpen ? 'true' : 'false'}
        className={cn('az-sd-flower', className)}
      >
        {actions.map((action, idx) => {
          const ratio = count <= 1 ? 0 : idx / (count - 1);
          const angleRad = (Math.PI / 2) * ratio; // 0 (top: 0, -R) -> PI/2 (left: -R, 0)
          const x = Math.round(-Math.sin(angleRad) * radius);
          const y = Math.round(-Math.cos(angleRad) * radius);
          const tipPlacement = angleRad > Math.PI / 4 ? 'left' : 'top';
          const actionFab = (
            <Fab
              size="sm"
              tone={action.tone ?? 'surface'}
              icon={action.icon}
              disabled={action.disabled}
              aria-label={action.label}
              onClick={() => handleActionClick(action)}
              style={{ width: 40, height: 40 }}
            />
          );

          return (
            <div
              key={action.id}
              className="az-sd-flower__item"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transitionDelay: isOpen ? `${idx * 25}ms` : `${(count - idx - 1) * 20}ms`,
              }}
            >
              {showTooltips ? (
                <Tooltip
                  content={action.tooltip ?? action.label}
                  placement={tipPlacement}
                  tone="surface"
                  size="sm"
                  offset={8}
                  alwaysOpen={action.alwaysShowTooltip}
                  className="az-sd__tooltip-wrap"
                >
                  {actionFab}
                </Tooltip>
              ) : (
                actionFab
              )}
            </div>
          );
        })}

        {toggleMode === 'main-action' && triggerLabel && (
          <span className="az-sd__label-chip az-sd__label-chip--primary az-sd__trigger-label az-sd-flower__trigger-label">
            {triggerLabel}
          </span>
        )}
        <Fab
          size="md"
          tone={resolvedTriggerTone}
          icon={resolvedTriggerIcon}
          rotated={shouldRotate && typeof triggerIcon !== 'string'}
          aura={aura}
          aria-expanded={isOpen}
          aria-label={triggerAriaLabel}
          onClick={handleTriggerClick}
          className="az-sd-flower__trigger"
        />
      </div>
    );
  }

  const centerAligned = !showLabels && itemStyle === 'circle' && toggleMode !== 'main-action';

  return (
    <div
      ref={rootRef}
      data-open={isOpen ? 'true' : 'false'}
      className={cn('az-sd', centerAligned && 'az-sd--center-align', className)}
    >
      <div className="az-sd__stack">
        {actions.map((action, idx) => {
          const delay = isOpen
            ? `${(actions.length - 1 - idx) * 25}ms`
            : `${idx * 20}ms`;

          if (itemStyle === 'pill') {
            return (
              <button
                key={action.id}
                type="button"
                disabled={action.disabled}
                onClick={() => handleActionClick(action)}
                style={{ transitionDelay: delay }}
                className="az-sd__pill-action"
              >
                {action.icon && <span aria-hidden="true">{action.icon}</span>}
                <span>{action.label}</span>
              </button>
            );
          }

          return (
            <div key={action.id} className="az-sd__row" style={{ transitionDelay: delay }}>
              {showLabels && <span className="az-sd__label-chip">{action.label}</span>}
              <span className={showLabels ? 'az-sd__btn-slot' : undefined}>
                <Fab
                  size="sm"
                  tone={action.tone ?? 'surface'}
                  icon={action.icon}
                  disabled={action.disabled}
                  aria-label={action.label}
                  onClick={() => handleActionClick(action)}
                />
              </span>
            </div>
          );
        })}
      </div>

      <div className="az-sd__trigger-row">
        {toggleMode === 'main-action' && triggerLabel && (
          <span className="az-sd__label-chip az-sd__label-chip--primary az-sd__trigger-label">
            {triggerLabel}
          </span>
        )}
        <Fab
          size="md"
          tone={resolvedTriggerTone}
          icon={resolvedTriggerIcon}
          rotated={shouldRotate && typeof triggerIcon !== 'string'}
          aura={aura}
          aria-expanded={isOpen}
          aria-label={triggerAriaLabel}
          onClick={handleTriggerClick}
        />
      </div>
    </div>
  );
}

