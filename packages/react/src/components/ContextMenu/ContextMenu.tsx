import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckIcon, ChevronRightIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';

export type ContextMenuPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type ContextMenuItemType = 'action' | 'checkbox' | 'radio' | 'submenu';

export interface ContextMenuItem {
  id: string;
  label: ReactNode;
  type?: ContextMenuItemType;
  icon?: ReactNode;
  iconTone?: 'default' | 'primary' | 'danger';
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  active?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  radioGroup?: string;
  value?: string;
  children?: ContextMenuItem[];
  onSelect?: () => void;
  onCheckedChange?: (checked: boolean) => void;
}

export interface ContextMenuGroup {
  id: string;
  heading?: ReactNode;
  headingTone?: 'default' | 'danger';
  items: ContextMenuItem[];
}

export interface ContextMenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  items?: ContextMenuItem[];
  groups?: ContextMenuGroup[];
  width?: number | string;
  fullWidth?: boolean;
  compact?: boolean;
  checkedMap?: Record<string, boolean>;
  onCheckboxChange?: (id: string, checked: boolean) => void;
  radioValues?: Record<string, string>;
  defaultRadioValues?: Record<string, string>;
  onRadioChange?: (group: string, value: string) => void;
  openSubmenuId?: string | null;
  defaultOpenSubmenuId?: string | null;
  onOpenSubmenuChange?: (id: string | null) => void;
  submenuLayout?: 'overlay' | 'inline-beside';
  onActionComplete?: () => void;
  ariaLabel?: string;
}

function collectInitialChecks(groups: ContextMenuGroup[]): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const group of groups) {
    for (const item of group.items) {
      if (item.type === 'checkbox') {
        initial[item.id] = item.defaultChecked ?? item.checked ?? false;
      }
    }
  }
  return initial;
}

function collectInitialRadios(groups: ContextMenuGroup[]): Record<string, string> {
  const initial: Record<string, string> = {};
  for (const group of groups) {
    for (const item of group.items) {
      if (item.type === 'radio' && item.checked) {
        const key = item.radioGroup ?? 'default';
        if (initial[key] === undefined) {
          initial[key] = item.value ?? item.id;
        }
      }
    }
  }
  return initial;
}

/**
 * Interactive contextual menu surface supporting grouped sections, keyboard shortcuts,
 * nested submenus, and live stateful checkbox / radio items.
 */
