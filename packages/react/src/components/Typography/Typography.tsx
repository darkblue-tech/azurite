import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type TypographyVariant =
  | 'display-lg'
  | 'display-lg-mobile'
  | 'display-md'
  | 'display-md-mobile'
  | 'headline-lg'
  | 'headline-lg-mobile'
  | 'headline-md'
  | 'headline-sm'
  | 'title-lg'
  | 'title-md'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm';

export type TypographyTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'error'
  | 'inherit';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  tone?: TypographyTone;
  as?: ElementType;
  tabularNums?: boolean;
  balance?: boolean;
  pretty?: boolean;
  truncate?: boolean;
  children?: ReactNode;
}

const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  'display-lg': 'h1',
  'display-lg-mobile': 'h1',
  'display-md': 'h1',
  'display-md-mobile': 'h1',
  'headline-lg': 'h2',
  'headline-lg-mobile': 'h2',
  'headline-md': 'h2',
  'headline-sm': 'h3',
  'title-lg': 'h4',
  'title-md': 'h5',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  'label-lg': 'span',
  'label-md': 'span',
  'label-sm': 'span',
};

/**
 * Azurite typographic scale primitive backed by Instrument Sans and DESIGN.md tokens.
 */
export function Typography({
  variant = 'body-md',
  tone = 'default',
  as,
  tabularNums = false,
  balance = false,
  pretty = false,
  truncate = false,
  className,
  children,
  ...rest
}: TypographyProps) {
  const Component = as ?? DEFAULT_TAG[variant] ?? 'span';

  return (
    <Component
      data-design-text-token={variant}
      className={cn(
        'az-text',
        `az-text--${variant}`,
        `az-text--tone-${tone}`,
        tabularNums && 'az-text--tabular',
        balance && 'az-text--balance',
        pretty && 'az-text--pretty',
        truncate && 'az-text--truncate',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export const Text = Typography;

