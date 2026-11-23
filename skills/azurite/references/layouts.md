# Azurite Layout Blueprints & Page Recipes

Architectural composition patterns combining Swiss 12-column editorial discipline with Material Design 3 Expressive components. Use `azurite-react` components directly in React projects, or reproduce the same token-backed structure in standalone HTML/CSS/Tailwind projects.

---

## Grid & Rhythm Foundations

- **Editorial / Marketing Container**: `max-width: 1360px`, centered, `padding-inline: var(--az-space-gutter-xl)` (`32px`, `16px` mobile).
- **12-Column Asymmetric Split**:
  - **Masthead**: `8 cols` (eyebrow badge + `display-md`/`display-lg` heading + `body-lg` lead) + `4 cols` right-aligned status pill or action CTA, separated below by a `1px` `outline-variant` hairline rule.
  - **Content Sections**: `4 cols` sticky/top-aligned section descriptor (`label-md` index in `primary`, `headline-sm` title, `body-md` muted description) + `8 cols` component canvas or content grid, separated by `48px`–`64px` vertical rhythm and hairline rules.
- **Application Shell**: Full-bleed viewport (`min-height: 100vh`) using `surface` or `background` canvas, `Drawer` sidebar (`80px` icon rail or `280px` combined), sticky `Navbar` (`64px`), and mobile `Dock` (`regular` `64px`).

---

## 1. Editorial & Marketing Sites

**Goal**: High-clarity Swiss studio presence with generous breathing room and zero visual clutter.

**Component Stack**:
- **Header**: `Navbar` (`layout="between"` or `wideLinks`) with brand wordmark, centered `NavbarLinks` (optional `Dropdown` or `MegaMenuIntegrated` for product/catalog navigation), and single primary pill `Button` CTA.
- **Hero Section**: Asymmetric 12-col grid (`7+5` or `8+4`).
  - Left: `Badge` (`variant="soft"`) eyebrow, `Typography` (`display-lg` + `TextRotator` for kinetic headline emphasis), `body-lg` lead, paired primary `solid` + `outline` pill `Button`s.
  - Right: `TiltCard` or `Diff` (before/after comparator) or layered `Stack` (`depth="tonal"`) framed in `24px` (`--az-radius-xl`) radii.
- **Feature Showcase / Bento**: Multi-column `Card` grid (`variant="tonal"` on `surface-container-low`, `size="lg"`), paired with `StatGroup` (`variant="joined"`) for proof points and `Carousel` (`snap="center"`) for case studies.
- **Interactive Proofs**: `Tabs` or `SegmentedControl` switching between live product views; `Accordion` for FAQs.
- **Footer**: Swiss `Footer` with oversized `clamp(3.25rem, 10.5vw, 8.75rem)` project wordmark, hairline divider, and 4-column link grid (`Index`, `Product`, `Connect`, `Legal`).

**Rules**:
- Replace `Footer`'s default `brandPrefix`/`brandSuffix` with the target project's name.
- Keep hero sections uncluttered: at most one primary solid CTA and one secondary outline/ghost CTA.

---

## 2. Web Apps & SaaS Dashboards

**Goal**: Calm, scannable productivity surface with dense data clarity and zero heavy chrome.

**Component Stack**:
- **Navigation Shell**:
  - Desktop: `Drawer` (`variant="combined"` at `280px`, collapsible to `variant="icons"` at `80px` with hover `Tooltip`) + top `Navbar` featuring `NavbarSearch`, utility `NavbarIconButton`s (with `badgeCount`), and user `Avatar` `Dropdown`.
  - Mobile: Slide-over `Drawer` (`overlay`, `side="left"`) triggered from `Navbar`'s `MenuIcon` button, plus optional bottom `Dock` (`size="regular"`).
- **Overview Header**: `Breadcrumbs` + `Typography` (`headline-md`) + `SegmentedControl` timeframe filter + primary `Button` (`+ New ...`).
- **KPI Row**: `StatGroup` with 3–4 `Stat` tiles (`surface="low"`, `tabular-nums`, semantic `valueTone` for deltas).
- **Data Workspace**:
  - `Card` (`variant="outlined"` or `tonal`) hosting filter toolbar (`Input` search, `Select` filters, `Joint` grouped actions) above a sortable/hoverable `Table` (`StatusIndicator` + `Badge` status pills, row `ContextMenu` on right-click or overflow `Dropdown`) and centered `Pagination`.
- **Detail & Action Overlays**:
  - Right-click canvas/row actions via `ContextMenu` (`triggerMode="contextmenu"`).
  - Confirmation & edit dialogs via `Modal` (`standard` or `wide`).
  - Non-blocking feedback via `useToast()` (`ToastProvider`).
  - Settings forms built with `ValidatedForm`, `Fieldset`, `Input`, `Select`, `Textarea`, `Toggle`, `CheckboxGroup`, `RadioGroup`, and `FileDropZone`.

**Rules**:
- Always make table row hover highlights respect card border radius cleanly.
- Wire every form field to live validation so errors resolve immediately while typing.

---