export function ContextMenuSurface({
  items,
  groups,
  width,
  fullWidth = false,
  compact = false,
  checkedMap,
  onCheckboxChange,
  radioValues,
  defaultRadioValues,
  onRadioChange,
  openSubmenuId,
  defaultOpenSubmenuId = null,
  onOpenSubmenuChange,
  submenuLayout = 'overlay',
  onActionComplete,
  ariaLabel = 'Context Menu',
  className,
  style,
  ...rest
}: ContextMenuSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  const normalizedGroups: ContextMenuGroup[] = useMemo(() => {
    if (groups && groups.length > 0) return groups;
    return [{ id: 'root', items: items ?? [] }];
  }, [groups, items]);

  const [internalChecks, setInternalChecks] = useState<Record<string, boolean>>(() =>
    collectInitialChecks(normalizedGroups),
  );
  const [internalRadios, setInternalRadios] = useState<Record<string, string>>(() => ({
    ...collectInitialRadios(normalizedGroups),
    ...defaultRadioValues,
  }));

  const [activeSubmenuId, setActiveSubmenuId] = useControllableState<string | null>({
    value: openSubmenuId,
    defaultValue: defaultOpenSubmenuId,
    onChange: onOpenSubmenuChange,
  });

  const activeSubmenuItem = useMemo(() => {
    if (!activeSubmenuId) return null;
    for (const grp of normalizedGroups) {
      for (const item of grp.items) {
        if (item.id === activeSubmenuId && item.children && item.children.length > 0) {
          return item;
        }
      }
    }
    return null;
  }, [normalizedGroups, activeSubmenuId]);

  const resolvedChecks = (id: string, itemChecked?: boolean): boolean => {
    if (checkedMap && id in checkedMap) return checkedMap[id];
    if (itemChecked !== undefined) return itemChecked;
    return internalChecks[id] ?? false;
  };

  const resolvedRadio = (groupKey: string): string | undefined => {
    if (radioValues && groupKey in radioValues) return radioValues[groupKey];
    return internalRadios[groupKey];
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = surfaceRef.current;
    if (!container) return;
    const enabledItems = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[role^="menuitem"]:not(:disabled)'),
    );
    if (enabledItems.length === 0) return;

    const currentIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = enabledItems[(currentIndex + 1 + enabledItems.length) % enabledItems.length];
      next?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length];
      prev?.focus();
    } else if (event.key === 'ArrowLeft' && activeSubmenuId) {
      event.preventDefault();
      setActiveSubmenuId(null);
    } else if (event.key === 'Home') {
      event.preventDefault();
      enabledItems[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      enabledItems[enabledItems.length - 1]?.focus();
    }
  };

  const renderMenu = (
    <div
      ref={surfaceRef}
      role="menu"
      aria-label={ariaLabel}
      onKeyDown={handleMenuKeyDown}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...style,
      }}
      className={cn(
        'az-ctxmenu__surface',
        fullWidth && 'az-ctxmenu__surface--full',
        compact && 'az-ctxmenu__surface--compact',
        className,
      )}
      {...rest}
    >
      {normalizedGroups.map((group, groupIdx) => (
        <div key={group.id}>
          {groupIdx > 0 && <hr className="az-ctxmenu__divider" />}
          <div className="az-ctxmenu__group">
            {group.heading !== undefined && (
              <span
                className={cn(
                  'az-ctxmenu__heading',
                  group.headingTone === 'danger' && 'az-ctxmenu__heading--danger',
                )}
              >
                {group.heading}
              </span>
            )}
            {group.items.map((item) => {
              const hasSubmenu = Boolean(item.children && item.children.length > 0);
              const kind: ContextMenuItemType =
                item.type ?? (hasSubmenu ? 'submenu' : 'action');
              const isSubOpen = hasSubmenu && activeSubmenuId === item.id;
              const isCheckboxChecked =
                kind === 'checkbox' ? resolvedChecks(item.id, item.checked) : false;
              const radioGroupKey = item.radioGroup ?? 'default';
              const radioVal = item.value ?? item.id;
              const isRadioChecked =
                kind === 'radio' ? resolvedRadio(radioGroupKey) === radioVal : false;
              const isActive = Boolean(item.active) || isSubOpen || isRadioChecked;

              const roleAttr =
                kind === 'checkbox'
                  ? 'menuitemcheckbox'
                  : kind === 'radio'
                    ? 'menuitemradio'
                    : 'menuitem';

              const handleItemClick = () => {
                if (item.disabled) return;
                if (hasSubmenu) {
                  setActiveSubmenuId((prev) => (prev === item.id ? null : item.id));
                  return;
                }
                if (kind === 'checkbox') {
                  const next = !isCheckboxChecked;
                  if (item.checked === undefined && (!checkedMap || !(item.id in checkedMap))) {
                    setInternalChecks((prev) => ({ ...prev, [item.id]: next }));
                  }
                  item.onCheckedChange?.(next);
                  onCheckboxChange?.(item.id, next);
                  item.onSelect?.();
                  return;
                }
                if (kind === 'radio') {
                  if (!radioValues || !(radioGroupKey in radioValues)) {
                    setInternalRadios((prev) => ({ ...prev, [radioGroupKey]: radioVal }));
                  }
                  onRadioChange?.(radioGroupKey, radioVal);
                  item.onSelect?.();
                  return;
                }
                item.onSelect?.();
                onActionComplete?.();
              };

              return (
                <div
                  key={item.id}
                  className="az-ctxmenu__item-wrap"
                  onMouseEnter={() => {
                    if (submenuLayout === 'overlay' && hasSubmenu && !item.disabled) {
                      setActiveSubmenuId(item.id);
                    }
                  }}
                >
                  <button
                    type="button"
                    role={roleAttr}
                    disabled={item.disabled}
                    aria-checked={
                      kind === 'checkbox'
                        ? isCheckboxChecked
                        : kind === 'radio'
                          ? isRadioChecked
                          : undefined
                    }
                    aria-haspopup={hasSubmenu ? 'menu' : undefined}
                    aria-expanded={hasSubmenu ? isSubOpen : undefined}
                    onClick={handleItemClick}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' && hasSubmenu && !item.disabled) {
                        e.preventDefault();
                        setActiveSubmenuId(item.id);
                      }
                    }}
                    className={cn(
                      'az-ctxmenu__item',
                      isActive && 'az-ctxmenu__item--active',
                      item.destructive && 'az-ctxmenu__item--destructive',
                    )}
                  >
                    <span className="az-ctxmenu__item-main">
                      {kind === 'checkbox' && (
                        <span
                          className={cn('az-ctxmenu__checkbox', isCheckboxChecked && 'is-checked')}
                          aria-hidden="true"
                        >
                          <span className="az-ctxmenu__checkbox-check">
                            <CheckIcon size={13} />
                          </span>
                        </span>
                      )}

                      {kind === 'radio' && (
                        <span
                          className={cn('az-ctxmenu__radio-ring', isRadioChecked && 'is-checked')}
                          aria-hidden="true"
                        >
                          <span className="az-ctxmenu__radio-dot" />
                        </span>
                      )}

                      {item.icon && (
                        <span
                          className={cn(
                            'az-ctxmenu__item-icon',
                            item.iconTone === 'primary' && 'az-ctxmenu__item-icon--primary',
                            item.iconTone === 'danger' && 'az-ctxmenu__item-icon--danger',
                          )}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}

                      <span className="az-ctxmenu__item-label">{item.label}</span>
                    </span>

                    {item.shortcut && <kbd className="az-ctxmenu__shortcut">{item.shortcut}</kbd>}

                    {hasSubmenu && (
                      <span className="az-ctxmenu__caret" aria-hidden="true">
                        <ChevronRightIcon size={16} />
                      </span>
                    )}
                  </button>

                  {submenuLayout === 'overlay' && hasSubmenu && isSubOpen && item.children && (
                    <div className="az-ctxmenu__submenu-float">
                      <ContextMenuSurface
                        items={item.children}
                        width={188}
                        ariaLabel={`${typeof item.label === 'string' ? item.label : 'Submenu'} Submenu`}
                        checkedMap={checkedMap}
                        onCheckboxChange={onCheckboxChange}
                        radioValues={radioValues}
                        onRadioChange={onRadioChange}
                        onActionComplete={onActionComplete}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (submenuLayout === 'inline-beside') {
    return (
      <div className="az-ctxmenu-row">
        {renderMenu}
        {activeSubmenuItem && activeSubmenuItem.children && (
          <ContextMenuSurface
            items={activeSubmenuItem.children}
            ariaLabel={`${typeof activeSubmenuItem.label === 'string' ? activeSubmenuItem.label : 'Export'} Submenu`}
            checkedMap={checkedMap}
            onCheckboxChange={onCheckboxChange}
            radioValues={radioValues}
            onRadioChange={onRadioChange}
            onActionComplete={() => setActiveSubmenuId(null)}
            className="az-ctxmenu__surface--submenu-beside"
          />
        )}
      </div>
    );
  }

  return renderMenu;
}

export interface ContextMenuProps {
  trigger: ReactNode;
  triggerMode?: 'click' | 'contextmenu' | 'both';
  placement?: ContextMenuPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  items?: ContextMenuItem[];
  groups?: ContextMenuGroup[];
  width?: number | string;
  compact?: boolean;
  ariaLabel?: string;
  blockTrigger?: boolean;
  closeOnOutsideClick?: boolean;
  checkedMap?: Record<string, boolean>;
  onCheckboxChange?: (id: string, checked: boolean) => void;
  radioValues?: Record<string, string>;
  defaultRadioValues?: Record<string, string>;
  onRadioChange?: (group: string, value: string) => void;
  className?: string;
}

/**
 * Trigger- or right-click-anchored ContextMenu supporting all 8 cardinal/corner placements
 * plus pointer-coordinate viewport-clamped context menus.
 */
export function ContextMenu({
  trigger,
  triggerMode = 'click',
  placement = 'bottom-start',
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  items,
  groups,
  width,
  compact = false,
  ariaLabel = 'Context Menu',
  blockTrigger = false,
  closeOnOutsideClick = true,
  checkedMap,
  onCheckboxChange,
  radioValues,
  defaultRadioValues,
  onRadioChange,
  className,
}: ContextMenuProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [pointerCoords, setPointerCoords] = useState<{ x: number; y: number } | null>(null);

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setPointerCoords(null);
  }, [setIsOpen]);

  useOutsideClick(anchorRef, closeMenu, closeOnOutsideClick && isOpen && pointerCoords === null);

  // Outside click / Escape / scroll close for fixed pointer-coordinate portal
  useEffect(() => {
    if (!isOpen || pointerCoords === null) return;
    const onPointer = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const target = event.target as Node | null;
      if (portalRef.current && target && portalRef.current.contains(target)) return;
      closeMenu();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const onScroll = () => closeMenu();
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, pointerCoords, closeMenu]);

  const handleClickTrigger = () => {
    if (triggerMode !== 'click' && triggerMode !== 'both') return;
    setPointerCoords(null);
    setIsOpen((prev) => !prev);
  };

  const handleContextMenuTrigger = (event: MouseEvent) => {
    if (triggerMode !== 'contextmenu' && triggerMode !== 'both') return;
    event.preventDefault();
    const numericWidth = typeof width === 'number' ? width : 210;
    const estimatedHeight = 240;
    const clampedX = Math.max(8, Math.min(event.clientX, window.innerWidth - numericWidth - 12));
    const clampedY = Math.max(8, Math.min(event.clientY, window.innerHeight - estimatedHeight - 12));
    setPointerCoords({ x: clampedX, y: clampedY });
    setIsOpen(true);
  };

  let triggerNode: ReactNode;
  if (isValidElement(trigger)) {
    const props = trigger.props as {
      onClick?: (e: MouseEvent) => void;
      onContextMenu?: (e: MouseEvent) => void;
    };
    triggerNode = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
      'aria-expanded': triggerMode === 'click' || triggerMode === 'both' ? isOpen : undefined,
      'aria-haspopup': 'menu',
      onClick: (event: MouseEvent) => {
        props.onClick?.(event);
        handleClickTrigger();
      },
      onContextMenu: (event: MouseEvent) => {
        props.onContextMenu?.(event);
        handleContextMenuTrigger(event);
      },
    });
  } else {
    triggerNode = (
      <span
        onClick={handleClickTrigger}
        onContextMenu={handleContextMenuTrigger}
      >
        {trigger}
      </span>
    );
  }

  const surfaceElement = (
    <ContextMenuSurface
      items={items}
      groups={groups}
      width={width}
      compact={compact}
      ariaLabel={ariaLabel}
      checkedMap={checkedMap}
      onCheckboxChange={onCheckboxChange}
      radioValues={radioValues}
      defaultRadioValues={defaultRadioValues}
      onRadioChange={onRadioChange}
      onActionComplete={() => {
        if (closeOnSelect) closeMenu();
      }}
    />
  );

  return (
    <div
      ref={anchorRef}
      className={cn('az-ctxmenu-anchor', blockTrigger && 'az-ctxmenu-anchor--block', className)}
    >
      {triggerNode}

      {isOpen && pointerCoords === null && (
        <div className={cn('az-ctxmenu-anchor__panel', `az-ctxmenu-anchor__panel--${placement}`)}>
          {surfaceElement}
        </div>
      )}

      {isOpen &&
        pointerCoords !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={portalRef}
            className="az-ctxmenu-portal"
            style={{ left: pointerCoords.x, top: pointerCoords.y }}
          >
            {surfaceElement}
          </div>,
          document.body,
        )}
    </div>
  );
}
