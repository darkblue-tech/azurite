# Azurite Component Catalog

> Auto-generated from `azurite-react/registry` via `npm run sync:skill`.
> Total registered component families: **64** · Library version: `0.1.0`

If `azurite-mcp` is connected, prefer calling `get_component_spec(name)` for live lookup. Use this reference as a complete offline fallback.

## Quick Index by Category

- **Foundations** (1): `Typography`
- **Actions** (3): `Button`, `Fab & SpeedDial`, `Joint`
- **Feedback** (4): `LoadingIndicator`, `Alert`, `Toast`, `Progress`
- **Data Display** (13): `Badge`, `StatusIndicator`, `List`, `Avatar`, `Table`, `Indicator`, `Timeline`, `Chat`, `Diff`, `Stat`, `TextRotator`, `Countdown`, `Context`
- **Selection** (4): `Checkbox`, `Radio`, `Toggle`, `Rating`
- **Layout & Forms** (2): `Fieldset`, `Divider`
- **Forms** (6): `Label`, `Input`, `FileInput`, `Select`, `Validator`, `Slider`
- **Navigation & Menus** (12): `Dropdown`, `Breadcrumbs`, `Pagination`, `Stepper`, `Tabs`, `Dock`, `Drawer`, `Footer`, `MegaMenu`, `Menu`, `Navbar`, `ContextMenu`
- **Disclosure** (2): `Collapse`, `Accordion`
- **Overlays & Feedback** (1): `Tooltip`
- **Feedback & Effects** (1): `Aura`
- **Forms & Inputs** (5): `Calendar`, `ColorPicker`, `OtpInput`, `Textarea`, `Survey`
- **Layout & Containers** (4): `Carousel`, `Card`, `TiltCard`, `Stack`
- **Feedback & Overlays** (2): `Modal`, `Skeleton`
- **Code & Mockups** (4): `CodeBlock`, `ConsoleMockup`, `BrowserMockup`, `PhoneMockup`

---

## Foundations

### Typography

Instrument Sans typographic scale covering display, headline, title, body, and label roles.

- **Import**: `import { Typography } from 'azurite-react';`
- **Variants**: `display-lg`, `display-md`, `headline-lg`, `headline-md`, `headline-sm`, `title-lg`, `title-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `TypographyVariant` | `'body-md'` | DESIGN.md typographic token scale. |
| `tone` | `TypographyTone` | `'default'` | Semantic ink tone. |
| `as` | `ElementType` | — | Optional HTML tag override. |
| `tabularNums` | `boolean` | `false` | Applies tabular-nums alignment. |

---

## Actions

### Button

Tactile pill, square, and round action button across 6 variants, 6 tones, 5 scales, loading states, badges, and AI aura.

- **Import**: `import { Button } from 'azurite-react';`
- **Variants**: `solid`, `soft`, `outline`, `dashed`, `ghost`, `link`
- **Animations**: Spring Press (:active, 120ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'dashed' \| 'ghost' \| 'link'` | `'solid'` | Surface and stroke emphasis. |
| `tone` | `'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'error' \| 'success'` | `'primary'` | Semantic palette role. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Calibrated height from 28px to 56px. |
| `shape` | `'pill' \| 'square' \| 'round'` | `'pill'` | Contour shape. |
| `width` | `'auto' \| 'wide' \| 'block'` | `'auto'` | Horizontal sizing behavior. |
| `loading` | `boolean` | `false` | Displays an animated LoadingIndicator. |
| `loadingVariant` | `'spinner' \| 'dots' \| 'spokes' \| 'bars'` | `'spinner'` | Animated loader style. |
| `aura` | `boolean` | `false` | Applies subtle iridescent RGB ambient aura for AI triggers. |

### Fab & SpeedDial

Floating Action Button and interactive Speed Dial fanning circular or pill actions vertically or in a quarter-circle flower arc with labels or radial tooltips.

