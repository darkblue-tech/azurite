# Azurite Design Tokens & Standalone Theme Setup

> Auto-generated from `azurite-react/registry` and `packages/react/src/tokens/tokens.css` via `npm run sync:skill`.

Always consume semantic CSS custom properties (`var(--az-*)`) so Light Mode (`[data-theme="light"]`) and Dark Mode (`[data-theme="dark"]` / `.dark`) stay in AA-calibrated parity.

## Color Palette (Light & Dark)

| Token Role | CSS Variable | Light | Dark |
| :--- | :--- | :--- | :--- |
| `primary` | `--az-color-primary` | `#0A36D1` | `#B4C5FF` |
| `onPrimary` | `--az-color-on-primary` | `#FFFFFF` | `#002387` |
| `primaryContainer` | `--az-color-primary-container` | `#EEF2FF` | `#0035B3` |
| `onPrimaryContainer` | `--az-color-on-primary-container` | `#001866` | `#DBE1FF` |
| `secondary` | `--az-color-secondary` | `#475569` | `#CBD5E1` |
| `onSecondary` | `--az-color-on-secondary` | `#FFFFFF` | `#1E293B` |
| `secondaryContainer` | `--az-color-secondary-container` | `#F1F5F9` | `#334155` |
| `onSecondaryContainer` | `--az-color-on-secondary-container` | `#0F172A` | `#F1F5F9` |
| `tertiary` | `--az-color-tertiary` | `#0284C7` | `#7DD3FC` |
| `onTertiary` | `--az-color-on-tertiary` | `#131313` | `#003549` |
| `tertiaryContainer` | `--az-color-tertiary-container` | `#E0F2FE` | `#0284C7` |
| `onTertiaryContainer` | `--az-color-on-tertiary-container` | `#0369A1` | `#131416` |
| `surface` | `--az-color-surface` | `#FFFFFF` | `#0F141C` |
| `onSurface` | `--az-color-on-surface` | `#0F172A` | `#F8FAFC` |
| `surfaceVariant` | `--az-color-surface-variant` | `#F8FAFC` | `#1E293B` |
| `onSurfaceVariant` | `--az-color-on-surface-variant` | `#475569` | `#94A3B8` |
| `surfaceContainerLow` | `--az-color-surface-container-low` | `#F8FAFC` | `#151B26` |
| `surfaceContainer` | `--az-color-surface-container` | `#F1F5F9` | `#1C2433` |
| `surfaceContainerHigh` | `--az-color-surface-container-high` | `#E2E8F0` | `#242E40` |
| `outline` | `--az-color-outline` | `#CBD5E1` | `#475569` |
| `outlineVariant` | `--az-color-outline-variant` | `#E2E8F0` | `#334155` |
| `background` | `--az-color-background` | `#FAFAFA` | `#090D14` |
| `onBackground` | `--az-color-on-background` | `#0F172A` | `#F8FAFC` |
| `error` | `--az-color-error` | `#BA1A1A` | `#FFB4AB` |
| `onError` | `--az-color-on-error` | `#FFFFFF` | `#690005` |
| `errorContainer` | `--az-color-error-container` | `#FFDAD6` | `#93000A` |
| `onErrorContainer` | `--az-color-on-error-container` | `#410002` | `#FFDAD6` |
| `success` | `--az-color-success` | `#047857` | `#34D399` |
| `onSuccess` | `--az-color-on-success` | `#FFFFFF` | `#022C22` |
| `successContainer` | `--az-color-success-container` | `#ECFDF5` | `#064E3B` |
| `onSuccessContainer` | `--az-color-on-success-container` | `#065F46` | `#A7F3D0` |
| `warning` | `--az-color-warning` | `#B45309` | `#FBBF24` |
| `onWarning` | `--az-color-on-warning` | `#FFFFFF` | `#451A03` |
| `warningContainer` | `--az-color-warning-container` | `#FFFBEB` | `#78350F` |
| `onWarningContainer` | `--az-color-on-warning-container` | `#78350F` | `#FEF3C7` |
| `info` | `--az-color-info` | `#0369A1` | `#38BDF8` |
| `onInfo` | `--az-color-on-info` | `#FFFFFF` | `#082F49` |
| `infoContainer` | `--az-color-info-container` | `#E0F2FE` | `#0C4A6E` |
| `onInfoContainer` | `--az-color-on-info-container` | `#0369A1` | `#BAE6FD` |

