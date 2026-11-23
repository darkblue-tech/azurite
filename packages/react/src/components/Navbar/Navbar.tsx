import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { BrandMark, SearchIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type NavbarLayout = 'centered-title' | 'between' | 'symmetric';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Horizontal alignment strategy: 'between', 'centered-title', or 3-column 'symmetric'. */
  layout?: NavbarLayout;
  /** Leading slot (title, brand mark, burger menu trigger). */
  start?: ReactNode;
  /** Centered slot (centered brand/logo in `symmetric`, nav links in `between`/`symmetric`, or title in `centered-title`). */
  center?: ReactNode;
  /** Trailing slot (utility icons, search, CTA button, profile dropdown). */
  end?: ReactNode;
  /** Optional second-tier sub-menu strip rendered directly below main bar. */
  subMenu?: ReactNode;
  /** Main bar height in px or CSS length (default 64). */
  height?: number | string;
  /** Uses rounded bordered card chrome vs edge-to-edge top app bar (default true). */
  contained?: boolean;
  /** Makes header sticky with frosted backdrop blur. */
  sticky?: boolean;
  /** Increases gap between inline links in wide editorial navbars. */
  wideLinks?: boolean;
  ariaLabel?: string;
}

/**
 * Modular Swiss top Navbar supporting centered titles, overflow & burger triggers,
 * two-tier visible sub-menus, integrated search bars, badge icons, and 3-column symmetric layouts.
 */
export function Navbar({
  layout = 'between',
  start,
  center,
  end,
  subMenu,
  height = 64,
  contained = true,
  sticky = false,
  wideLinks = false,
  ariaLabel = 'Top navigation',
  className,
  style,
  children,
  ...rest
}: NavbarProps) {
  const heightCss = typeof height === 'number' ? `${height}px` : height;
  const hasSubMenu = Boolean(subMenu);

  const navContent = children ? (
    children
  ) : layout === 'centered-title' ? (
    center ?? start
  ) : layout === 'symmetric' ? (
    <>
      <div className="az-navbar__slot az-navbar__slot--start">{start}</div>
      <div className="az-navbar__slot az-navbar__slot--center">{center}</div>
      <div className="az-navbar__slot az-navbar__slot--end">{end}</div>
    </>
  ) : (
    <>
      {start && <div className="az-navbar__slot az-navbar__slot--start">{start}</div>}
      {center && <div className="az-navbar__slot az-navbar__slot--center">{center}</div>}
      {end && <div className="az-navbar__slot az-navbar__slot--end">{end}</div>}
    </>
  );

  return (
    <div
      className={cn(
        'az-navbar-wrap',
        !contained && 'az-navbar-wrap--flush',
        !hasSubMenu && 'az-navbar-wrap--single',
        sticky && 'az-navbar-wrap--sticky',
        className,
      )}
      style={{ '--az-navbar-h': heightCss, ...style } as CSSProperties}
    >
      <nav
        aria-label={ariaLabel}
        className={cn(
          'az-navbar',
          `az-navbar--${layout}`,
          wideLinks && 'az-navbar--wide-links',
        )}
        {...rest}
      >
        {navContent}
      </nav>
      {subMenu}
    </div>
  );
}

export interface NavbarBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  logo?: ReactNode;
  name?: ReactNode;
}

export function NavbarBrand({ logo, name = 'Studio', href, className, ...rest }: NavbarBrandProps) {
  return (
    <a href={href ?? '#'} className={cn('az-navbar__brand', className)} {...rest}>
      <span className="az-navbar__brand-mark" aria-hidden="true">
        {logo ?? <BrandMark size={13} />}
      </span>
      <span className="az-navbar__title">{name}</span>
    </a>
  );
}

export function NavbarLinks({ className, children, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn('az-navbar__links', className)} {...rest}>
      {children}
    </ul>
  );
}

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export function NavbarLink({ active = false, className, children, ...rest }: NavbarLinkProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={cn('az-navbar__link', active && 'az-navbar__link--active', className)}
      {...rest}
    >
      {children}
    </a>
  );
}

export interface NavbarIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  badgeCount?: number;
  maxBadge?: number;
}

export function NavbarIconButton({
  badgeCount,
  maxBadge = 99,
  className,
  children,
  ...rest
}: NavbarIconButtonProps) {
  const badgeText =
    badgeCount !== undefined && badgeCount > 0
      ? badgeCount > maxBadge
        ? `${maxBadge}+`
        : String(badgeCount)
      : null;

  return (
    <button type="button" className={cn('az-navbar__icon-btn', className)} {...rest}>
      {children}
      {badgeText && <span className="az-navbar__icon-badge">{badgeText}</span>}
    </button>
  );
}

export interface NavbarSearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function NavbarSearch({
  value,
  defaultValue = '',
  onValueChange,
  onChange,
  placeholder = 'Search...',
  className,
  ...rest
}: NavbarSearchProps) {
  const [query, setQuery] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div className={cn('az-navbar__search', className)}>
      <span className="az-navbar__search-icon" aria-hidden="true">
        <SearchIcon size={18} />
      </span>
      <input
        type="search"
        value={query}
        placeholder={placeholder}
        className="az-navbar__search-input"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e);
        }}
        {...rest}
      />
    </div>
  );
}

export interface NavbarSubItem {
  id: string;
  label: ReactNode;
  href?: string;
}

export interface NavbarSubBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: NavbarSubItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
}

export function NavbarSubBar({
  items,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: NavbarSubBarProps) {
  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? items[0]?.id ?? '',
    onChange,
  });

  return (
    <div aria-label="Sub-menu" className={cn('az-navbar__subbar', className)} {...rest}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={cn('az-navbar__sub-item', active && 'az-navbar__sub-item--active')}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

