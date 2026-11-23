# azurite-react

Official React component library for the **Azurite Design System** (`design.darkblue.tech`), combining Swiss editorial 12-column precision with Material Design 3 Expressive geometry, full Light/Dark contrast parity, zero runtime dependencies, and 64 documented primitives.

## Installation

```bash
npm install azurite-react
```

## Setup

Import the compiled stylesheet once in your app entry file:

```tsx
import 'azurite-react/styles.css';
```

Load `Instrument Sans` and `Material Symbols Outlined` in your HTML `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
```

Set theme polarity via `data-theme="light"` or `data-theme="dark"` on `<html>`.

## Documentation & AI Tooling

- Docs & live playground: https://design.darkblue.tech/components/usage
- MCP server: `npx -y azurite-mcp`
- Agent skill: `npx skills add darkblue-tech/azurite --skill azurite-design`

