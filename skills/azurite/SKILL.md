---
name: azurite-design
description: >-
  Design and build websites, web applications, dashboards, AI workspaces, surveys, and
  documentation interfaces using the Azurite Design System (Swiss editorial 12-column grid
  + Google Material Design 3 Expressive geometry + subtle AI RGB Aura). Use this skill
  whenever the user asks to design, style, scaffold, or build UI with Azurite, azurite-react,
  or darkblue.tech visual language — whether in React or standalone HTML/CSS/Tailwind.
---

# Azurite Design System Skill

Build luminous, uncluttered interfaces that marry **Swiss International Typographic discipline** (asymmetric 12-column grids, stark display-to-body scale contrast, hairline `1px` dividers, expansive negative space) with **Google Material Design 3 Expressive geometry** (`24px` rounded containers, `9999px` pill actions/chips, tonal surface layering, spring tactile kinetics) and an optional **subtle iridescent RGB Aura** reserved strictly for AI features.

---

## 1. Discovery Workflow (MCP-First, Progressive Disclosure)

Follow this lookup order before writing UI code:

1. **Check `azurite-mcp` tools first** (if connected in the active session):
   - `list_components(category?)` — browse available components and variants.
   - `get_component_spec(name)` — inspect exact props, defaults, variants, and animations before using a component.
   - `get_design_tokens(group?)` — fetch exact colors, typography, spacing, radii, elevation, motion, or aura tokens.
   - `search_design_system(query)` — locate components by capability or prop name.
2. **Offline / No-MCP fallback** — load reference files on demand instead of guessing APIs or hex codes:
   - Component catalog (64 components, props, variants): [references/components.md](./references/components.md)
   - Complete Light/Dark tokens, CSS vars & Tailwind config: [references/tokens.md](./references/tokens.md)
3. **Full pages, apps, or flows** — read [references/layouts.md](./references/layouts.md) for Swiss 12-column blueprints across editorial sites, SaaS dashboards, AI workspaces, surveys/quizzes, and documentation portals.

---

## 2. Hybrid Stack Setup

### Option A — React + `azurite-react` (Preferred)

1. Import styles once at the app entry point:
   ```tsx
   import 'azurite-react/styles.css';
   ```
   *(Or import `azurite-react/tokens.css` alone if composing custom layouts using only CSS tokens.)*
2. Load Google Fonts in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
   ```
3. Set theme attribute on `<html>` (`data-theme="light"` default; toggle `data-theme="dark"` or `.dark` for Dark Mode).
4. Wrap the app root in `<ToastProvider>` whenever notifications are used.
5. Prefer composing existing `azurite-react` primitives (`Navbar`, `Drawer`, `Dock`, `Card`, `Button`, `Input`, `Select`, `Table`, `Modal`, `Context`, `ContextMenu`, `Survey*`, `Tooltip`, etc.) over hand-coding duplicates.

### Option B — Non-React or Standalone Fallback (HTML / CSS / Tailwind / Vue / Svelte)

When `azurite-react` is not installed or the project is not React:
1. Load `Instrument Sans` and `Material Symbols Outlined` via Google Fonts.
2. Copy the Light + Dark `:root` / `[data-theme="dark"]` CSS custom properties — or the Tailwind `theme.extend` block — from [references/tokens.md](./references/tokens.md).
3. Follow the exact Azurite visual grammar, geometry, motion curves, and component anatomy defined below and in [references/layouts.md](./references/layouts.md).

---

## 3. Core Visual Grammar

### Color, Theme & Brand Policy
- **Default Palette**: Pure Azurite centered on **Royal Blue** (`#0A36D1` light / `#B4C5FF` dark), **Slate** secondary (`#475569` / `#CBD5E1`), and **Electric Cyan** tertiary (`#0284C7` / `#7DD3FC`).
- **Light Primary + Full Dark Parity**: Design for an airy, open light canvas first (`surface: #FFFFFF`, `surface-container-low: #F8FAFC`, `surface-container: #F1F5F9`, `surface-container-high: #E2E8F0`), and ALWAYS reference semantic tokens (`var(--az-color-*)`) so Dark Mode (`surface: #0F141C`, `background: #090D14`, `surface-container-low: #151B26`) achieves AA contrast automatically without hardcoded hex overrides.
- **Brand Swap Rule**: Keep Azurite's Royal Blue tokens and geometry by default, **but replace the brand wordmark, title, and logo mark with the target project's identity**. Reserve the pixel `BrandMark` and `darkblue.tech` wordmark strictly for `darkblue.tech` studio products.

### Tonal Layering & Surfaces
- Create depth through **tonal stepping** (`surface` -> `surface-container-low` -> `surface-container` -> `surface-container-high`), not heavy drop shadows or dark borders.
- Separate layout regions with **1px hairline rules** (`var(--az-color-outline-variant)`).
- Reserve soft ambient shadows (`--az-shadow-ambient`, `--az-shadow-lg`) strictly for floating overlays (`Modal`, `Dropdown`, `ContextMenu`, `Context` breakdown, `Dock`, `Toast`).

### Shapes (M3 Expressive Radii)
- **Cards, modals, panels & containers**: `24px` (`--az-radius-xl`).
- **Interactive CTAs, inputs, search bars, chips & badges**: `9999px` (`--az-radius-full`) pill contour.
- **Menus, dropdowns, option cards & compact controls**: `12px`–`16px` (`--az-radius-md` / `--az-radius-lg`).
- **Micro badges & checkbox boxes**: `6px` (`--az-radius-sm`).

