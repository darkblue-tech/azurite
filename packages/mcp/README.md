# azurite-mcp

Model Context Protocol (MCP) stdio server exposing live specs, props, variants, animations, and Light/Dark design tokens from `azurite-react/registry`.

## Usage

```bash
npx -y azurite-mcp
```

### Claude Code

```bash
claude mcp add azurite -- npx -y azurite-mcp
```

### Cursor / Antigravity / Generic MCP JSON

```json
{
  "mcpServers": {
    "azurite": {
      "command": "npx",
      "args": ["-y", "azurite-mcp"]
    }
  }
}
```

## Available Tools

- `list_components(category?)` — browse registered component families and variants
- `get_component_spec(name)` — inspect exact TypeScript props, defaults, and animations
- `get_design_tokens(group?)` — query colors, typography, spacing, radii, elevation, motion, and aura tokens
- `search_design_system(query)` — search across components, props, and variants

Docs: https://design.darkblue.tech/ai

