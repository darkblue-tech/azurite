import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CropSquareIcon,
  LanguageIcon,
  LockIcon,
  LockOpenIcon,
  MinusIcon,
  RefreshIcon,
} from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import type { MockupChrome, MockupTheme } from '../ConsoleMockup/ConsoleMockup';

export type BrowserElevation = 'flat' | 'soft' | 'floating';

export interface BrowserTab {
  id: string;
  title: ReactNode;
  url?: string;
  icon?: ReactNode;
}

export interface BrowserMockupProps extends HTMLAttributes<HTMLDivElement> {
  /** Displayed URL in the pill address bar (overridden when active tab defines `url`). */
  url?: string;
  /** Shows HTTPS lock icon vs insecure unlock warning indicator. */
  secure?: boolean;
  /** Window frame controls style. */
  chrome?: MockupChrome;
  /** Color polarity for chrome and inner viewport (`auto` adapts to page theme). */
  theme?: MockupTheme;
  /** Optional interactive browser tabs above the toolbar. */
  tabs?: BrowserTab[];
  /** Controlled active tab ID when `tabs` is provided. */
  activeTab?: string;
  /** Initial uncontrolled active tab ID. */
  defaultActiveTab?: string;
  /** Callback fired when selecting a tab. */
  onTabChange?: (tabId: string, tab: BrowserTab) => void;
  /** Renders Back/Forward navigation chevrons. */
  showNavControls?: boolean;
  /** Renders Refresh button inside the address bar. */
  showReload?: boolean;
  /** Callback fired when the Refresh button is clicked. */
  onReload?: () => void;
  /** Optional trailing toolbar controls (e.g. avatar, share, theme pill). */
  toolbarEnd?: ReactNode;
  /** Container elevation depth (`flat`, `soft`, or `floating`). */
  elevation?: BrowserElevation;
  /** Inner viewport padding preset. */
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  /** Fixed or max height constraint on the browser viewport. */
  viewportHeight?: number | string;
  /** Applies subtle RGB ambient aura reserved for AI web previews. */
  aura?: boolean;
  children?: ReactNode;
}

function splitUrlParts(rawUrl: string): { protocol: string; host: string; rest: string } {
  const trimmed = rawUrl.trim();
  const protoMatch = /^(https?:\/\/)(.*)$/i.exec(trimmed);
  const protocol = protoMatch ? protoMatch[1] : '';
  const withoutProto = protoMatch ? protoMatch[2] : trimmed;
  const slashIdx = withoutProto.indexOf('/');
  if (slashIdx === -1) {
    return { protocol, host: withoutProto, rest: '' };
  }
  return {
    protocol,
    host: withoutProto.slice(0, slashIdx),
    rest: withoutProto.slice(slashIdx),
  };
}

/**
 * Clean Swiss-M3 desktop BrowserMockup frame supporting switchable chrome,
 * interactive tabs, pill address bar with HTTPS state, reload spin, and themed viewport.
 */