## Typography Scale (`Instrument Sans`)

| Role | Size | Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| `display-lg` | `56px` | `64px` | `700` | `-1.5px` |
| `display-lg-mobile` | `32px` | `38px` | `700` | `-0.8px` |
| `display-md` | `44px` | `52px` | `700` | `-1px` |
| `display-md-mobile` | `28px` | `34px` | `700` | `-0.5px` |
| `headline-lg` | `36px` | `44px` | `600` | `-0.75px` |
| `headline-lg-mobile` | `24px` | `32px` | `600` | `-0.4px` |
| `headline-md` | `28px` | `36px` | `600` | `-0.5px` |
| `headline-sm` | `22px` | `28px` | `600` | `-0.2px` |
| `title-lg` | `18px` | `24px` | `600` | `-0.1px` |
| `title-md` | `16px` | `22px` | `600` | `0px` |
| `body-lg` | `16px` | `24px` | `400` | `0.1px` |
| `body-md` | `14px` | `20px` | `400` | `0.15px` |
| `body-sm` | `12px` | `16px` | `400` | `0.2px` |
| `label-lg` | `14px` | `20px` | `600` | `0.1px` |
| `label-md` | `12px` | `16px` | `600` | `0.3px` |
| `label-sm` | `11px` | `14px` | `600` | `0.4px` |

## Spacing Rhythm (8px base, 4px micro)

| Token | CSS Variable | Value |
| :--- | :--- | :--- |
| `gutter-xs` | `--az-space-gutter-xs` | `4px` |
| `gutter-sm` | `--az-space-gutter-sm` | `8px` |
| `gutter-md` | `--az-space-gutter-md` | `16px` |
| `gutter-lg` | `--az-space-gutter-lg` | `24px` |
| `gutter-xl` | `--az-space-gutter-xl` | `32px` |
| `gutter-2xl` | `--az-space-gutter-2xl` | `48px` |
| `section` | `--az-space-section` | `64px` |
| `section-lg` | `--az-space-section-lg` | `96px` |
| `page-margin` | `--az-space-page-margin` | `32px` |

## Radii (M3 Expressive)

| Token | CSS Variable | Value | Usage |
| :--- | :--- | :--- | :--- |
| `sm` | `--az-radius-sm` | `6px` | Micro badges, checkboxes |
| `md` | `--az-radius-md` | `12px` | Menu items, inputs, small cards |
| `lg` | `--az-radius-lg` | `16px` | Popovers, menus, grouped lists |
| `xl` | `--az-radius-xl` | `24px` | Primary cards, modals, panels |
| `full` | `--az-radius-full` | `9999px` | Buttons, chips, search pills |

## Motion Curves

| Role | Duration | Timing Function |
| :--- | :--- | :--- |
| `state-change` | `150ms` | `cubic-bezier(0.2, 0, 0, 1)` |
| `surface-enter` | `250ms` | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| `surface-exit` | `150ms` | `cubic-bezier(0.3, 0, 1, 1)` |
| `spring-press` | `120ms` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `speed-dial` | `200ms` | `cubic-bezier(0.2, 0, 0, 1)` |

## AI Ambient Aura (Strictly for AI Features)

- **Gradient Stops**: `#0A36D1`, `#06B6D4`, `#8B5CF6`, `#EC4899`
- **CSS Vars**: `var(--az-aura-gradient)`, `var(--az-aura-glow)`

---

## Standalone Tailwind `theme.extend` Snippet (Non-React Fallback)

Use this when building a Tailwind CSS project without `azurite-react`:

```js
// tailwind.config.js (pair with the CSS custom properties below for automatic Dark Mode)
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--az-color-primary)',
        'on-primary': 'var(--az-color-on-primary)',
        'primary-container': 'var(--az-color-primary-container)',
        'on-primary-container': 'var(--az-color-on-primary-container)',
        secondary: 'var(--az-color-secondary)',
        tertiary: 'var(--az-color-tertiary)',
        'tertiary-container': 'var(--az-color-tertiary-container)',
        'on-tertiary-container': 'var(--az-color-on-tertiary-container)',
        surface: 'var(--az-color-surface)',
        'on-surface': 'var(--az-color-on-surface)',
        'on-surface-variant': 'var(--az-color-on-surface-variant)',
        'surface-container-low': 'var(--az-color-surface-container-low)',
        'surface-container': 'var(--az-color-surface-container)',
        'surface-container-high': 'var(--az-color-surface-container-high)',
        outline: 'var(--az-color-outline)',
        'outline-variant': 'var(--az-color-outline-variant)',
        error: 'var(--az-color-error)',
        'error-container': 'var(--az-color-error-container)',
        'on-error-container': 'var(--az-color-on-error-container)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
    },
  },
};
```

