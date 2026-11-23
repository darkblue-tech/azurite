import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeIcon,
  CopyIcon,
  WrapTextIcon,
} from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import {
  getLanguageLabel,
  normalizeLanguage,
  tokenizeCode,
  type CodeLanguage,
  type SyntaxToken,
  type SyntaxTokenType,
} from './tokenizer';

export {
  getLanguageLabel,
  normalizeLanguage,
  tokenizeCode,
  type CodeLanguage,
  type SyntaxToken,
  type SyntaxTokenType,
};

export type CodeBlockTheme = 'auto' | 'light' | 'dark';

export interface CodeBlockFile {
  id: string;
  label: string;
  code: string;
  language?: CodeLanguage;
  filename?: string;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  startLine?: number;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  /** Source code string rendered when `files` is not provided. */
  code?: string;
  /** Syntax language for built-in zero-dependency highlighting. */
  language?: CodeLanguage;
  /** Optional filename or label displayed in the header bar. */
  filename?: string;
  /** Optional multi-file tab descriptors sharing a single CodeBlock container. */
  files?: CodeBlockFile[];
  /** Controlled active file ID when using `files`. */
  activeFile?: string;
  /** Initial uncontrolled active file ID. */
  defaultActiveFile?: string;
  /** Callback fired when switching file tabs. */
  onActiveFileChange?: (fileId: string, file: CodeBlockFile) => void;
  /** Color polarity: `'auto'` follows Azurite light/dark theme; `'light'`/`'dark'` force contrast. */
  theme?: CodeBlockTheme;
  /** Renders top header bar with filename/tabs and utility actions. */
  showHeader?: boolean;
  /** Shows calibrated language pill badge in header. */
  showLanguageBadge?: boolean;
  /** Displays tabular-numeral line numbers in the gutter. */
  showLineNumbers?: boolean;
  /** Starting line number offset (default 1). */
  startLine?: number;
  /** Enables header Copy button with animated check confirmation. */
  copyable?: boolean;
  /** Callback invoked with active code string after copying. */
  onCopy?: (code: string) => void;
  /** Controlled soft line-wrapping state. */
  wrapLines?: boolean;
  /** Default uncontrolled line-wrapping state. */
  defaultWrapLines?: boolean;
  /** Callback fired when toggling word-wrap. */
  onWrapLinesChange?: (wrap: boolean) => void;
  /** Displays an interactive Wrap Text toggle button in the header. */
  allowWrapToggle?: boolean;
  /** 1-indexed line numbers highlighted with Royal Blue focus tint. */
  highlightLines?: number[];
  /** 1-indexed line numbers marked with emerald `+` diff indicator. */
  addedLines?: number[];
  /** 1-indexed line numbers marked with rose `-` diff indicator. */
  removedLines?: number[];
  /** Optional maximum viewport height before scrolling (e.g. `360` or `'24rem'`). */
  maxHeight?: number | string;
  /** Clamps long snippets with gradient fade and Expand/Collapse toggle. */
  collapsible?: boolean;
  /** Height in pixels when `collapsible` is collapsed (default `220`). */
  collapsedHeight?: number;
  /** Controlled expanded state for `collapsible` mode. */
  expanded?: boolean;
  /** Initial uncontrolled expanded state for `collapsible` mode. */
  defaultExpanded?: boolean;
  /** Callback fired when toggling collapse state. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Custom action slot rendered before header utility buttons (e.g. timing badge). */
  headerActions?: ReactNode;
  /** Optional caption footer displayed beneath the code viewport. */
  caption?: ReactNode;
  /** Tighter spacing and `lg` radius when embedding inside cards or workbenches. */
  compact?: boolean;
  /** Applies subtle RGB ambient aura reserved for AI-generated snippets. */
  aura?: boolean;
}

/**
 * Editorial syntax-highlighted CodeBlock with built-in multi-language tokenizer,
 * light/dark polarity, multi-file tabs, diff/focus line markers, line wrap toggle,
 * collapsible overflow, and one-click clipboard copy.
 */