export function BrowserMockup({
  url = 'https://design.darkblue.tech',
  secure = true,
  chrome = 'macos',
  theme = 'auto',
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  showNavControls = true,
  showReload = true,
  onReload,
  toolbarEnd,
  elevation = 'soft',
  contentPadding = 'md',
  viewportHeight,
  aura = false,
  className,
  children,
  ...rest
}: BrowserMockupProps) {
  const hasTabs = Boolean(tabs && tabs.length > 0);
  const [selectedTabId, setSelectedTabId] = useControllableState<string>({
    value: activeTab,
    defaultValue: defaultActiveTab ?? tabs?.[0]?.id ?? '',
  });

  const [isReloading, setIsReloading] = useState(false);
  const reloadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (reloadTimerRef.current !== null) {
        window.clearTimeout(reloadTimerRef.current);
      }
    };
  }, []);

  const currentTab = useMemo(() => {
    if (!tabs || tabs.length === 0) return undefined;
    return tabs.find((t) => t.id === selectedTabId) ?? tabs[0];
  }, [tabs, selectedTabId]);

  const effectiveUrl = currentTab?.url ?? url;
  const { protocol, host, rest: urlPath } = useMemo(
    () => splitUrlParts(effectiveUrl),
    [effectiveUrl],
  );

  const handleReload = () => {
    setIsReloading(true);
    onReload?.();
    if (reloadTimerRef.current !== null) {
      window.clearTimeout(reloadTimerRef.current);
    }
    reloadTimerRef.current = window.setTimeout(() => {
      setIsReloading(false);
      reloadTimerRef.current = null;
    }, 450);
  };

  const handleSelectTab = (tab: BrowserTab) => {
    setSelectedTabId(tab.id);
    onTabChange?.(tab.id, tab);
  };

  const resolvedViewportHeight =
    viewportHeight !== undefined
      ? typeof viewportHeight === 'number'
        ? `${viewportHeight}px`
        : viewportHeight
      : undefined;

  return (
    <div
      className={cn(
        'az-browser',
        `az-browser--theme-${theme}`,
        `az-browser--chrome-${chrome}`,
        `az-browser--elevation-${elevation}`,
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {hasTabs && (
        <div className="az-browser__tabstrip">
          {chrome === 'macos' && (
            <div className="az-mockup-dots az-browser__dots" aria-hidden="true">
              <span className="az-mockup-dot az-mockup-dot--close" />
              <span className="az-mockup-dot az-mockup-dot--min" />
              <span className="az-mockup-dot az-mockup-dot--max" />
            </div>
          )}

          <div className="az-browser__tabs" role="tablist" aria-label="Browser tabs">
            {tabs!.map((tab) => {
              const active = currentTab?.id === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    'az-browser__tab',
                    active && 'az-browser__tab--active',
                  )}
                  onClick={() => handleSelectTab(tab)}
                >
                  <span className="az-browser__tab-icon" aria-hidden="true">
                    {tab.icon ?? <LanguageIcon size={14} />}
                  </span>
                  <span className="az-browser__tab-title">{tab.title}</span>
                </button>
              );
            })}
          </div>

          {chrome === 'windows' && (
            <div className="az-mockup-win-controls" aria-hidden="true">
              <span className="az-mockup-win-btn">
                <MinusIcon size={14} />
              </span>
              <span className="az-mockup-win-btn">
                <CropSquareIcon size={12} />
              </span>
              <span className="az-mockup-win-btn">
                <CloseIcon size={14} />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="az-browser__toolbar">
        <div className="az-browser__toolbar-start">
          {!hasTabs && chrome === 'macos' && (
            <div className="az-mockup-dots" aria-hidden="true">
              <span className="az-mockup-dot az-mockup-dot--close" />
              <span className="az-mockup-dot az-mockup-dot--min" />
              <span className="az-mockup-dot az-mockup-dot--max" />
            </div>
          )}
          {showNavControls && (
            <div className="az-browser__nav-btns" aria-hidden="true">
              <span className="az-browser__nav-btn">
                <ChevronLeftIcon size={16} />
              </span>
              <span className="az-browser__nav-btn az-browser__nav-btn--disabled">
                <ChevronRightIcon size={16} />
              </span>
            </div>
          )}
        </div>

        <div className="az-browser__address-bar" title={effectiveUrl}>
          <span
            className={cn(
              'az-browser__security-icon',
              secure ? 'az-browser__security-icon--secure' : 'az-browser__security-icon--insecure',
            )}
            aria-hidden="true"
          >
            {secure ? <LockIcon size={13} /> : <LockOpenIcon size={13} />}
          </span>

          <div className="az-browser__url">
            {protocol && <span className="az-browser__url-muted">{protocol}</span>}
            <span className="az-browser__url-host">{host}</span>
            {urlPath && <span className="az-browser__url-muted">{urlPath}</span>}
          </div>

          {showReload && (
            <button
              type="button"
              className={cn(
                'az-browser__reload-btn',
                isReloading && 'az-browser__reload-btn--spinning',
              )}
              onClick={handleReload}
              aria-label="Reload page"
              title="Reload"
            >
              <RefreshIcon size={14} />
            </button>
          )}
        </div>

        <div className="az-browser__toolbar-end">
          {toolbarEnd}
          {!hasTabs && chrome === 'windows' && (
            <div className="az-mockup-win-controls" aria-hidden="true">
              <span className="az-mockup-win-btn">
                <MinusIcon size={14} />
              </span>
              <span className="az-mockup-win-btn">
                <CropSquareIcon size={12} />
              </span>
              <span className="az-mockup-win-btn">
                <CloseIcon size={14} />
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        data-theme={theme !== 'auto' ? theme : undefined}
        className={cn(
          'az-browser__viewport',
          `az-browser__viewport--pad-${contentPadding}`,
        )}
        style={resolvedViewportHeight ? { height: resolvedViewportHeight } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

