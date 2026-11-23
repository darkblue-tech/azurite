# Azurite Design System

Swiss International Typographic discipline meets Google Material Design 3 Expressive geometry — built by **darkblue.tech** ([design.darkblue.tech](https://design.darkblue.tech)).

## Packages & Agent Tooling

| Artifact | Purpose | Install / Command |
| :--- | :--- | :--- |
| **[`azurite-react`](./packages/react)** | 64 React components + Light/Dark CSS tokens (zero runtime deps) | `npm install azurite-react` |
| **[`azurite-mcp`](./packages/mcp)** | Live MCP server exposing component specs & tokens | `npx -y azurite-mcp` |
| **[`azurite-design`](./skills/azurite)** | Portable Agent Skill (`SKILL.md` + offline references) | `npx skills add darkblue-tech/azurite --skill azurite-design` |

## Quick Start

```bash
npm install azurite-react
```

Import the stylesheet once at your app entry point:

```tsx
import 'azurite-react/styles.css';
```

Documentation, live interactive playground, and framework guides: https://design.darkblue.tech/components/usage

## Development

```bash
npm install
npm run build
npm run typecheck
```