## 3. AI Interfaces & Workspaces

**Goal**: Calm editorial precision where **only** AI-native surfaces carry the subtle iridescent `Aura` glow.

**Component Stack**:
- **Workspace Frame**: Minimal `Navbar` (session title + model selector `Select` + `Context` token-limit chip in toolbar) + collapsible `Drawer` for conversation history.
- **Conversation Stream**:
  - `ChatThread` containing `ChatDivider` date separators and `ChatMessage` / `ChatBubble` turns (`incoming` tonal bubble, `outgoing` primary/subtle bubble, `Avatar`, timestamps in `body-sm tabular-nums`).
  - Active generation state: `SkeletonText` (`"AI is thinking"` expressive character wave) or `LoadingIndicator` inside an `<Aura>` surface.
- **Prompt Composer**:
  - Wrap the bottom composer container in `<Aura>` (soft diffused RGB border/glow) with pill/rounded `Textarea` (`autoResize`), attachment `FileInput` trigger, inline `ContextChip` showing live context usage (`71.4% · 142.8K / 200K`), and circular primary `Button` (`SendIcon`).
- **Capacity & Resource Transparency**:
  - `Context` expandable overlay card breaking down context usage (`Attached Docs`, `Conversation History`, `System Instructions`, `Tool Outputs`) with segmented bar and live `Compact History` action.
- **Contextual Commands**: `Fab` / `SpeedDial` or `ContextMenu` with keyboard shortcuts (`⌘K`, `⌘C`) for quick AI actions on selected text/nodes.

**Rules**:
- Restrict `<Aura>` strictly to AI prompt bars, generative response cards, and smart action chips — never apply it to navigation, static metrics, or standard settings.
- Keep `ContextChip` clickable to expand/collapse the full breakdown cleanly.

---

## 4. Surveys, Quizzes & Multi-Step Wizards

**Goal**: Frictionless, high-focus question flows with live validation and unmistakable feedback states.

**Component Stack**:
- **Linear Single-Page Survey**:
  - Vertical stack inside `max-width: 720px` separated by hairline dividers: `SurveyChoiceQuestion` (`mode="single" | "multiple"`, `variant="cards" | "list"`), `SurveyMatrix` (`radio` & `checkbox` grids), `SurveyScale` (`1–5` linear tiles), `SurveyRating` (`44px` star tiles), and `SurveyField` (`date`, `datetime-local`, `select`, `number`, `email`, `textarea`).
- **Card Form & Custom `"Other"`**:
  - Wrap question groups in `SurveyForm` (`surface-container-low`, `24px` radius, hairline footer divider + primary pill Submit button) with `surface="surface"` on nested `SurveyChoiceQuestion` cards.
  - Enable `allowCustomInput` + live `customError` on `"Other"` options so the inline pill text input validates dynamically.
- **Multi-Stage Wizard**:
  - Combine `SurveyProgress` (`variant="counter"` or `variant="segmented"`) or `Stepper` with `SurveyForm` (`showPrevious`, `onPrevious`, `nextLabel`, `onNext`). Validate the current step before advancing; clear error borders immediately when the user picks an option.
- **Modal Quiz**:
  - Use `SurveyModal` (`stepLabel`, `question`, `required`, `onSkip`, `onPrevious`, `onNext`, `onClose`) for in-app onboarding checks or micro-surveys.
- **Results & Quiz Feedback**:
  - Immediate grading: `SurveyChoiceQuestion` (`readOnly`) with `status: 'correct'` (`CheckCircleIcon`, `primary-container`) and `status: 'incorrect'` (`XCircleIcon`, `error-container`).
  - Aggregated polls: `SurveyResults` (`variant="bar-fill"` with `correct` / `highlight` tones, or `variant="progress-list"`).

---

## 5. Documentation & Design Systems

**Goal**: Swiss specification-sheet clarity with live interactive specimens and instant Light/Dark comparison.

**Component Stack**:
- **Shell**: Sticky `Navbar` (brand + `NavbarSearch` + Light/Dark `Toggle` or icon `Button`) + left `Drawer` / nested collapsible `Menu` tree (categories -> components) + main scrolling content column (`max-width: 1360px`).
- **Page Masthead**: 12-col asymmetric header (`8+4`) with category eyebrow, `display-md` component title, `body-lg` summary, and right-aligned pill status badge (`N Variants · Interactive`).
- **Specimen Sections**:
  - 12-col split (`4 cols` numbered eyebrow `01 · ...` + `headline-sm` + `body-md` rationale; `8 cols` interactive preview stage).
  - Frame interactive specimens inside `24px` (`--az-radius-xl`) `surface-container-low` boxes with `1px` `outline-variant` borders; use `surface-container-high` backdrop stages for `Modal` / `SurveyModal` inline previews.
- **API & Props Reference**: `Table` displaying prop names (`font-mono`), types, defaults, and descriptions, paired with `Tabs` switching between `Preview`, `React Code`, and `Tokens`.
- **Footer**: Clean Swiss `Footer` linking to repository, tokens, MCP server docs, and changelog.

