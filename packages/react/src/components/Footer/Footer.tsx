import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FooterLink {
  label: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

export interface FooterColumn {
  title: ReactNode;
  links: FooterLink[];
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Custom oversized branding element replacing default brandPrefix/brandSuffix wordmark. */
  wordmark?: ReactNode;
  /** First brand segment rendered before the primary dot (default 'darkblue'). */
  brandPrefix?: string;
  /** Renders primary-colored accent dot between segments (default true). */
  brandDot?: boolean;
  /** Trailing brand segment rendered after dot (default 'tech'). */
  brandSuffix?: string;
  /** Minimalist link columns rendered below hairline rule. */
  columns: FooterColumn[];
  /** Optional legal/copyright row beneath navigation grid. */
  bottomBar?: ReactNode;
  /** Applies optional rounded card surface styling (default false — full-width flush footer). */
  contained?: boolean;
  /** Surface container tone. */
  surface?: 'default' | 'low' | 'transparent';
  ariaLabel?: string;
}

/**
 * Swiss-inspired full-width editorial Footer featuring staggered kinetic wordmark
 * reveal, hairline draw-in, and tactile multi-column link navigation.
 */
export function Footer({
  wordmark,
  brandPrefix = 'darkblue',
  brandDot = true,
  brandSuffix = 'tech',
  columns,
  bottomBar,
  contained = false,
  surface = 'default',
  ariaLabel = 'Site footer',
  className,
  style,
  ...rest
}: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cols = Math.max(1, Math.min(6, columns.length));
  const prefixChars = Array.from(brandPrefix);
  const suffixChars = Array.from(brandSuffix);
  const fullLabel = `${brandPrefix}${brandDot ? '.' : ''}${brandSuffix}`;

  return (
    <footer
      ref={footerRef}
      aria-label={ariaLabel}
      data-visible={visible ? 'true' : 'false'}
      className={cn(
        'az-footer',
        contained && 'az-footer--contained',
        surface !== 'default' && `az-footer--${surface}`,
        className,
      )}
      style={{ '--az-footer-cols': cols, ...style } as CSSProperties}
      {...rest}
    >
      <div className="az-footer__wordmark" aria-label={wordmark ? undefined : fullLabel}>
        {wordmark ?? (
          <>
            {prefixChars.map((ch, idx) => (
              <span key={`p-${idx}`} className="az-footer__char-mask" aria-hidden="true">
                <span
                  className="az-footer__char"
                  style={{ '--az-char-i': idx } as CSSProperties}
                >
                  {ch}
                </span>
              </span>
            ))}
            {brandDot && (
              <span className="az-footer__char-mask" aria-hidden="true">
                <span
                  className="az-footer__char az-footer__char--dot"
                  style={{ '--az-char-i': prefixChars.length } as CSSProperties}
                >
                  .
                </span>
              </span>
            )}
            {suffixChars.map((ch, idx) => (
              <span key={`s-${idx}`} className="az-footer__char-mask" aria-hidden="true">
                <span
                  className="az-footer__char"
                  style={{ '--az-char-i': prefixChars.length + (brandDot ? 1 : 0) + idx } as CSSProperties}
                >
                  {ch}
                </span>
              </span>
            ))}
          </>
        )}
      </div>

      <nav aria-label="Footer navigation" className="az-footer__nav">
        {columns.map((col, cIdx) => (
          <div
            key={cIdx}
            className="az-footer__col"
            style={{ '--az-col-i': cIdx } as CSSProperties}
          >
            <span className="az-footer__col-title">{col.title}</span>
            {col.links.map((link, lIdx) =>
              link.href ? (
                <a
                  key={lIdx}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="az-footer__link"
                  onClick={() => link.onClick?.()}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={lIdx}
                  type="button"
                  className="az-footer__link"
                  onClick={() => link.onClick?.()}
                >
                  {link.label}
                </button>
              ),
            )}
          </div>
        ))}
      </nav>

      {bottomBar && <div className="az-footer__bottom">{bottomBar}</div>}
    </footer>
  );
}