## Canonical CSS Tokens (`tokens.css`)

```css
/* Azurite Design System — Design Tokens (Light & Dark Themes)
 * Source of truth: docs/DESIGN.md + component specification sheets
 */

:root,
[data-theme='light'] {
  color-scheme: light;

  /* Brand & Core Palette */
  --az-royal-blue: #0A36D1;

  --az-color-primary: #0A36D1;
  --az-color-on-primary: #FFFFFF;
  --az-color-primary-container: #EEF2FF;
  --az-color-on-primary-container: #001866;

  --az-color-secondary: #475569;
  --az-color-on-secondary: #FFFFFF;
  --az-color-secondary-container: #F1F5F9;
  --az-color-on-secondary-container: #0F172A;

  --az-color-tertiary: #0284C7;
  --az-color-on-tertiary: #131313;
  --az-color-tertiary-container: #E0F2FE;
  --az-color-on-tertiary-container: #0369A1;

  --az-color-surface: #FFFFFF;
  --az-color-on-surface: #0F172A;
  --az-color-surface-variant: #F8FAFC;
  --az-color-on-surface-variant: #475569;

  --az-color-surface-container-low: #F8FAFC;
  --az-color-surface-container: #F1F5F9;
  --az-color-surface-container-high: #E2E8F0;

  --az-color-outline: #CBD5E1;
  --az-color-outline-variant: #E2E8F0;

  --az-color-background: #FAFAFA;
  --az-color-on-background: #0F172A;

  --az-color-error: #BA1A1A;
  --az-color-on-error: #FFFFFF;
  --az-color-error-container: #FFDAD6;
  --az-color-on-error-container: #410002;

  /* Semantic Status Roles */
  --az-color-success: #047857;
  --az-color-on-success: #FFFFFF;
  --az-color-success-container: #ECFDF5;
  --az-color-on-success-container: #065F46;
  --az-color-success-border: #A7F3D0;
  --az-color-success-indicator: #059669;

  --az-color-warning: #B45309;
  --az-color-on-warning: #FFFFFF;
  --az-color-warning-container: #FFFBEB;
  --az-color-on-warning-container: #78350F;
  --az-color-warning-text: #92400E;
  --az-color-warning-indicator: #F59E0B;

  --az-color-info: #0369A1;
  --az-color-on-info: #FFFFFF;
  --az-color-info-container: #E0F2FE;
  --az-color-on-info-container: #0369A1;

  --az-color-rose: #BE123C;
  --az-color-violet: #6D28D9;
  --az-color-amber: #B45309;
  --az-color-emerald: #047857;

  /* Legacy / Base Shorthand Aliases */
  --az-color-bg: var(--az-color-surface);
  --az-color-text: var(--az-color-on-surface);
  --az-color-text-muted: var(--az-color-on-surface-variant);
  --az-color-accent: var(--az-color-primary);
  --az-color-border: var(--az-color-outline-variant);

  /* AI Ambient RGB Aura */
  --az-aura-blue: #0A36D1;
  --az-aura-cyan: #06B6D4;
  --az-aura-violet: #8B5CF6;
  --az-aura-magenta: #EC4899;
  --az-aura-gradient: linear-gradient(
    120deg,
    rgba(10, 54, 209, 0.36),
    rgba(6, 182, 212, 0.32),
    rgba(139, 92, 246, 0.32),
    rgba(236, 72, 153, 0.30)
  );
  --az-aura-glow:
    0 0 0 1px rgba(10, 54, 209, 0.18),
    0 4px 16px -2px rgba(6, 182, 212, 0.16),
    0 8px 24px -4px rgba(139, 92, 246, 0.16);

  /* Typography Families */
  --az-font-sans: "Instrument Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --az-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography Scale */
  --az-text-display-lg-size: 56px;
  --az-text-display-lg-line: 64px;
  --az-text-display-lg-weight: 700;
  --az-text-display-lg-tracking: -1.5px;

  --az-text-display-lg-mobile-size: 32px;
  --az-text-display-lg-mobile-line: 38px;
  --az-text-display-lg-mobile-weight: 700;
  --az-text-display-lg-mobile-tracking: -0.8px;

  --az-text-display-md-size: 44px;
  --az-text-display-md-line: 52px;
  --az-text-display-md-weight: 700;
  --az-text-display-md-tracking: -1px;

  --az-text-display-md-mobile-size: 28px;
  --az-text-display-md-mobile-line: 34px;
  --az-text-display-md-mobile-weight: 700;
  --az-text-display-md-mobile-tracking: -0.5px;

  --az-text-headline-lg-size: 36px;
  --az-text-headline-lg-line: 44px;
  --az-text-headline-lg-weight: 600;
  --az-text-headline-lg-tracking: -0.75px;

  --az-text-headline-lg-mobile-size: 24px;
  --az-text-headline-lg-mobile-line: 32px;
  --az-text-headline-lg-mobile-weight: 600;
  --az-text-headline-lg-mobile-tracking: -0.4px;

  --az-text-headline-md-size: 28px;
  --az-text-headline-md-line: 36px;
  --az-text-headline-md-weight: 600;
  --az-text-headline-md-tracking: -0.5px;

  --az-text-headline-sm-size: 22px;
  --az-text-headline-sm-line: 28px;
  --az-text-headline-sm-weight: 600;
  --az-text-headline-sm-tracking: -0.2px;

  --az-text-title-lg-size: 18px;
  --az-text-title-lg-line: 24px;
  --az-text-title-lg-weight: 600;
  --az-text-title-lg-tracking: -0.1px;

  --az-text-title-md-size: 16px;
  --az-text-title-md-line: 22px;
  --az-text-title-md-weight: 600;
  --az-text-title-md-tracking: 0px;

  --az-text-body-lg-size: 16px;
  --az-text-body-lg-line: 24px;
  --az-text-body-lg-weight: 400;
  --az-text-body-lg-tracking: 0.1px;

  --az-text-body-md-size: 14px;
  --az-text-body-md-line: 20px;
  --az-text-body-md-weight: 400;
  --az-text-body-md-tracking: 0.15px;

  --az-text-body-sm-size: 12px;
  --az-text-body-sm-line: 16px;
  --az-text-body-sm-weight: 400;
  --az-text-body-sm-tracking: 0.2px;

  --az-text-label-lg-size: 14px;
  --az-text-label-lg-line: 20px;
  --az-text-label-lg-weight: 600;
  --az-text-label-lg-tracking: 0.1px;

  --az-text-label-md-size: 12px;
  --az-text-label-md-line: 16px;
  --az-text-label-md-weight: 600;
  --az-text-label-md-tracking: 0.3px;

  --az-text-label-sm-size: 11px;
  --az-text-label-sm-line: 14px;
  --az-text-label-sm-weight: 600;
  --az-text-label-sm-tracking: 0.4px;

  /* Spacing Rhythm (8px base, 4px micro) */
  --az-space-gutter-xs: 4px;
  --az-space-gutter-sm: 8px;
  --az-space-gutter-md: 16px;
  --az-space-gutter-lg: 24px;
  --az-space-gutter-xl: 32px;
  --az-space-gutter-2xl: 48px;
  --az-space-section: 64px;
  --az-space-section-lg: 96px;
  --az-space-page-margin: 32px;

  /* Shapes / Radii */
  --az-radius-sm: 6px;
  --az-radius-md: 12px;
  --az-radius-lg: 16px;
  --az-radius-xl: 24px;
  --az-radius-full: 9999px;

  /* Elevation & Focus Rings */
  --az-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --az-shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --az-shadow-lg: 0 12px 32px -6px rgba(15, 23, 42, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.06);
  --az-shadow-ambient: 0 8px 30px rgba(0, 0, 0, 0.06);
  --az-skeleton-base: #E2E8F0;
  --az-skeleton-highlight: #F8FAFC;
  --az-focus-ring: 0 0 0 2px var(--az-color-surface), 0 0 0 4px var(--az-color-primary);
  --az-focus-halo: 0 0 0 3px rgba(10, 54, 209, 0.14);
  --az-error-halo: 0 0 0 3px rgba(186, 26, 26, 0.14);
  --az-success-halo: 0 0 0 3px rgba(4, 120, 87, 0.14);

  /* Motion & Kinetics */
  --az-duration-state-change: 150ms;
  --az-ease-state-change: cubic-bezier(0.2, 0, 0, 1);

  --az-duration-surface-enter: 250ms;
  --az-ease-surface-enter: cubic-bezier(0.05, 0.7, 0.1, 1);

  --az-duration-surface-exit: 150ms;
  --az-ease-surface-exit: cubic-bezier(0.3, 0, 1, 1);

  --az-duration-spring-press: 120ms;
  --az-ease-spring-press: cubic-bezier(0.34, 1.56, 0.64, 1);

  --az-duration-speed-dial: 200ms;
  --az-ease-speed-dial: cubic-bezier(0.2, 0, 0, 1);
}

[data-theme='dark'],
.dark {
  color-scheme: dark;

  --az-color-primary: #B4C5FF;
  --az-color-on-primary: #002387;
  --az-color-primary-container: #0035B3;
  --az-color-on-primary-container: #DBE1FF;

  --az-color-secondary: #CBD5E1;
  --az-color-on-secondary: #1E293B;
  --az-color-secondary-container: #334155;
  --az-color-on-secondary-container: #F1F5F9;

  --az-color-tertiary: #7DD3FC;
  --az-color-on-tertiary: #003549;
  --az-color-tertiary-container: #0284C7;
  --az-color-on-tertiary-container: #131416;

  --az-color-surface: #0F141C;
  --az-color-on-surface: #F8FAFC;
  --az-color-surface-variant: #1E293B;
  --az-color-on-surface-variant: #94A3B8;

  --az-color-surface-container-low: #151B26;
  --az-color-surface-container: #1C2433;
  --az-color-surface-container-high: #242E40;

  --az-color-outline: #475569;
  --az-color-outline-variant: #334155;

  --az-color-background: #090D14;
  --az-color-on-background: #F8FAFC;

  --az-color-error: #FFB4AB;
  --az-color-on-error: #690005;
  --az-color-error-container: #93000A;
  --az-color-on-error-container: #FFDAD6;

  /* Semantic Status Roles (Dark AA Calibrated) */
  --az-color-success: #34D399;
  --az-color-on-success: #022C22;
  --az-color-success-container: #064E3B;
  --az-color-on-success-container: #A7F3D0;
  --az-color-success-border: #065F46;
  --az-color-success-indicator: #10B981;

  --az-color-warning: #FBBF24;
  --az-color-on-warning: #451A03;
  --az-color-warning-container: #78350F;
  --az-color-on-warning-container: #FEF3C7;
  --az-color-warning-text: #FCD34D;
  --az-color-warning-indicator: #F59E0B;

  --az-color-info: #38BDF8;
  --az-color-on-info: #082F49;
  --az-color-info-container: #0C4A6E;
  --az-color-on-info-container: #BAE6FD;

  --az-color-rose: #FB7185;
  --az-color-violet: #A78BFA;
  --az-color-amber: #FBBF24;
  --az-color-emerald: #34D399;

  --az-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.35);
  --az-shadow-md: 0 6px 16px rgba(0, 0, 0, 0.45);
  --az-shadow-lg: 0 16px 40px -8px rgba(0, 0, 0, 0.55), 0 4px 14px -4px rgba(0, 0, 0, 0.40);
  --az-shadow-ambient: 0 10px 32px rgba(0, 0, 0, 0.55);
  --az-skeleton-base: #1E293B;
  --az-skeleton-highlight: #334155;
  --az-focus-halo: 0 0 0 3px rgba(180, 197, 255, 0.22);
  --az-error-halo: 0 0 0 3px rgba(255, 180, 171, 0.22);
  --az-success-halo: 0 0 0 3px rgba(52, 211, 153, 0.22);

  --az-aura-glow:
    0 0 0 1px rgba(180, 197, 255, 0.26),
    0 4px 20px -2px rgba(6, 182, 212, 0.24),
    0 8px 28px -4px rgba(139, 92, 246, 0.24);
}
```
