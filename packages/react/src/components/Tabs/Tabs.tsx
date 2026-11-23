import {
  createContext,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type TabsVariant = 'plain' | 'underline' | 'bordered-pill' | 'container' | 'solid-pill';
export type TabsSize = 'xs' | 'sm' | 'md' | 'lg';

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  indicator?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

interface TabsContextValue {
  baseId: string;
  activeId: string;
  selectTab: (id: string) => void;
  variant: TabsVariant;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('TabList, Tab, and TabPanel must be rendered inside <Tabs>');
  }
  return ctx;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  tabListLabel?: string;
  children?: ReactNode;
}

/**
 * Navigation tabs supporting plain, underlined, bordered-pill, container, and solid-pill
 * appearances across four calibrated sizes with keyboard navigation and animated panels.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  size = 'md',
  tabListLabel,
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const fallbackId = items?.find((i) => !i.disabled)?.id ?? items?.[0]?.id ?? '';
  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? fallbackId,
    onChange: onValueChange,
  });

  return (
    <TabsContext.Provider
      value={{ baseId, activeId, selectTab: setActiveId, variant, size }}
    >
      <div
        className={cn(
          'az-tabs',
          `az-tabs--${variant}`,
          `az-tabs--${size}`,
          className,
        )}
        {...rest}
      >
        {items ? (
          <>
            <TabList aria-label={tabListLabel}>
              {items.map((item) => (
                <Tab
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  indicator={item.indicator}
                  disabled={item.disabled}
                >
                  {item.label}
                </Tab>
              ))}
            </TabList>
            {items.some((i) => i.content !== undefined) &&
              items.map((item) =>
                item.content !== undefined ? (
                  <TabPanel key={item.id} id={item.id}>
                    {item.content}
                  </TabPanel>
                ) : null,
              )}
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Row container for `Tab` triggers managing horizontal Arrow/Home/End keyboard focus. */
export function TabList({ className, children, onKeyDown, ...rest }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const listEl = listRef.current;
    if (!listEl) return;

    const tabs = Array.from(
      listEl.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    if (tabs.length === 0) return;

    const currentIdx = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIdx === -1) return;

    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = tabs.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      tabs[nextIdx].focus();
      tabs[nextIdx].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn('az-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'id'> {
  id: string;
  icon?: ReactNode;
  indicator?: ReactNode;
  disabled?: boolean;
}

/** Individual interactive tab trigger button. */
export function Tab({
  id,
  icon,
  indicator,
  disabled = false,
  className,
  children,
  onClick,
  ...rest
}: TabProps) {
  const { baseId, activeId, selectTab } = useTabsContext();
  const isSelected = activeId === id;

  return (
    <button
      id={`${baseId}-tab-${id}`}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${id}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={cn('az-tab', className)}
      onClick={(e) => {
        if (!disabled) selectTab(id);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="az-tab__label-wrap">
        {icon}
        <span>{children}</span>
        {indicator !== undefined && <span className="az-tab__indicator">{indicator}</span>}
      </span>
    </button>
  );
}

export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string;
  children: ReactNode;
}

/** Associated content panel revealed when its matching `Tab` is selected. */
export function TabPanel({ id, className, children, ...rest }: TabPanelProps) {
  const { baseId, activeId } = useTabsContext();
  const isSelected = activeId === id;

  return (
    <div
      id={`${baseId}-panel-${id}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${id}`}
      hidden={!isSelected}
      className={cn('az-tabs__panel', className)}
      {...rest}
    >
      {isSelected ? children : null}
    </div>
  );
}