- **Import**: `import { Fab & SpeedDial } from 'azurite-react';`
- **Variants**: `standalone`, `vertical`, `flower`, `pill-actions`, `labeled`, `tooltips`
- **Animations**: Staggered Arc / Stack (open change, 200ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `layout` | `'vertical' \| 'flower'` | `'vertical'` | Vertical stack or quarter-circle arc. |
| `itemStyle` | `'circle' \| 'pill'` | `'circle'` | Action button silhouette. |
| `showLabels` | `boolean` | `false` | Shows pill labels beside vertical actions. |
| `showTooltips` | `boolean` | `false` | Shows outward hover/focus tooltips on flower arc. |
| `toggleMode` | `'standard' \| 'close-rotate' \| 'main-action'` | `'standard'` | Main trigger behavior. |

### Joint

Unified composite container (Joint, JointButton, JointInput, JointSelect, and SegmentedControl) grouping controls under one outer M3 contour with 1px hairlines.

- **Import**: `import { Joint } from 'azurite-react';`
- **Variants**: `horizontal`, `vertical`, `segmented`, `input-select-button`, `input-button`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis and hairline orientation. |
| `shape` | `'pill' \| 'rounded'` | — | Full pill vs 24px rounded container contour. |
| `responsive` | `boolean` | `false` | Stacks vertically on small screens and switches to horizontal pill at 640px+. |
| `fullWidth` | `boolean` | `false` | Stretches container to fill parent width. |

---

## Feedback

### LoadingIndicator

Eight animated kinetic loading primitives (spinner, dots, concentric circles, bouncing balls, wave bars, pulse wave, expanding ring, and radial spokes) across 5 sizes with speed control and pause state.

- **Import**: `import { LoadingIndicator } from 'azurite-react';`
- **Variants**: `spinner`, `dots`, `circles`, `balls`, `bars`, `pulse-wave`, `expanding-ring`, `spokes`
- **Animations**: Kinetic Loop (mount, 0.9s–1.6s)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'spinner' \| 'dots' \| 'circles' \| 'balls' \| 'bars' \| 'pulse-wave' \| 'expanding-ring' \| 'spokes'` | `'spinner'` | Loader animation geometry. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | 16px–56px calibrated scale or numeric px. |
| `tone` | `'current' \| 'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'success' \| 'warning' \| 'error'` | `'current'` | Semantic color role. |
| `speed` | `number` | `1` | Playback speed multiplier (e.g. 0.5, 1, 1.5). |
| `paused` | `boolean` | `false` | Pauses animation playback. |

### Alert

Inline status banner across basic, solid, soft, outline, dashed, and rich layouts with responsive action controls and dismissal.

- **Import**: `import { Alert } from 'azurite-react';`
- **Variants**: `basic`, `solid`, `soft`, `outline`, `dashed`, `rich`
- **Animations**: Surface Enter/Exit (mount/dismiss, 250ms / 150ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'basic' \| 'solid' \| 'soft' \| 'outline' \| 'dashed' \| 'rich'` | `'basic'` | Banner style. |
| `tone` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Semantic role. |
| `title` | `ReactNode` | — | Optional headline. |
| `description` | `ReactNode` | — | Supporting message. |
| `actions` | `ReactNode` | — | Responsive action buttons. |
| `dismissible` | `boolean` | `false` | Renders animated close button. |

### Toast

Transient pill toast notification with ToastProvider, useToast(), and 6-corner ToastViewport.

- **Import**: `import { Toast } from 'azurite-react';`
- **Variants**: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tone` | `ToastTone` | `'neutral'` | Background color role. |
| `placement` | `ToastPlacement` | — | Corner or edge anchor. |
| `pulsing` | `boolean` | `false` | Triggers attention pulse animation. |
| `dismissible` | `boolean` | `false` | Shows dismiss trigger. |

### Progress

Linear determinate/indeterminate Progress bar paired with RadialProgress circular gauges in thin, standard, bold, solid-filled, and tonal styles.

- **Import**: `import { Progress } from 'azurite-react';`
- **Variants**: `linear`, `indeterminate`, `radial-plain`, `radial-filled`, `radial-tonal`
- **Animations**: Indeterminate Slide (indeterminate=true, 1600ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | Current progress value within [min, max]. |
| `indeterminate` | `boolean` | `false` | Enables continuous looping indicator. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 4px–14px track thickness for linear bar. |
| `tone` | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Semantic indicator role. |

---

## Data Display

### Badge

Pill badge and empty circular dot across 5 sizes, 5 variants, 9 tones, icon slots, and removable control.

- **Import**: `import { Badge } from 'azurite-react';`
- **Variants**: `solid`, `soft`, `outline`, `dotted`, `ghost`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'dotted' \| 'ghost'` | `'solid'` | Visual treatment. |
| `tone` | `BadgeTone` | `'primary'` | Semantic role. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 20px–36px badge height or 8px–24px dot. |
| `empty` | `boolean` | `false` | Renders an empty circular badge dot. |
| `aura` | `boolean` | `false` | Subtle RGB aura for AI badges. |

### StatusIndicator

Animated pulsating status dot across 5 sizes and 8 semantic tones with optional inline label.

- **Import**: `import { StatusIndicator } from 'azurite-react';`
- **Variants**: `xs`, `sm`, `md`, `lg`, `xl`
- **Animations**: Status Ping (pulse=true, 1200ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 8px to 20px dot scale. |
| `tone` | `AzuriteTone` | `'primary'` | Status color role. |
| `pulse` | `boolean` | `true` | Enables ping ripple animation. |
| `label` | `ReactNode` | — | Optional status caption. |

### List

Swiss-inspired unnumbered, oversized numbered, and ranked editorial list compositions with media thumbnails, tabular metadata, and action slots.

- **Import**: `import { List } from 'azurite-react';`
- **Variants**: `unnumbered`, `numbered`, `editorial`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'unnumbered' \| 'numbered' \| 'editorial'` | `'unnumbered'` | List presentation style. |
| `framed` | `boolean` | `true` | Renders rounded container border. |
| `divided` | `boolean` | — | Renders hairline row dividers. |

### Avatar

Identity Avatar and AvatarGroup stack supporting 5 sizes, circle/squircle contours, focus rings, presence dots, initials fallback, and overflow counters.

- **Import**: `import { Avatar } from 'azurite-react';`
- **Variants**: `circle`, `squircle`, `ringed`, `presence`, `initials`, `group`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | — | Portrait image URL with automatic fallback on error. |
| `name` | `string` | — | Full name used for alt text and automatic two-letter initials. |
| `initials` | `string` | — | Explicit placeholder initials. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | 28px–80px calibrated sizes or numeric px. |
| `shape` | `'circle' \| 'squircle'` | `'circle'` | Full round vs calibrated squircle radius. |
| `tone` | `'primary-container' \| 'tertiary-container' \| 'secondary-container' \| 'primary' \| 'surface' \| 'error-container'` | `'primary-container'` | Background tone when showing initials/fallback. |
| `ring` | `boolean` | `false` | Adds an offset highlight outline ring. |
| `presence` | `'online' \| 'offline' \| 'away' \| 'busy' \| 'none'` | `'none'` | Corner status indicator dot. |

### Table

Editorial data table primitives (Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell) across plain, tonal, outlined, zebra-striped, active/hover rows, and 3 density presets.

- **Import**: `import { Table } from 'azurite-react';`
- **Variants**: `plain`, `tonal`, `outlined`, `striped`, `hoverable`, `compact`, `default`, `spacious`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `surface` | `'plain' \| 'tonal' \| 'outlined'` | `'plain'` | Background and container treatment. |
| `density` | `'compact' \| 'default' \| 'spacious'` | `'default'` | Vertical padding and typographic rhythm. |
| `striped` | `boolean` | `false` | Alternating tonal zebra row bands. |
| `hoverable` | `boolean` | `false` | Enables interactive row hover highlight and directional cue. |

### Indicator

Anchor overlay badge/dot/action component supporting all 9 placement points (4 corners, 4 edge centers, and media center) with cutout rings and optional pulse.

- **Import**: `import { Indicator } from 'azurite-react';`
- **Variants**: `top-left`, `top-center`, `top-right`, `left-center`, `center`, `right-center`, `bottom-left`, `bottom-center`, `bottom-right`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `placement` | `IndicatorPlacement` | `'top-right'` | 9-point anchor position. |
| `content` | `ReactNode` | — | Custom label, tag, or icon overlay. |
| `count` | `number` | — | Numeric badge truncated at max (e.g. 99+). |
| `dot` | `boolean` | `false` | Renders compact status dot when true or content omitted. |
| `tone` | `IndicatorTone` | `'primary'` | Semantic role fill. |
| `shape` | `'pill' \| 'rounded' \| 'circle'` | `'pill'` | Overlay badge contour. |

### Timeline

Vertical chronological Timeline supporting both-sides, left-only, right-only, alternating zigzag, colored axis connectors, dot-only, and large editorial entries.

- **Import**: `import { Timeline } from 'azurite-react';`
- **Variants**: `both-sides`, `left`, `right`, `alternating`, `colored-lines`, `dot`, `large`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `TimelineItem[]` | — | Chronological events and milestone cards. |
| `layout` | `'both-sides' \| 'left' \| 'right' \| 'alternating'` | `'right'` | Horizontal distribution relative to vertical axis. |
| `nodeVariant` | `'icon' \| 'dot'` | `'icon'` | Circled icons vs minimalist dots. |
| `cardVariant` | `'outlined' \| 'tonal' \| 'plain'` | — | Event container surface treatment. |
| `size` | `'md' \| 'lg'` | `'md'` | Standard vs large snapped-to-start editorial cards. |

### Chat

Directional ChatThread, ChatMessage, ChatBubble, and ChatDivider suite supporting boundary timestamps, pure message stacks, bottom-aligned avatars, and full delivery metadata.

- **Import**: `import { Chat } from 'azurite-react';`
- **Variants**: `indicators`, `pure`, `avatars`, `metadata`
- **Animations**: Message Enter (mount, 250ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `'incoming' \| 'outgoing'` | `'incoming'` | Alignment and primary/surface bubble role. |
| `avatar` | `ReactNode \| AvatarProps` | — | User avatar image or Avatar configuration. |
| `avatarAlign` | `'top' \| 'bottom'` | `'top'` | Avatar alignment alongside message bubble. |
| `sender` | `ReactNode` | — | Author name label. |
| `timestamp` | `ReactNode` | — | Tabular numeral message timestamp. |
| `status` | `ReactNode` | — | Delivery/read receipt footer (e.g. Seen, Delivered). |

### Diff

Side-by-side before/after Diff comparator for typography and media driven by pointer-capture dragging and an iconless pill handle.

- **Import**: `import { Diff } from 'azurite-react';`
- **Variants**: `text`, `image`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `before` * | `ReactNode` | — | Content clipped by slider position on the left. |
| `after` * | `ReactNode` | — | Base layer content on the right. |
| `value` | `number` | — | Controlled split percentage (5–95). |
| `defaultValue` | `number` | `50` | Initial split percentage. |
| `aspectRatio` | `string` | `'16 / 9'` | Viewport aspect ratio. |
| `contrastDivider` | `boolean` | `false` | Uses bright surface hairline for dark/photographic media. |

### Stat

KPI Stat tile and StatGroup container supporting left/center alignment, matched icons and avatars, actionable treasury balances, vertical lists, and responsive joined strips.

- **Import**: `import { Stat } from 'azurite-react';`
- **Variants**: `basic`, `icon`, `avatar`, `actions`, `vertical`, `joined`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` * | `ReactNode` | — | Metric caption label. |
| `value` * | `ReactNode` | — | Primary tabular numeral figure. |
| `description` | `ReactNode` | — | Comparative delta or contextual subtitle. |
| `valueTone` | `'default' \| 'primary' \| 'tertiary' \| 'success' \| 'warning' \| 'error' \| 'rose' \| 'violet' \| 'amber'` | `'default'` | Semantic value tint. |
| `surface` | `'low' \| 'default' \| 'primary-container'` | `'low'` | Container background role. |
| `layout` | `'vertical' \| 'row'` | `'vertical'` | Card layout vs horizontal badge list row. |

### TextRotator

Animated word cycling TextRotator supporting basic headlines, indexed multi-word loops (e.g. 1 / 6), and inline primary-container pill highlights.

- **Import**: `import { TextRotator } from 'azurite-react';`
- **Variants**: `default`, `inline-pill`
- **Animations**: Vertical Slide Swap (interval, 260ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `words` * | `string[]` | — | Sequence of words rotated on an interval. |
| `intervalMs` | `number` | `2400` | Delay between transitions in milliseconds. |
| `variant` | `'default' \| 'inline-pill'` | `'default'` | Plain text vs inline pill badge. |
| `showCounter` | `boolean` | `false` | Renders tabular index readout. |
| `pauseOnHover` | `boolean` | `true` | Pauses rotation while pointer hovers. |

### Countdown

Real-time tabular numeral Countdown supporting subtle/large 2-digit readouts and 5 clock formats (H/M/S letters, pulsing colons, side labels, bottom labels, boxed cards).

- **Import**: `import { Countdown } from 'azurite-react';`
- **Variants**: `digit`, `digit-large`, `letters`, `colons`, `side-labels`, `bottom-labels`, `boxed`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'digit' \| 'digit-large' \| 'letters' \| 'colons' \| 'side-labels' \| 'bottom-labels' \| 'boxed'` | `'colons'` | Timer format and clock unit chrome. |
| `seconds` | `number` | `59` | Initial countdown duration in seconds. |
| `targetDate` | `Date \| number \| string` | — | Live target timestamp alternative to fixed seconds. |
| `loop` | `boolean` | `false` | Restarts from initial seconds upon reaching zero. |
| `pulseColons` | `boolean` | `true` | Pulses separator colons smoothly. |

### Context

Compact capacity indicator Context and ContextChip pairing glanceable metric pills (SVG progress ring, icon, dot) with expandable multi-segment breakdown overlays.

- **Import**: `import { Context } from 'azurite-react';`
- **Variants**: `ai-context`, `disk-storage`, `warning`, `critical`, `micro`
- **Animations**: Overlay Expand/Collapse (chip click, 220ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` * | `ReactNode` | — | Overlay card header title. |
| `percentage` * | `number` | — | Overall utilization percentage (0–100). |
| `valueLabel` | `ReactNode` | — | Chip headline readout. |
| `summary` | `ReactNode` | — | Secondary capacity ratio displayed beside the percentage. |
| `segments` * | `ContextSegment[]` | — | Breakdown categories rendered in the stacked bar and rows. |
| `chipTone` | `'default' \| 'warning' \| 'critical'` | `'default'` | Contextual severity styling for the trigger pill. |
| `indicator` | `'ring' \| 'icon' \| 'dot' \| 'none'` | `'ring'` | Visual gauge style inside the minimized chip. |
| `actionLabel` | `ReactNode` | — | Optional footer pill action button (e.g. Compact History, Purge Cache). |
| `floating` | `boolean` | `false` | Positions the breakdown card as an outside-click dismissible floating popover. |

---

## Selection

### Checkbox

Binary and tri-state checkbox with animated SVG stroke-dashoffset check/dash, 5 sizes, solid/soft tones, and CheckboxGroup.

- **Import**: `import { Checkbox } from 'azurite-react';`
- **Variants**: `solid`, `soft`
- **Animations**: SVG Stroke Draw (checked/indeterminate change, 200ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 14px to 28px control size. |
| `variant` | `'solid' \| 'soft'` | `'solid'` | Fill emphasis. |
| `tone` | `CheckboxTone` | `'primary'` | Semantic palette role. |
| `indeterminate` | `boolean` | `false` | Displays mixed horizontal dash. |
| `label` | `ReactNode` | — | Primary label. |
| `description` | `ReactNode` | — | Supporting description. |

### Radio

Single-selection circular radio and mutually exclusive RadioGroup with 5 sizes, solid/soft roles, and spring inner dot.

- **Import**: `import { Radio } from 'azurite-react';`
- **Variants**: `solid`, `soft`
- **Animations**: Spring Dot (selected change, 180ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 14px to 28px ring diameter. |
| `variant` | `'solid' \| 'soft'` | `'solid'` | Fill emphasis. |
| `tone` | `RadioTone` | `'primary'` | Semantic palette role. |
| `label` | `ReactNode` | — | Primary label. |
| `description` | `ReactNode` | — | Supporting description. |

### Toggle

M3 Expressive pill switch across 5 sizes, 6 tones, tri-state indeterminate cycling, embedded thumb icons, and validation.

- **Import**: `import { Toggle } from 'azurite-react';`
- **Variants**: `xs`, `sm`, `md`, `lg`, `xl`, `tri-state`, `icon`
- **Animations**: Thumb Spring Travel (click, 120ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Track size from 28×16 to 64×36. |
| `tone` | `ToggleTone` | `'primary'` | Active track color role. |
| `triState` | `boolean` | `false` | Cycles mixed -> on -> off. |
| `checkedIcon` | `ReactNode` | — | Icon inside thumb when on. |
| `uncheckedIcon` | `ReactNode` | — | Icon inside thumb when off. |

### Rating

Half-step precision star and heart rating input across 5 sizes (16px–40px) with hover preview and keyboard slider navigation.

- **Import**: `import { Rating } from 'azurite-react';`
- **Variants**: `star`, `heart`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | — | Controlled rating value. |
| `defaultValue` | `number` | `0` | Initial rating. |
| `precision` | `0.5 \| 1` | `0.5` | Half-step or full-step increments. |
| `variant` | `'star' \| 'heart'` | `'star'` | Symbol geometry. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 16px–40px optical scale. |
| `showValue` | `boolean` | `false` | Displays tabular decimal score. |

---

## Layout & Forms

### Fieldset

Semantic fieldset wrapper supporting card and inline legend framing with divided row mode and validation states.

- **Import**: `import { Fieldset } from 'azurite-react';`
- **Variants**: `card`, `inline`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'card' \| 'inline'` | `'card'` | Form group card vs single-field frame. |
| `legend` | `ReactNode` | — | Fieldset legend label. |
| `divided` | `boolean` | `false` | Hairline dividers between children. |

### Divider

Minimalist Swiss hairline and typographic separator in horizontal and vertical orientations with optional inline label (e.g. "or").

- **Import**: `import { Divider } from 'azurite-react';`
- **Variants**: `horizontal`, `vertical`, `with-label`, `dashed`, `dotted`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis orientation. |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Stroke pattern. |
| `tone` | `'default' \| 'subtle' \| 'strong' \| 'primary'` | `'default'` | Divider contrast weight. |
| `children` | `ReactNode` | — | Optional centered/aligned divider label. |

---

## Forms

### Label

Standalone FieldLabel, start/end AddonGroup, and FloatingLabelWrapper supporting 5 scales and responsive mode.

- **Import**: `import { Label } from 'azurite-react';`
- **Variants**: `start-addon`, `end-addon`, `floating`, `responsive-floating`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `startAddon` | `ReactNode` | — | Boxed start-edge label or icon. |
| `endAddon` | `ReactNode` | — | Boxed end-edge unit, suffix, or validation badge. |

### Input

Text, search, credential, temporal, numeric, and URL input across standard, ghost, fieldset, floating, and pill variants with autocomplete and validation.

- **Import**: `import { Input } from 'azurite-react';`
- **Variants**: `standard`, `ghost`, `fieldset`, `floating`, `pill`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'standard' \| 'ghost' \| 'fieldset' \| 'floating' \| 'pill'` | `'standard'` | Container style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 28px to 56px height. |
| `responsive` | `boolean` | `false` | Adapts height across breakpoints (32→40→48px). |
| `suggestions` | `string[]` | — | Interactive keyboard-navigable autocomplete suggestions. |
| `passwordToggle` | `boolean` | `false` | Adds show/hide password toggle button. |
| `actionButton` | `ReactNode` | — | Joined CTA button inside input frame. |
| `aura` | `boolean` | `false` | Subtle RGB ambient aura for AI prompt fields. |

### FileInput

Single-line file picker (standard, ghost, fieldset, 5 sizes) paired with FileDropZone full-width drag-and-drop upload.

- **Import**: `import { FileInput } from 'azurite-react';`
- **Variants**: `standard`, `ghost`, `fieldset`, `dropzone`
- **Animations**: Float Upload Icon (idle in FileDropZone, 2400ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'standard' \| 'ghost' \| 'fieldset'` | `'standard'` | Trigger layout. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 28px to 56px height. |
| `maxSize` | `number` | — | Maximum file size in bytes. |

### Select

Accessible custom combobox/listbox across standard, borderless, filled, and fieldset variants, 5 sizes, start/end addons, and validation.

- **Import**: `import { Select } from 'azurite-react';`
- **Variants**: `standard`, `borderless`, `filled`, `fieldset`
- **Animations**: Menu Enter & Chevron Flip (open, 250ms / 150ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` * | `SelectOption[]` | — | Selectable options list. |
| `variant` | `'standard' \| 'borderless' \| 'filled' \| 'fieldset'` | `'standard'` | Visual framing. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 28px to 56px trigger height. |

### Validator

ValidatorHint, validateValue helper, and ValidatedForm context orchestrating field validation and reset across Input, Select, Checkbox, and Toggle.

- **Import**: `import { Validator } from 'azurite-react';`
- **Variants**: `neutral`, `valid`, `invalid`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onValidSubmit` | `(e: FormEvent) => void` | — | Called when all registered fields pass validation. |
| `onInvalidSubmit` | `(e: FormEvent) => void` | — | Called when any field fails validation. |

### Slider

Range slider across all 5 calibrated sizes (XS 4px to XL 16px), clickable step tick marks, live value readout, and vertical orientation.

- **Import**: `import { Slider } from 'azurite-react';`
- **Variants**: `continuous`, `stepped-marks`, `vertical`
- **Animations**: Thumb Spring Scale (hover/active, 120ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | — | Controlled numeric value. |
| `defaultValue` | `number` | — | Initial uncontrolled value. |
| `min` | `number` | `0` | Minimum bound. |
| `max` | `number` | `100` | Maximum bound. |
| `step` | `number` | `1` | Value increment granularity. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 4px–16px track & 14px–28px thumb proportions. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Track orientation. |
| `marks` | `boolean \| SliderMark[]` | `false` | Renders interactive tick marks and labels. |

---

## Navigation & Menus

### Dropdown

Button-initiated directional action menu supporting bottom, top, left, and right placements with icons, checkmarks, dividers, and destructive items.

- **Import**: `import { Dropdown } from 'azurite-react';`
- **Variants**: `bottom`, `bottom-start`, `bottom-end`, `top`, `top-start`, `top-end`, `left`, `right`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `DropdownItem[]` | — | Menu items, labels, and dividers. |
| `placement` | `DropdownPlacement` | `'bottom-start'` | Menu expansion direction. |

### Breadcrumbs

Hierarchical navigation trail supporting text links, leading icons, interactive collapsible middle truncation, and horizontally scrollable narrow containers.

- **Import**: `import { Breadcrumbs } from 'azurite-react';`
- **Variants**: `simple`, `with-icons`, `collapsed-middle`, `scrollable`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `BreadcrumbItem[]` | — | Ordered navigation path segments. |
| `maxItems` | `number` | — | Maximum visible items before collapsing middle segments into expandable ellipsis. |
| `scrollable` | `boolean` | `false` | Prevents wrapping and enables sleek horizontal scroll. |
| `framed` | `boolean` | `true` | Places trail inside an elevated surface pill/card strip. |
| `activeTone` | `'default' \| 'primary'` | `'default'` | Color role for the active trailing page item. |

### Pagination

Tabular-numeral pagination controls featuring pill numeric sequences, automatic range ellipsis truncation, and compact mobile Previous/Next bar.

- **Import**: `import { Pagination } from 'azurite-react';`
- **Variants**: `standard`, `compact`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `totalPages` * | `number` | — | Total page count. |
| `page` | `number` | — | Controlled active page (1-indexed). |
| `defaultPage` | `number` | `1` | Initial uncontrolled page. |
| `variant` | `'standard' \| 'compact'` | `'standard'` | Desktop numeric sequence vs compact Previous/Next bar. |
| `siblingCount` | `number` | `1` | Number of adjacent pages around the current page. |
| `boundaryCount` | `number` | `2` | Number of always-visible opening and closing pages. |

### Stepper

Interactive sequential Stepper supporting horizontal numbered, vertical editorial, and responsive icon-led progressions.

- **Import**: `import { Stepper } from 'azurite-react';`
- **Variants**: `horizontal`, `vertical`, `responsive-icon`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `steps` * | `StepItem[]` | — | Ordered workflow steps. |
| `activeStep` | `number` | — | Zero-based active step index. |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive'` | `'horizontal'` | Layout axis (responsive collapses icon stepper vertically on mobile). |
| `variant` | `'numbered' \| 'icon'` | `'numbered'` | Check/number nodes vs icon-led pill nodes. |
| `interactive` | `boolean` | `true` | Allows clicking steps to update activeStep. |

### Tabs

Navigation Tabs (plus TabList, Tab, TabPanel primitives) supporting plain, underline, bordered-pill, container, and solid-pill styles across 4 sizes and notification indicators.

- **Import**: `import { Tabs } from 'azurite-react';`
- **Variants**: `plain`, `underline`, `bordered-pill`, `container`, `solid-pill`
- **Animations**: Panel Enter (tab selection, 250ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `TabItem[]` | — | Declarative tabs and optional panels. |
| `value` | `string` | — | Controlled active tab id. |
| `variant` | `'plain' \| 'underline' \| 'bordered-pill' \| 'container' \| 'solid-pill'` | `'underline'` | Visual tab treatment. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Calibrated height/padding tier. |

### Dock

Bottom navigation Dock across 6 calibrated heights (48px XS icon-only through 96px XL command bar) with animated M3 active indicator pills and Tooltip integration.

- **Import**: `import { Dock } from 'azurite-react';`
- **Variants**: `xs`, `sm`, `regular`, `md`, `lg`, `xl`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `DockItem[]` | — | Dock navigation destinations with labels and Material Symbol icons. |
| `value` | `string` | — | Controlled active destination ID. |
| `size` | `'xs' \| 'sm' \| 'regular' \| 'md' \| 'lg' \| 'xl'` | `'regular'` | 6 proportional dock heights (48/56/64/72/84/96px). |
| `action` | `ReactNode` | — | Trailing primary action CTA slot for lg dock. |
| `floating` | `boolean` | `true` | Applies soft ambient floating shadow. |

### Drawer

Sidebar navigation Drawer supporting compact Icon-Only rails (with Tooltip labels), pure Typographic lists, Icons + Labels drawers, and animated slide-over Portal overlay mode.

- **Import**: `import { Drawer } from 'azurite-react';`
- **Variants**: `icons`, `text`, `combined`
- **Animations**: Slide-Over Transition (open, 250ms / 150ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'icons' \| 'text' \| 'combined'` | `'combined'` | Compact icon rail, text-only list, or standard icon-label sidebar. |
| `sections` * | `DrawerSection[]` | — | Divided navigation groups with active pill highlight. |
| `value` | `string` | — | Controlled active destination ID. |
| `overlay` | `boolean` | `false` | Renders slide-over fullscreen drawer in portal with backdrop scrim. |
| `open` | `boolean` | `true` | Visibility toggle for overlay drawer mode. |
| `side` | `'left' \| 'right'` | `'left'` | Viewport edge anchor for slide-over overlay. |

### Footer

Swiss editorial Footer featuring oversized bold responsive typography (clamp display scale), hairline divider, and multi-column navigation links.

- **Import**: `import { Footer } from 'azurite-react';`
- **Variants**: `contained`, `full-width`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` * | `FooterColumn[]` | — | Responsive multi-column link groups. |
| `wordmark` | `ReactNode` | — | Custom oversized branding block replacing default brandPrefix/brandSuffix. |
| `brandPrefix` | `string` | `'darkblue'` | Leading wordmark label before primary accent dot. |
| `brandSuffix` | `string` | `'tech'` | Trailing wordmark suffix. |
| `contained` | `boolean` | `false` | Optional rounded card framing; defaults to full-width borderless footer. |

### MegaMenu

Multi-column MegaMenu suite including MegaMenu (vertical lists, action columns, comprehensive 12-col with supporting imagery), interactive MegaMenuPopover, and collapsible MegaMenuIntegrated.

- **Import**: `import { MegaMenu } from 'azurite-react';`
- **Variants**: `vertical-menus`, `actions`, `popover`, `comprehensive`, `integrated`
- **Animations**: Integrated Drawer Collapse (toggle click, 250ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'vertical-menus' \| 'actions' \| 'comprehensive'` | `'vertical-menus'` | Column layout and supporting imagery treatment. |
| `columns` * | `MegaMenuColumn[]` | — | Categorized vertical navigation link columns. |
| `actionsColumn` | `MegaMenuActionColumn` | — | Interactive links and primary pill CTA column. |
| `supportingCards` | `MegaMenuFeatureCard[]` | — | Featured hero and compact thumbnail cards. |

### Menu

Versatile navigation Menu supporting vertical and horizontal tracks, icon-only toolbars with hover Tooltips, 5 size scales (XS–XL), numeric badges, headers, disabled items, and nested collapsible trees.

- **Import**: `import { Menu } from 'azurite-react';`
- **Variants**: `vertical`, `horizontal`, `icon-only`, `nested-tree`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `MenuItem[]` | — | Hierarchical list of links, badges, icons, and collapsible children. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 5 proportional item scales. |
| `iconOnly` | `boolean` | `false` | Compact 36px icon-only buttons. |
| `showTooltips` | `boolean` | `false` | Reveals hover Tooltips for compact icon strips. |
| `header` | `ReactNode` | — | Titled header bar separated by hairline rule. |

### Navbar

Swiss top Navbar and primitives (NavbarBrand, NavbarLinks, NavbarSearch, NavbarIconButton with badge counts, NavbarSubBar) covering 8 editorial and workspace bar architectures.

- **Import**: `import { Navbar } from 'azurite-react';`
- **Variants**: `centered-title`, `between`, `symmetric`, `two-tier`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `layout` | `'centered-title' \| 'between' \| 'symmetric'` | `'between'` | Edge-to-edge flex split vs mathematically centered 3-column grid. |
| `start` | `ReactNode` | — | Leading slot (title, brand mark, burger button). |
| `center` | `ReactNode` | — | Centered logo, links grid, or search bar. |
| `end` | `ReactNode` | — | Trailing action buttons, badges, CTA, or profile dropdown. |
| `subMenu` | `ReactNode` | — | Attached second-tier sub-navigation bar. |
| `sticky` | `boolean` | `false` | Sticks navbar to top edge with translucent backdrop blur. |

### ContextMenu

Contextual action surfaces (ContextMenu & ContextMenuSurface) supporting nested cascading submenus, keyboard accelerators, grouped hairline sections, live checkbox/radio items, all 8 directional placements, and pointer-coordinate right-click menus.

- **Import**: `import { ContextMenu } from 'azurite-react';`
- **Variants**: `standard`, `submenu`, `shortcuts`, `icons`, `groups`, `checkboxes`, `radio`, `anchored`
- **Animations**: Anchored Menu Reveal (open, 250ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `trigger` * | `ReactNode` | — | Target element or right-click surface. |
| `triggerMode` | `'click' \| 'contextmenu' \| 'both'` | `'click'` | Opens relative to element on click or clamped to pointer coordinates on right-click. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Directional anchor preset. |
| `items` | `ContextMenuItem[]` | — | Single-group menu items (action, checkbox, radio, submenu). |
| `groups` | `ContextMenuGroup[]` | — | Divided item groups with optional headers. |
| `submenuLayout` | `'overlay' \| 'inline-beside'` | `'overlay'` | Floating cascading submenu vs side-by-side inline layout. |
| `closeOnSelect` | `boolean` | `true` | Dismisses menu after action selection while keeping checkbox toggles interactive. |

---

## Disclosure

### Collapse

Progressive disclosure panel with minimalist, arrow, and plus/minus indicators, forced states, and smooth grid-row height animation.

- **Import**: `import { Collapse } from 'azurite-react';`
- **Variants**: `none`, `arrow`, `plus-minus`, `force-open`, `force-closed`
- **Animations**: Grid Row Expand (open change, 220ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` * | `ReactNode` | — | Trigger title. |
| `indicator` | `'none' \| 'arrow' \| 'plus-minus'` | `'arrow'` | State icon style. |
| `forceState` | `'open' \| 'closed'` | — | Locks panel permanently open or closed. |

### Accordion

Joined (divided) and separate (spaced cards) accordion built on Collapse with exclusive or multi-open modes.

- **Import**: `import { Accordion } from 'azurite-react';`
- **Variants**: `joined`, `separate`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` * | `AccordionItem[]` | — | Accordion panels. |
| `variant` | `'joined' \| 'separate'` | `'joined'` | Unified vs spaced layout. |
| `indicator` | `'none' \| 'arrow' \| 'plus-minus'` | `'arrow'` | Toggle icon indicator. |
| `multiple` | `boolean` | `false` | Allows multiple panels open simultaneously. |

---

## Overlays & Feedback

### Tooltip

Directional, offset, and rich icon-and-copy tooltips across 8 placements, 7 semantic surface tones, optional hover delay, inline showcase mode, and click-to-pin.

- **Import**: `import { Tooltip } from 'azurite-react';`
- **Variants**: `top`, `bottom`, `left`, `right`, `top-start`, `top-end`, `bottom-start`, `bottom-end`, `rich`, `inline`
- **Animations**: State Reveal (hover/focus/pin, 150ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `ReactNode` | — | Tooltip text or element for plain tooltips. |
| `title` | `ReactNode` | — | Headline for rich tooltip cards. |
| `description` | `ReactNode` | — | Supporting body text for rich tooltip cards. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'top'` | Relative anchor edge. |
| `tone` | `'inverse' \| 'primary' \| 'primary-container' \| 'tertiary' \| 'secondary' \| 'error' \| 'surface'` | `'inverse'` | Surface and ink role. |
| `size` | `'sm' \| 'md'` | `'md'` | Compact icon-trigger vs standard tooltip scale. |
| `variant` | `'plain' \| 'rich'` | `'plain'` | Compact label vs multi-line rich card. |
| `offset` | `number` | `6` | Main-axis distance from trigger in px. |
| `crossOffset` | `number` | `0` | Cross-axis shift in px for start/end offset anchors. |
| `pinOnClick` | `boolean` | `false` | Toggles pinned visibility when trigger is clicked. |
| `alwaysOpen` | `boolean` | `false` | Keeps the floating bubble visible permanently. |
| `inline` | `boolean` | `false` | Renders the tooltip card inline in normal document flow. |
| `delay` | `number` | `0` | Hover/focus reveal delay in ms. |

---

## Feedback & Effects

### Aura

Animated conic-gradient orbital border-light wrapper highlighting priority cards, containers, and pill triggers across 4 motion patterns, 5 thicknesses, and custom tempos.

- **Import**: `import { Aura } from 'azurite-react';`
- **Variants**: `single`, `dual`, `rainbow`, `wide`
- **Animations**: Orbital Spin (continuous, 1.5s–12s)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'single' \| 'dual' \| 'rainbow' \| 'wide'` | `'single'` | Orbital beam count and perimeter sweep curve. |
| `preset` | `'azure' \| 'emerald' \| 'violet' \| 'amber' \| 'rainbow'` | `'azure'` | Thematic conic gradient color stops. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Beam stroke weight from 1px (xs) to 4px (xl). |
| `speed` | `'fast' \| 'standard' \| 'slow' \| 'ambient'` | — | Preset orbital durations (1.5s, 4s, 8s, 12s). |
| `duration` | `string \| number` | — | Custom animation duration overriding speed. |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| string` | `'xl'` | Matches wrapped inner container curvature. |
| `inline` | `boolean` | `false` | Shrink-wraps inline triggers such as pill buttons. |
| `glow` | `boolean` | `true` | Enables outer blurred halo layer behind crisp perimeter beam. |

---

## Forms & Inputs

### Calendar

Interactive monthly date and two-point range-selection Calendar grid across sm (24px), md (32px), and lg (40px) densities with arrow-key navigation.

- **Import**: `import { Calendar } from 'azurite-react';`
- **Variants**: `single`, `range`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'single' \| 'range'` | `'single'` | Single date selection or continuous range span. |
| `value` | `Date \| null` | — | Controlled selected single date. |
| `rangeValue` | `CalendarRange` | — | Controlled range start and end dates. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24px, 32px, or 40px day cell density. |
| `minDate` | `Date` | — | Earliest selectable date. |
| `maxDate` | `Date` | — | Latest selectable date. |
| `isDateDisabled` | `(date: Date) => boolean` | — | Predicate disabling specific calendar days. |
| `showFooter` | `boolean` | `true` | Displays formatted tabular selection readout. |
| `fullWidth` | `boolean` | `false` | Stretches calendar container to fill parent width. |

### ColorPicker

Interactive spectrum ColorPicker, curated ColorSwatchGrid, and SM/MD/LG ColorTrigger popover with live HSV/HEX/RGB/HSL channel synchronization.

- **Import**: `import { ColorPicker } from 'azurite-react';`
- **Variants**: `spectrum`, `swatch-grid`, `trigger`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | — | Controlled HEX color string (e.g. #0A36D1). |
| `defaultValue` | `string` | `'#0A36D1'` | Initial uncontrolled color. |
| `onChange` | `(hex: string, meta: ColorValueMeta) => void` | — | Fires with normalized HEX and RGB/HSL/HSV channels. |
| `showInputs` | `boolean` | `true` | Shows synchronized HEX, RGB, and HSL inputs. |
| `showSwatches` | `boolean` | `false` | Embeds curated token swatches below controls. |
| `disabled` | `boolean` | `false` | Locks color picker interaction. |

### OtpInput

Joined and Separated one-time passcode fields across 5 cell sizes (32px–64px) with smart Backspace, clipboard paste distribution, and ValidatedForm integration.

- **Import**: `import { OtpInput } from 'azurite-react';`
- **Variants**: `joined`, `separated`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `length` | `number` | `6` | Digit count (e.g. 4 or 6). |
| `variant` | `'joined' \| 'separated'` | `'separated'` | Unified divider strip vs discrete spaced cells. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Cell dimensions from 32px (xs) to 64px (xl). |
| `mode` | `'numeric' \| 'alphanumeric'` | `'numeric'` | Allowed character filter. |
| `onComplete` | `(code: string) => void` | — | Triggered when all passcode cells are filled. |
| `disabled` | `boolean` | `false` | Locks passcode entry. |

### Textarea

Multi-line Textarea supporting Default and Ghost surfaces, 5 proportional density sizes (XS–XL), live character counters, Clear control, auto-resize, and ValidatedForm validation.

- **Import**: `import { Textarea } from 'azurite-react';`
- **Variants**: `default`, `ghost`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'ghost'` | `'default'` | Standard outlined surface vs transparent hover/focus ghost field. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding, border radius, and typographic scale. |
| `label` | `ReactNode` | — | Accessible label. |
| `showCount` | `boolean` | `false` | Displays live tabular character count. |
| `clearable` | `boolean` | `false` | Displays inline Clear button. |
| `autoResize` | `boolean` | `false` | Automatically grows height to fit content. |
| `disabled` | `boolean` | `false` | Locks input and resize handle. |

### Survey

Complete Survey & Quiz Forms kit (SurveyChoiceQuestion, SurveyMatrix, SurveyScale, SurveyRating, SurveyField, SurveyForm, SurveyProgress, SurveyModal, SurveyResults) covering single/multiple choice, custom "Other" inputs, correct/incorrect quiz feedback, radio/checkbox grids, star/linear scales, live validation, wizard modals, and result charts.

- **Import**: `import { Survey } from 'azurite-react';`
- **Variants**: `single-choice`, `multiple-choice`, `custom-other`, `matrix-grid`, `scale`, `rating`, `multi-stage`, `modal`, `results`
- **Animations**: Result Bar Fill & Modal Transitions (mount / open, 360ms / 250ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'single' \| 'multiple'` | `'single'` | Selection mode for SurveyChoiceQuestion and SurveyMatrix. |
| `options` | `SurveyOption[]` | — | Choice options with optional feedback status or custom "Other" text entry. |
| `validate` | `(value: string) => string \| null` | — | Live validation function on SurveyField clearing automatically when resolved. |
| `current` | `number` | — | Current question step for SurveyProgress. |
| `inline` | `boolean` | `false` | Renders SurveyModal inline in a preview stage vs fullscreen animated portal. |
| `items` | `SurveyResultItem[]` | — | Result rows rendered with animated bar fills or linear progress tracks in SurveyResults. |

---

## Layout & Containers

### Carousel

Smooth scroll-snap Carousel supporting start, center, end, full-width, half-width, vertical, and full-bleed track configurations.

- **Import**: `import { Carousel } from 'azurite-react';`
- **Variants**: `start`, `center`, `end`, `full-width`, `vertical`, `half-width`, `full-bleed`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'start' \| 'center' \| 'end' \| 'full-width' \| 'vertical' \| 'half-width' \| 'full-bleed'` | `'start'` | Snap alignment and slide sizing mode. |
| `height` | `number \| string` | `420` | Viewport height for vertical carousels. |
| `showControls` | `boolean` | `true` | Displays previous/next step buttons. |
| `showDots` | `boolean` | `false` | Displays slide pagination dots. |
| `loop` | `boolean` | `false` | Wraps navigation when reaching track boundaries. |
| `defaultIndex` | `number` | `0` | Initial active slide index positioned on mount. |

### Card

Composable surface Card system plus SelectableCard and SelectableCardGroup covering tonal, pricing, 5 density sizes (XS–XL), solid/dashed outlines, overlay scrims, top-action headers, and segmented choices.

- **Import**: `import { Card } from 'azurite-react';`
- **Variants**: `tonal`, `outlined`, `elevated`, `dashed`, `neutral`, `overlay`, `selectable`, `selectable-segmented`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'tonal' \| 'outlined' \| 'elevated' \| 'dashed' \| 'neutral' \| 'overlay'` | `'tonal'` | Container fill, border, and overlay style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding (12px–48px) and radius density. |
| `padded` | `boolean` | `true` | Disable when pairing edge-to-edge CardMedia with CardBody. |
| `align` | `'start' \| 'center'` | `'start'` | Editorial vs symmetrically centered layout. |
| `interactive` | `boolean` | `false` | Adds hover elevation lift or outline emphasis. |

### TiltCard

3D perspective TiltCard with CSS-only 9-zone or continuous pointer-tracked tilt, Z-depth inner layers (TiltDepthLayer), and dynamic radial glare.

- **Import**: `import { TiltCard } from 'azurite-react';`
- **Variants**: `grid`, `pointer`
- **Animations**: Perspective Tilt (hover, 650ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'grid' \| 'pointer'` | `'grid'` | CSS-only 9-zone hover matrix vs live pointer tracking. |
| `aspectRatio` | `string` | `'1.586 / 1'` | Card frame aspect ratio. |
| `maxTilt` | `number` | `6` | Maximum tilt angle in degrees. |
| `perspective` | `number` | `1200` | 3D stage perspective distance in px. |
| `glare` | `boolean` | `true` | Soft radial specular sheen overlay. |

### Stack

Layered three-card Stack container supporting Top, Bottom, Start, and End directional offsets in Shadow-based Elevation or zero-shadow Tonal Contrast depth.

- **Import**: `import { Stack } from 'azurite-react';`
- **Variants**: `top`, `bottom`, `start`, `end`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Offset axis of background stack cards. |
| `depth` | `'shadow' \| 'tonal'` | `'shadow'` | Layered elevation shadows vs flat M3 container tone stepping. |
| `layers` | `number` | `3` | Number of visible card planes (2–4). |
| `interactive` | `boolean` | `false` | Allows clicking to cycle multi-card children. |

---

## Feedback & Overlays

### Modal

Modal dialog component across Standard, text-only Dialog, Simple, and Wide widths supporting animated portal overlays and inline canvas previews.

- **Import**: `import { Modal } from 'azurite-react';`
- **Variants**: `standard`, `dialog`, `simple`, `wide`
- **Animations**: Dialog Enter/Exit (open, 250ms / 150ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `open` * | `boolean` | — | Controls dialog visibility. |
| `onClose` | `() => void` | — | Invoked when Close, Escape, or backdrop is triggered. |
| `variant` | `'standard' \| 'dialog' \| 'simple' \| 'wide'` | `'standard'` | Dialog proportion and header/button hierarchy. |
| `inline` | `boolean` | `false` | Renders inline in document flow instead of a fullscreen portal. |
| `title` | `ReactNode` | — | Modal heading. |
| `description` | `ReactNode` | — | Modal body message. |
| `footer` | `ReactNode` | — | Custom action footer overriding default Close button. |

### Skeleton

Skeleton shapes (pulse & shimmer), M3 Expressive character-wave SkeletonText ("AI is thinking"), and composite Media/Profile/Metric SkeletonCard presets.

- **Import**: `import { Skeleton } from 'azurite-react';`
- **Variants**: `pulse`, `shimmer`, `expressive-text`, `card-presets`
- **Animations**: Expressive Character Wave (continuous, 2200ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'rect' \| 'rounded' \| 'circle' \| 'pill' \| 'text'` | `'rounded'` | Structural placeholder geometry. |
| `animation` | `'pulse' \| 'shimmer' \| 'none'` | `'pulse'` | Tonal opacity pulse vs linear shimmer sweep. |
| `width` | `number \| string` | — | Explicit width. |
| `height` | `number \| string` | — | Explicit height. |
| `lines` | `number` | `1` | Multi-line text placeholder stack. |

---

## Code & Mockups

### CodeBlock

Editorial syntax-highlighted CodeBlock with built-in multi-language tokenizer (TSX, TS, JS, CSS, HTML, JSON, Bash, Python, SQL, YAML, Markdown), Light/Dark/Auto polarity, multi-file tabs, focus/diff line markers, line wrap toggle, collapsible overflow, and one-click Copy.

- **Import**: `import { CodeBlock } from 'azurite-react';`
- **Variants**: `auto`, `light`, `dark`, `multi-file`, `diff`, `collapsible`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `code` | `string` | — | Source code string rendered when files array is omitted. |
| `language` | `CodeLanguage` | `'tsx'` | Built-in tokenizer language (tsx, ts, js, css, html, json, bash, python, sql, yaml, markdown, text). |
| `filename` | `string` | — | Header filename or label. |
| `files` | `CodeBlockFile[]` | — | Multi-file tabs switching source code, language, and line markers. |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Follows Azurite theme or forces explicit contrast polarity. |
| `showLineNumbers` | `boolean` | `false` | Displays non-selectable tabular line numbers in the gutter. |
| `copyable` | `boolean` | `true` | Renders Copy button with animated confirmation check. |
| `allowWrapToggle` | `boolean` | `false` | Adds interactive word-wrap toggle icon button in header. |
| `wrapLines` | `boolean` | `false` | Controlled soft-wrapping for long code lines. |
| `highlightLines` | `number[]` | — | 1-indexed lines highlighted with Royal Blue focus tint. |
| `addedLines` | `number[]` | — | 1-indexed diff lines marked with emerald + gutter. |
| `removedLines` | `number[]` | — | 1-indexed diff lines marked with rose - gutter. |
| `maxHeight` | `number \| string` | — | Constrains scroll viewport height. |
| `collapsible` | `boolean` | `false` | Clamps long blocks with fade and Expand/Collapse button. |
| `compact` | `boolean` | `false` | Compact spacing and lg radius for embedded panels. |
| `aura` | `boolean` | `false` | Subtle RGB ambient aura for AI-generated snippets. |

### ConsoleMockup

Editorial CLI & terminal frame supporting hybrid lines array or declarative ConsoleLine children, switchable macOS/minimal/Windows chrome, dark/light/auto polarity, sequential animated playback with Replay, blinking cursor, and Copy.

- **Import**: `import { ConsoleMockup } from 'azurite-react';`
- **Variants**: `dark`, `light`, `auto`, `macos`, `minimal`, `windows`, `animated`
- **Animations**: Sequential Output Reveal & Caret Blink (animated / cursor, 180ms / 1050ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lines` | `ConsoleLineItem[]` | — | Structured command and output lines with optional prefix and semantic tone. |
| `title` | `ReactNode` | `'Terminal'` | Window title label. |
| `chrome` | `'macos' \| 'minimal' \| 'windows'` | `'macos'` | Window control bar style. |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'dark'` | Color polarity. |
| `statusBadge` | `ReactNode` | — | Optional badge or status pill in header bar. |
| `copyable` | `boolean` | `true` | Copies command lines or full buffer to clipboard. |
| `animated` | `boolean` | `false` | Sequentially reveals lines with Replay control. |
| `lineDelayMs` | `number` | `340` | Delay in milliseconds between animated lines. |
| `cursor` | `boolean` | `false` | Renders blinking terminal prompt cursor. |
| `wrapLines` | `boolean` | `false` | Wraps long output lines. |
| `aura` | `boolean` | `false` | Subtle RGB aura for AI agent terminal streams. |

### BrowserMockup

Desktop BrowserMockup showcase frame featuring switchable macOS/minimal/Windows chrome, optional interactive tabs, pill address bar with HTTPS state, navigation & spin-reload controls, custom toolbar slot, elevation tiers, and Light/Dark viewport parity.

- **Import**: `import { BrowserMockup } from 'azurite-react';`
- **Variants**: `macos`, `minimal`, `windows`, `tabbed`, `flat`, `soft`, `floating`
- **Animations**: Reload Spin (reload click, 450ms)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | `'https://design.darkblue.tech'` | URL displayed in the pill address bar. |
| `secure` | `boolean` | `true` | Displays secure HTTPS lock or warning unlock icon. |
| `chrome` | `'macos' \| 'minimal' \| 'windows'` | `'macos'` | Window chrome controls style. |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Frame and inner viewport theme polarity. |
| `tabs` | `BrowserTab[]` | — | Interactive browser tabs syncing page URL and content. |
| `showNavControls` | `boolean` | `true` | Displays Back/Forward chevrons. |
| `showReload` | `boolean` | `true` | Displays interactive Reload button with spin animation. |
| `toolbarEnd` | `ReactNode` | — | Trailing toolbar action slot. |
| `elevation` | `'flat' \| 'soft' \| 'floating'` | `'soft'` | Container shadow depth. |
| `contentPadding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner viewport padding preset. |
| `aura` | `boolean` | `false` | Subtle RGB aura for AI web previews. |

### PhoneMockup

Calibrated flagship mobile PhoneMockup with customizable camera cutouts (dynamic-island, notch, punch-hole, none), 4 metallic finishes (obsidian, titanium, silver, azurite), sm/md/lg scales, portrait/landscape orientation, Material Symbols status bar, and nested Light/Dark parity.

- **Import**: `import { PhoneMockup } from 'azurite-react';`
- **Variants**: `dynamic-island`, `notch`, `punch-hole`, `none`, `portrait`, `landscape`, `obsidian`, `titanium`, `silver`, `azurite`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `topCutout` | `'dynamic-island' \| 'notch' \| 'punch-hole' \| 'none'` | `'dynamic-island'` | Camera cutout silhouette. |
| `finish` | `'obsidian' \| 'titanium' \| 'silver' \| 'azurite'` | `'obsidian'` | Metallic chassis finish. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Device frame scale. |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | Device orientation. |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Screen surface and nested Azurite theme polarity. |
| `showStatusBar` | `boolean` | `true` | Shows clock and Material Symbols signal, Wi-Fi, and battery icons. |
| `statusTime` | `string` | `'9:41'` | Custom status bar clock string. |
| `showHomeIndicator` | `boolean` | `true` | Shows bottom gesture indicator pill. |
| `showSideButtons` | `boolean` | `true` | Renders exterior hardware buttons along frame edge. |
| `screenPadding` | `'none' \| 'sm' \| 'md'` | `'md'` | Inner screen content padding. |
| `aura` | `boolean` | `false` | Subtle RGB aura framing AI mobile interfaces. |
