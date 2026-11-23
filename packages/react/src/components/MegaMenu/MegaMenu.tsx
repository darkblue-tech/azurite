import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ArrowRightIcon, BrandMark, ChevronDownIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { Button } from '../Button/Button';

export interface MegaMenuLink {
  id: string;
  label: ReactNode;
  href?: string;
  strong?: boolean;
  onClick?: () => void;
}

export interface MegaMenuColumn {
  title: ReactNode;
  links: MegaMenuLink[];
}

export interface MegaMenuActionColumn {
  title: ReactNode;
  links: { label: ReactNode; primary?: boolean; href?: string; onClick?: () => void }[];
  cta?: { label: ReactNode; href?: string; onClick?: () => void };
}

export interface MegaMenuFeatureCard {
  title: ReactNode;
  eyebrow?: ReactNode;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  compact?: boolean;
  onClick?: () => void;
}

export type MegaMenuVariant = 'vertical-menus' | 'actions' | 'comprehensive';

export interface MegaMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout pattern matching MegaMenu specs 01, 02, or 04. */
  variant?: MegaMenuVariant;
  /** Navigation link columns. */
  columns: MegaMenuColumn[];
  /** Controlled active link ID (used primarily in `vertical-menus` variant). */
  activeId?: string;
  /** Initial active link ID. */
  defaultActiveId?: string;
  /** Callback when link is clicked. */
  onSelectLink?: (id: string, link: MegaMenuLink) => void;
  /** Optional fourth actions column for `variant="actions"`. */
  actionsColumn?: MegaMenuActionColumn;
  /** Supporting visual feature cards rendered on the right 4 columns in `variant="comprehensive"`. */
  supportingCards?: MegaMenuFeatureCard[];
}

/**
 * Multi-column MegaMenu container supporting small vertical lists, plain-text + action columns,
 * and comprehensive 12-column panels paired with editorial supporting imagery.
 */
