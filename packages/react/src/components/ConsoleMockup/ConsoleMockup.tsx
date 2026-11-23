import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  CropSquareIcon,
  MinusIcon,
  ReplayIcon,
  TerminalIcon,
} from '../../icons';
import { cn } from '../../utils/cn';

export type MockupChrome = 'macos' | 'minimal' | 'windows';
export type MockupTheme = 'auto' | 'light' | 'dark';
export type ConsoleLineTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';

export interface ConsoleLineItem {
  id?: string | number;
  prefix?: ReactNode;
  text: ReactNode;
  tone?: ConsoleLineTone;
  highlight?: boolean;
  copyable?: boolean;
}

export interface ConsoleLineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** Leading prompt or gutter symbol (e.g. `"$"`, `">"`, `"✓"`, `"info"`). */
  prefix?: ReactNode;
  /** Semantic ink role for line text. */
  tone?: ConsoleLineTone;
  /** Subtle focus background tint for callout lines. */
  highlight?: boolean;
  children?: ReactNode;
}

/**
 * Single terminal row primitive for declarative composition inside ConsoleMockup.
 */
export function ConsoleLine({
  prefix,
  tone = 'default',
  highlight = false,
  className,
  children,
  ...rest
}: ConsoleLineProps) {
  return (
    <div
      className={cn(
        'az-console__line',
        tone !== 'default' && `az-console__line--tone-${tone}`,
        highlight && 'az-console__line--highlight',
        className,
      )}
      {...rest}
    >
      {prefix !== undefined && prefix !== null && prefix !== '' && (
        <span className="az-console__prefix" aria-hidden="true">
          {prefix}
        </span>
      )}
      <span className="az-console__text">{children}</span>
    </div>
  );
}

export interface ConsoleMockupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onCopy'> {
  /** Structured command and output rows. */
  lines?: ConsoleLineItem[];
  /** Shell/window title displayed in the header bar. */
  title?: ReactNode;
  /** Window frame controls style. */
  chrome?: MockupChrome;
  /** Color polarity (defaults to `'dark'` obsidian terminal; supports `'light'` and `'auto'`). */
  theme?: MockupTheme;
  /** Optional status pill or badge in the header. */
  statusBadge?: ReactNode;
  /** Enables Copy button in header bar. */
  copyable?: boolean;
  /** Custom string copied when Copy is clicked (defaults to command lines or all `lines`). */
  copyText?: string;
  /** Callback fired with copied text. */
  onCopy?: (text: string) => void;
  /** Sequentially reveals `lines` on mount/replay. */
  animated?: boolean;
  /** Millisecond interval between revealed lines when `animated` is true. */
  lineDelayMs?: number;
  /** Displays a blinking terminal caret cursor. */
  cursor?: boolean;
  /** Soft-wraps long terminal lines instead of horizontal scroll. */
  wrapLines?: boolean;
  /** Maximum terminal viewport height before scrolling. */
  maxHeight?: number | string;
  /** Applies subtle RGB ambient aura reserved for AI terminal streams. */
  aura?: boolean;
  children?: ReactNode;
}

function extractCopyableText(lines?: ConsoleLineItem[]): string {
  if (!lines || lines.length === 0) return '';
  const commandLines = lines.filter(
    (l) => l.copyable === true || (typeof l.prefix === 'string' && (l.prefix.trim() === '$' || l.prefix.trim() === '>')),
  );
  const target = commandLines.length > 0 ? commandLines : lines;
  return target
    .map((l) => (typeof l.text === 'string' || typeof l.text === 'number' ? String(l.text) : ''))
    .filter(Boolean)
    .join('\n');
}

/**
 * Editorial CLI & terminal frame supporting hybrid `lines` array or declarative
 * `<ConsoleLine>` children, switchable window chrome, sequential playback, and Copy.
 */