### Typography & Voice
- **Single Family**: `Instrument Sans` across all roles (`display-lg` 56px down to `label-sm` 11px).
- **Scale Contrast**: Pair oversized tight-tracked display headings (`-1.5px` / `-1.0px`) with calm, readable `body-lg` (`16px`) / `body-md` (`14px`) copy.
- **Sentence Case**: Use natural sentence case for headlines, section headers, card titles, buttons, and labels — avoid aggressive ALL-CAPS shouting.
- **Tabular Numerals**: Always apply `font-variant-numeric: tabular-nums` to KPI metrics, percentages, prices, dates, timers, table numbers, pagination, and keyboard shortcuts.
- **Voice**: Articulate, calm, direct, and human (`"Create new brief"`, `"Compact History"`, `"Submit Response"`).

### Motion & Tactile Kinetics
- `state-change`: `150ms cubic-bezier(0.2, 0, 0, 1)` — color, fill, border, chevron rotation.
- `surface-enter`: `250ms cubic-bezier(0.05, 0.7, 0.1, 1)` — overlays, modals, menus, drawers.
- `surface-exit`: `150ms cubic-bezier(0.3, 0, 1, 1)` — clean dismissals.
- `spring-press`: `120ms cubic-bezier(0.34, 1.56, 0.64, 1)` — `scale(0.98)` tactile press on primary interactive surfaces.

### AI Visual Language (`Aura`)
- Use the iridescent RGB Aura (`#0A36D1` -> `#06B6D4` -> `#8B5CF6` -> `#EC4899` diffused glow via `<Aura>` or `--az-aura-glow`) **exclusively** on genuinely AI-powered surfaces (prompt inputs, generative summaries, AI actions, thinking states). Never decorate standard navigation, pricing cards, or ordinary buttons with `Aura`.

---

## 4. Strict Anti-Patterns (Never Do)

- **No sci-fi HUDs or brutalism**: Never add fake telemetry indices, coordinate strings, monospaced metadata bars, harsh black borders (`#000`), neon cyberpunk glows, or chamfered/jagged cuts.
- **No hand-drawn UI SVG icons**: Never inline custom `<svg>` paths for standard UI icons. Always use Google **Material Symbols Outlined** (imported from `azurite-react` icon exports or `<span class="material-symbols-outlined">...</span>`). Exceptions: brand logomarks and minimal data-viz primitives (e.g., progress ring `<circle>`).
- **No static/pinned tooltips**: `Tooltip` must only appear on hover or keyboard focus — never render tooltips permanently visible in resting states.
- **No dead/static validation**: Every validation example or form field (`ValidatedForm`, `Input`, `Select`, `Textarea`, `SurveyField`, `SurveyChoiceQuestion`) must validate live as the user edits and clear errors dynamically once valid.
- **No unstyled native `<select>` popups**: Use Azurite's `Select` (or styled custom listbox matching `--az-color-surface` + `--az-radius-lg`) instead of raw browser `<select>` chrome.
- **No hardcoded light-only colors**: Never write raw `#FFFFFF`, `#0F172A`, or `#F8FAFC` in component CSS when a semantic `--az-color-*` variable exists.
- **No placement jitter**: Anchored popovers/menus (`Dropdown`, `ContextMenu`, `Tooltip`) must preserve their anchor translate axis throughout enter keyframes so they never jump on open.
- **No DevSecOps slop**: No "01 // Whatever" labels, "Deployment ready", "Active" badges, "Production Ready", "Identity verified", SIGNATURE, SHA256 and all sorts of internal stuff. IF NOT DIRECTLY ASKED. 
- **No Unasked Enumerations**: Do not enumerate cards, sections or items unless explicitly asked to. 
- **No Debug Telemetry**: Do not show any internal logs, debugging information, telemetry data, constraints, or internal comments in the UI. 
---

## 5. Pre-Delivery Quality Checklist

Before finishing any Azurite UI task, verify:
1. **Grid & Rhythm**: Container max-width `1360px` (or fluid app shell), `8px` spacing rhythm (`--az-space-gutter-*`), `64px`–`96px` section breaks, hairline `outline-variant` dividers.
2. **Theme Parity**: Toggle `data-theme="light"` and `data-theme="dark"` — verify contrast, borders, inputs, focus halos, and shadows in both modes.
3. **Interactivity & A11y**: Every button, tab, collapse, menu, modal, drawer, and form control responds smoothly; keyboard navigation (`Tab`, `Escape`, arrow keys) and visible focus rings (`--az-focus-ring` / `--az-focus-halo`) work.
4. **Icons & Numbers**: All UI icons render via Material Symbols Outlined; numeric readouts use `tabular-nums`.
5. **Build & Types**: Run the project's build/typecheck commands and confirm zero errors.

---

## 6. Keeping References in Sync

When `azurite-react` components or tokens change in this repository, regenerate the static references from the live registry:

```bash
npm run build:lib && npm run sync:skill
```

This runs [scripts/sync-references.mjs](./scripts/sync-references.mjs) and updates `references/components.md` and `references/tokens.md` directly from `azurite-react/registry`.