export function MegaMenu({
  variant = 'vertical-menus',
  columns,
  activeId,
  defaultActiveId,
  onSelectLink,
  actionsColumn,
  supportingCards,
  className,
  style,
  ...rest
}: MegaMenuProps) {
  const [selectedId, setSelectedId] = useControllableState<string>({
    value: activeId,
    defaultValue: defaultActiveId ?? '',
  });

  const handleLinkClick = (link: MegaMenuLink) => {
    setSelectedId(link.id);
    link.onClick?.();
    onSelectLink?.(link.id, link);
  };

  if (variant === 'comprehensive') {
    return (
      <div className={cn('az-megamenu', 'az-megamenu--comprehensive', className)} style={style} {...rest}>
        <div
          className="az-megamenu__cols"
          style={{ '--az-mm-cols': Math.min(4, columns.length) } as CSSProperties}
        >
          {columns.map((col, idx) => (
            <div key={idx} className="az-megamenu__col az-megamenu__col--divided">
              <span className="az-megamenu__col-heading az-megamenu__col-heading--label">
                {col.title}
              </span>
              <div className="az-megamenu__list az-megamenu__list--plain">
                {col.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href ?? `#${link.id}`}
                    className={cn(
                      'az-megamenu__link',
                      'az-megamenu__link--plain',
                      link.strong && 'az-megamenu__link--plain-strong',
                    )}
                    onClick={() => handleLinkClick(link)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {supportingCards && supportingCards.length > 0 && (
          <div className="az-megamenu__media-col">
            {supportingCards.map((card, cIdx) =>
              card.compact ? (
                <a
                  key={cIdx}
                  href={card.href ?? '#'}
                  className="az-megamenu__feature-compact"
                  onClick={() => card.onClick?.()}
                >
                  <div className="az-megamenu__feature-thumb">
                    <img src={card.imageSrc} alt={card.imageAlt} className="az-megamenu__feature-img" />
                  </div>
                  <div className="az-megamenu__feature-meta">
                    {card.eyebrow && (
                      <span className="az-megamenu__feature-eyebrow">{card.eyebrow}</span>
                    )}
                    <span className="az-megamenu__feature-title">{card.title}</span>
                  </div>
                </a>
              ) : (
                <a
                  key={cIdx}
                  href={card.href ?? '#'}
                  className="az-megamenu__feature-hero"
                  onClick={() => card.onClick?.()}
                >
                  <div className="az-megamenu__feature-img-wrap">
                    <img src={card.imageSrc} alt={card.imageAlt} className="az-megamenu__feature-img" />
                  </div>
                  <div className="az-megamenu__feature-foot">
                    <span className="az-megamenu__feature-title">{card.title}</span>
                    <ArrowRightIcon size={16} style={{ color: 'var(--az-color-primary)' }} />
                  </div>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  const totalCols = columns.length + (variant === 'actions' && actionsColumn ? 1 : 0);

  return (
    <div
      className={cn('az-megamenu', className)}
      style={{ '--az-mm-cols': Math.min(5, Math.max(1, totalCols)), ...style } as CSSProperties}
      {...rest}
    >
      <div className="az-megamenu__cols">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={cn('az-megamenu__col', variant === 'actions' && 'az-megamenu__col--divided')}
          >
            {variant === 'actions' ? (
              <h3 className="az-megamenu__col-heading">{col.title}</h3>
            ) : (
              <span className="az-megamenu__col-label">{col.title}</span>
            )}

            <ul className={cn('az-megamenu__list', variant === 'actions' && 'az-megamenu__list--plain')}>
              {col.links.map((link) => {
                const isActive = variant === 'vertical-menus' && link.id === selectedId;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href ?? `#${link.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'az-megamenu__link',
                        variant === 'actions' && 'az-megamenu__link--plain',
                        isActive && 'az-megamenu__link--active',
                      )}
                      onClick={() => handleLinkClick(link)}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {variant === 'actions' && actionsColumn && (
          <div className="az-megamenu__col az-megamenu__col--divided">
            <h3 className="az-megamenu__col-heading">{actionsColumn.title}</h3>
            <div className="az-megamenu__actions-col">
              {actionsColumn.links.map((item, aIdx) => (
                <button
                  key={aIdx}
                  type="button"
                  className={cn(
                    'az-megamenu__action-link',
                    item.primary && 'az-megamenu__action-link--primary',
                  )}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ))}
              {actionsColumn.cta && (
                <Button
                  variant="solid"
                  size="md"
                  style={{ marginTop: 8 }}
                  onClick={actionsColumn.cta.onClick}
                >
                  {actionsColumn.cta.label}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Variation 03: Interactive Popover MegaMenu */
export interface MegaMenuPopoverTile {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  href?: string;
  featured?: boolean;
  onClick?: () => void;
}

export interface MegaMenuPopoverCategory {
  id: string;
  label: ReactNode;
  subTabs?: { id: string; label: ReactNode }[];
  ctaLabel?: ReactNode;
  ctaHref?: string;
  tiles: MegaMenuPopoverTile[];
}

export interface MegaMenuPopoverProps extends HTMLAttributes<HTMLDivElement> {
  categories: MegaMenuPopoverCategory[];
  /** 'preview' keeps the broad popover open below triggers; 'popover' toggles on click & closes outside. */
  mode?: 'preview' | 'popover';
  defaultCategoryId?: string;
}

export function MegaMenuPopover({
  categories,
  mode = 'preview',
  defaultCategoryId,
  className,
  ...rest
}: MegaMenuPopoverProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() =>
    mode === 'preview' ? defaultCategoryId ?? categories[0]?.id ?? null : null,
  );

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ??
    (mode === 'preview' ? categories[0] : null);

  const [activeSubTab, setActiveSubTab] = useState<string>(
    () => activeCategory?.subTabs?.[0]?.id ?? '',
  );

  useEffect(() => {
    setActiveSubTab(activeCategory?.subTabs?.[0]?.id ?? '');
  }, [activeCategory?.id]);

  useOutsideClick(wrapRef, () => mode === 'popover' && setActiveCategoryId(null), mode === 'popover' && activeCategoryId !== null);

  useEffect(() => {
    if (mode !== 'popover' || activeCategoryId === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCategoryId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, activeCategoryId]);

  const handleTriggerClick = (catId: string) => {
    if (mode === 'popover') {
      setActiveCategoryId((prev) => (prev === catId ? null : catId));
    } else {
      setActiveCategoryId(catId);
    }
  };

  return (
    <div ref={wrapRef} className={cn('az-megamenu-pop-wrap', className)} {...rest}>
      <div className="az-megamenu__triggers">
        {categories.map((cat) => {
          const active = cat.id === activeCategory?.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-expanded={active}
              className={cn('az-megamenu__trigger', active && 'az-megamenu__trigger--active')}
              onClick={() => handleTriggerClick(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="az-megamenu__trigger-chev" aria-hidden="true">
                <ChevronDownIcon size={16} />
              </span>
            </button>
          );
        })}
      </div>

      {activeCategory && (
        <div
          className={cn(
            'az-megamenu__popover',
            mode === 'popover' && 'az-megamenu__popover--floating',
          )}
        >
          {(activeCategory.subTabs || activeCategory.ctaLabel) && (
            <div className="az-megamenu__subbar">
              <div className="az-megamenu__subtabs">
                {activeCategory.subTabs?.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className={cn(
                      'az-megamenu__subtab',
                      sub.id === activeSubTab && 'az-megamenu__subtab--active',
                    )}
                    onClick={() => setActiveSubTab(sub.id)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
              {activeCategory.ctaLabel && (
                <a href={activeCategory.ctaHref ?? '#'} className="az-megamenu__cta-link">
                  <span>{activeCategory.ctaLabel}</span>
                  <ArrowRightIcon size={15} />
                </a>
              )}
            </div>
          )}

          <div className="az-megamenu__cards-grid">
            {activeCategory.tiles.map((tile) => (
              <a
                key={tile.id}
                href={tile.href ?? `#${tile.id}`}
                className="az-megamenu__tile"
                onClick={() => tile.onClick?.()}
              >
                {tile.icon && (
                  <span
                    className={cn(
                      'az-megamenu__tile-icon',
                      tile.featured && 'az-megamenu__tile-icon--featured',
                    )}
                    aria-hidden="true"
                  >
                    {tile.icon}
                  </span>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span className="az-megamenu__tile-title">{tile.title}</span>
                  {tile.subtitle && (
                    <span className="az-megamenu__tile-sub">{tile.subtitle}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Variation 05: Minimal Navbar with Directly Attached MegaMenu Drawer */
export interface MegaMenuIntegratedProps extends HTMLAttributes<HTMLDivElement> {
  brandTitle?: ReactNode;
  brand?: ReactNode;
  toggleLabel?: ReactNode;
  links?: { label: ReactNode; href?: string }[];
  trailingActions?: ReactNode;
  columns: MegaMenuColumn[];
  promo?: {
    eyebrow?: ReactNode;
    title: ReactNode;
    ctaLabel: ReactNode;
    ctaHref?: string;
    onCtaClick?: () => void;
  };
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MegaMenuIntegrated({
  brandTitle = 'Studio',
  brand,
  toggleLabel = 'Catalog',
  links = [],
  trailingActions,
  columns,
  promo,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
  ...rest
}: MegaMenuIntegratedProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <div
      className={cn(
        'az-megamenu-integrated',
        !isOpen && 'az-megamenu-integrated--closed',
        className,
      )}
      {...rest}
    >
      <nav aria-label="Minimal integrated navigation" className="az-megamenu-integrated__bar">
        {brand ?? (
          <a
            href="#brand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              color: 'var(--az-color-on-surface)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: 'var(--az-color-primary)',
                color: 'var(--az-color-on-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <BrandMark size={13} />
            </span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{brandTitle}</span>
          </a>
        )}

        <div className="az-megamenu-integrated__nav">
          {links.slice(0, 1).map((l, i) => (
            <a
              key={i}
              href={l.href ?? '#'}
              className="az-megamenu__link az-megamenu__link--plain"
            >
              {l.label}
            </a>
          ))}

          <button
            type="button"
            aria-expanded={isOpen}
            className={cn(
              'az-megamenu-integrated__toggle',
              isOpen && 'az-megamenu-integrated__toggle--open',
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{toggleLabel}</span>
            <span className="az-megamenu-integrated__chev" aria-hidden="true">
              <ChevronDownIcon size={18} />
            </span>
          </button>

          {links.slice(1).map((l, i) => (
            <a
              key={i + 1}
              href={l.href ?? '#'}
              className="az-megamenu__link az-megamenu__link--plain"
            >
              {l.label}
            </a>
          ))}
        </div>

        {trailingActions && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {trailingActions}
          </div>
        )}
      </nav>

      <div
        className={cn(
          'az-megamenu-integrated__drawer',
          isOpen && 'az-megamenu-integrated__drawer--open',
        )}
      >
        <div className="az-megamenu-integrated__drawer-inner">
          <div className="az-megamenu-integrated__content">
            {columns.map((col, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="az-drawer__section-title" style={{ paddingInline: 0 }}>
                  {col.title}
                </span>
                {col.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href ?? `#${link.id}`}
                    className={cn(
                      'az-megamenu__link',
                      'az-megamenu__link--plain',
                      link.strong && 'az-megamenu__link--plain-strong',
                    )}
                    onClick={() => link.onClick?.()}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}

            {promo && (
              <div className="az-megamenu-integrated__promo">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {promo.eyebrow && (
                    <span className="az-megamenu-integrated__promo-eye">{promo.eyebrow}</span>
                  )}
                  <span className="az-megamenu-integrated__promo-title">{promo.title}</span>
                </div>
                <a
                  href={promo.ctaHref ?? '#'}
                  className="az-megamenu__cta-link"
                  style={{ marginTop: 12 }}
                  onClick={() => promo.onCtaClick?.()}
                >
                  <span>{promo.ctaLabel}</span>
                  <ArrowRightIcon size={15} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