export function ConsoleMockup({
  lines,
  title = 'Terminal',
  chrome = 'macos',
  theme = 'dark',
  statusBadge,
  copyable = true,
  copyText,
  onCopy,
  animated = false,
  lineDelayMs = 340,
  cursor = false,
  wrapLines = false,
  maxHeight,
  aura = false,
  className,
  children,
  ...rest
}: ConsoleMockupProps) {
  const totalLines = lines?.length ?? 0;
  const [replaySeed, setReplaySeed] = useState(0);
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    animated && totalLines > 0 ? 1 : totalLines,
  );
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animated || totalLines === 0) {
      setVisibleCount(totalLines);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisibleCount(totalLines);
      return;
    }

    setVisibleCount(1);
    let current = 1;
    let timerId: number | null = null;

    const scheduleNext = () => {
      if (current >= totalLines) return;
      timerId = window.setTimeout(() => {
        current += 1;
        setVisibleCount(current);
        scheduleNext();
      }, Math.max(80, lineDelayMs));
    };

    scheduleNext();
    return () => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, [animated, totalLines, lineDelayMs, replaySeed, lines]);

  const resolvedCopyString = copyText ?? extractCopyableText(lines);
  const canCopy = copyable && resolvedCopyString.length > 0;

  const handleCopy = async () => {
    if (!resolvedCopyString) return;
    try {
      await navigator.clipboard.writeText(resolvedCopyString);
    } catch {
      // Safe no-op if clipboard permissions are restricted
    }
    setCopied(true);
    onCopy?.(resolvedCopyString);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 1800);
  };

  const renderedLines = lines
    ? lines.slice(0, animated ? visibleCount : lines.length)
    : [];

  const resolvedMaxHeight =
    maxHeight !== undefined
      ? typeof maxHeight === 'number'
        ? `${maxHeight}px`
        : maxHeight
      : undefined;

  return (
    <div
      className={cn(
        'az-console',
        `az-console--theme-${theme}`,
        `az-console--chrome-${chrome}`,
        wrapLines && 'az-console--wrap',
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      <div className="az-console__header">
        <div className="az-console__head-start">
          {chrome === 'macos' && (
            <div className="az-mockup-dots" aria-hidden="true">
              <span className="az-mockup-dot az-mockup-dot--close" />
              <span className="az-mockup-dot az-mockup-dot--min" />
              <span className="az-mockup-dot az-mockup-dot--max" />
            </div>
          )}
          <div className="az-console__title-wrap">
            <TerminalIcon size={15} className="az-console__title-icon" />
            <span className="az-console__title">{title}</span>
          </div>
        </div>

        <div className="az-console__head-end">
          {statusBadge}
          {animated && totalLines > 0 && (
            <button
              type="button"
              className="az-console__action-btn"
              onClick={() => setReplaySeed((s) => s + 1)}
              aria-label="Replay terminal output"
              title="Replay"
            >
              <ReplayIcon size={14} />
              <span>Replay</span>
            </button>
          )}
          {canCopy && (
            <button
              type="button"
              className={cn(
                'az-console__action-btn',
                copied && 'az-console__action-btn--copied',
              )}
              onClick={handleCopy}
              aria-label={copied ? 'Copied commands' : 'Copy commands'}
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          {chrome === 'windows' && (
            <div className="az-mockup-win-controls" aria-hidden="true">
              <span className="az-mockup-win-btn">
                <MinusIcon size={14} />
              </span>
              <span className="az-mockup-win-btn">
                <CropSquareIcon size={12} />
              </span>
              <span className="az-mockup-win-btn az-mockup-win-btn--close">
                <CloseIcon size={14} />
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="az-console__body"
        style={resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : undefined}
      >
        {renderedLines.map((item, idx) => {
          const isLastRendered = idx === renderedLines.length - 1;
          const showInlineCursor = cursor && isLastRendered && !children;
          return (
            <ConsoleLine
              key={item.id ?? idx}
              prefix={item.prefix}
              tone={item.tone}
              highlight={item.highlight}
              className={animated ? 'az-console__line--animated' : undefined}
            >
              {item.text}
              {showInlineCursor && <span className="az-console__cursor" aria-hidden="true" />}
            </ConsoleLine>
          );
        })}

        {children}

        {cursor && (Boolean(children) || renderedLines.length === 0) && (
          <ConsoleLine prefix="$">
            <span className="az-console__cursor" aria-hidden="true" />
          </ConsoleLine>
        )}
      </div>
    </div>
  );
}