export function CodeBlock({
  code = '',
  language = 'tsx',
  filename,
  files,
  activeFile,
  defaultActiveFile,
  onActiveFileChange,
  theme = 'auto',
  showHeader = true,
  showLanguageBadge = true,
  showLineNumbers = false,
  startLine = 1,
  copyable = true,
  onCopy,
  wrapLines,
  defaultWrapLines = false,
  onWrapLinesChange,
  allowWrapToggle = false,
  highlightLines,
  addedLines,
  removedLines,
  maxHeight,
  collapsible = false,
  collapsedHeight = 220,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  headerActions,
  caption,
  compact = false,
  aura = false,
  className,
  style,
  ...rest
}: CodeBlockProps) {
  const hasFiles = Boolean(files && files.length > 0);
  const firstFileId = files?.[0]?.id ?? '';

  const [currentFileId, setCurrentFileId] = useControllableState<string>({
    value: activeFile,
    defaultValue: defaultActiveFile ?? firstFileId,
  });

  const [isWrapped, setIsWrapped] = useControllableState<boolean>({
    value: wrapLines,
    defaultValue: defaultWrapLines,
    onChange: onWrapLinesChange,
  });

  const [isExpanded, setIsExpanded] = useControllableState<boolean>({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const selectedFile = useMemo(() => {
    if (!files || files.length === 0) return undefined;
    return files.find((f) => f.id === currentFileId) ?? files[0];
  }, [files, currentFileId]);

  const activeCode = selectedFile ? selectedFile.code : code;
  const activeLanguage = selectedFile?.language ?? language;
  const activeFilename = selectedFile?.filename ?? filename;
  const activeStartLine = selectedFile?.startLine ?? startLine;

  const highlightSet = useMemo(
    () => new Set(selectedFile?.highlightLines ?? highlightLines ?? []),
    [selectedFile?.highlightLines, highlightLines],
  );
  const addedSet = useMemo(
    () => new Set(selectedFile?.addedLines ?? addedLines ?? []),
    [selectedFile?.addedLines, addedLines],
  );
  const removedSet = useMemo(
    () => new Set(selectedFile?.removedLines ?? removedLines ?? []),
    [selectedFile?.removedLines, removedLines],
  );

  const hasDiffColumn = addedSet.size > 0 || removedSet.size > 0;
  const tokenizedLines = useMemo(
    () => tokenizeCode(activeCode, activeLanguage),
    [activeCode, activeLanguage],
  );

  const languageLabel = getLanguageLabel(activeLanguage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
    } catch {
      // Safe no-op if clipboard permissions are restricted
    }
    setCopied(true);
    onCopy?.(activeCode);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 1800);
  };

  const handleSelectFile = (file: CodeBlockFile) => {
    setCurrentFileId(file.id);
    onActiveFileChange?.(file.id, file);
  };

  const resolvedMaxHeight =
    collapsible && !isExpanded
      ? `${collapsedHeight}px`
      : maxHeight !== undefined
        ? typeof maxHeight === 'number'
          ? `${maxHeight}px`
          : maxHeight
        : undefined;

  const shouldRenderHeader =
    showHeader &&
    (hasFiles ||
      Boolean(activeFilename) ||
      showLanguageBadge ||
      copyable ||
      allowWrapToggle ||
      Boolean(headerActions));

  return (
    <div
      className={cn(
        'az-codeblock',
        `az-codeblock--theme-${theme}`,
        compact && 'az-codeblock--compact',
        isWrapped && 'az-codeblock--wrap',
        collapsible && !isExpanded && 'az-codeblock--collapsed',
        aura && 'az-aura',
        className,
      )}
      style={style}
      {...rest}
    >
      {shouldRenderHeader && (
        <div className="az-codeblock__header">
          <div className="az-codeblock__lead">
            {hasFiles ? (
              <div className="az-codeblock__tabs" role="tablist" aria-label="Code files">
                {files!.map((file) => {
                  const active = selectedFile?.id === file.id;
                  return (
                    <button
                      key={file.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={cn(
                        'az-codeblock__tab',
                        active && 'az-codeblock__tab--active',
                      )}
                      onClick={() => handleSelectFile(file)}
                    >
                      {file.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="az-codeblock__title">
                <CodeIcon size={15} className="az-codeblock__title-icon" />
                <span className="az-codeblock__filename">
                  {activeFilename || languageLabel}
                </span>
              </div>
            )}
          </div>

          <div className="az-codeblock__actions">
            {headerActions}
            {showLanguageBadge && (hasFiles || Boolean(activeFilename)) && (
              <span className="az-codeblock__lang">{languageLabel}</span>
            )}
            {allowWrapToggle && (
              <button
                type="button"
                className={cn(
                  'az-codeblock__icon-btn',
                  isWrapped && 'az-codeblock__icon-btn--active',
                )}
                aria-pressed={isWrapped}
                aria-label={isWrapped ? 'Disable line wrap' : 'Enable line wrap'}
                title={isWrapped ? 'Disable line wrap' : 'Enable line wrap'}
                onClick={() => setIsWrapped(!isWrapped)}
              >
                <WrapTextIcon size={15} />
              </button>
            )}
            {copyable && (
              <button
                type="button"
                className={cn(
                  'az-codeblock__copy-btn',
                  copied && 'az-codeblock__copy-btn--copied',
                )}
                onClick={handleCopy}
                aria-label={copied ? 'Copied code' : 'Copy code'}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="az-codeblock__viewport-wrap">
        {!shouldRenderHeader && copyable && (
          <button
            type="button"
            className={cn(
              'az-codeblock__copy-btn',
              'az-codeblock__copy-btn--floating',
              copied && 'az-codeblock__copy-btn--copied',
            )}
            onClick={handleCopy}
            aria-label={copied ? 'Copied code' : 'Copy code'}
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}

        <div
          className="az-codeblock__scroller"
          style={resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : undefined}
        >
          <pre className="az-codeblock__pre">
            <code className="az-codeblock__code">
              {tokenizedLines.map((lineTokens, idx) => {
                const lineNum = activeStartLine + idx;
                const isAdded = addedSet.has(lineNum);
                const isRemoved = removedSet.has(lineNum);
                const isHighlighted = highlightSet.has(lineNum);
                const diffMarker = isAdded ? '+' : isRemoved ? '-' : hasDiffColumn ? ' ' : null;

                return (
                  <span
                    key={lineNum}
                    className={cn(
                      'az-codeblock__line',
                      isHighlighted && 'az-codeblock__line--highlighted',
                      isAdded && 'az-codeblock__line--added',
                      isRemoved && 'az-codeblock__line--removed',
                    )}
                  >
                    {showLineNumbers && (
                      <span className="az-codeblock__line-number" aria-hidden="true">
                        {lineNum}
                      </span>
                    )}
                    {diffMarker !== null && (
                      <span className="az-codeblock__diff-sign" aria-hidden="true">
                        {diffMarker}
                      </span>
                    )}
                    <span className="az-codeblock__line-content">
                      {lineTokens.length === 0
                        ? '\u200B'
                        : lineTokens.map((token, tIdx) =>
                            token.type === 'plain' ? (
                              token.value
                            ) : (
                              <span key={tIdx} className={`az-tok-${token.type}`}>
                                {token.value}
                              </span>
                            ),
                          )}
                    </span>
                  </span>
                );
              })}
            </code>
          </pre>
        </div>

        {collapsible && (
          <div className="az-codeblock__collapse-bar">
            <button
              type="button"
              className="az-codeblock__expand-btn"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUpIcon size={15} /> : <ChevronDownIcon size={15} />}
              <span>{isExpanded ? 'Collapse code' : 'Expand code'}</span>
            </button>
          </div>
        )}
      </div>

      {caption && <div className="az-codeblock__caption">{caption}</div>}
    </div>
  );
}

