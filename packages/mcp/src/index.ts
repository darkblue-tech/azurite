import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { azuriteRegistry } from 'azurite-react/registry';
import { z } from 'zod';

const server = new McpServer({
  name: 'azurite-design-system',
  version: azuriteRegistry.version,
});

server.tool(
  'list_components',
  'List all components in the Azurite Design System',
  {
    category: z.string().optional().describe('Optional category filter'),
  },
  async ({ category }) => {
    const components = category
      ? azuriteRegistry.components.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase(),
        )
      : azuriteRegistry.components;

    const summary = components.map((c) => ({
      name: c.name,
      slug: c.slug,
      category: c.category,
      description: c.description,
      variants: c.variants ?? [],
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            { count: summary.length, components: summary },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  'get_component_spec',
  'Get full specification (props, variants, animations, examples) for an Azurite component',
  {
    name: z.string().describe('Component name or slug (e.g. Button, button)'),
  },
  async ({ name }) => {
    const query = name.toLowerCase();
    const spec = azuriteRegistry.components.find(
      (c) => c.name.toLowerCase() === query || c.slug.toLowerCase() === query,
    );

    if (!spec) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Component "${name}" not found in Azurite registry.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(spec, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'get_design_tokens',
  'Get Azurite Design System tokens (colors, typography, spacing, radii, elevation, motion, aura)',
  {
    group: z
      .enum(['all', 'colors', 'typography', 'spacing', 'radii', 'elevation', 'motion', 'aura'])
      .optional()
      .default('all'),
  },
  async ({ group }) => {
    const data =
      group === 'all'
        ? azuriteRegistry.tokens
        : { [group]: azuriteRegistry.tokens[group] };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'search_design_system',
  'Search Azurite components and tokens by keyword',
  {
    query: z.string().min(1).describe('Search keyword'),
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    const matchingComponents = azuriteRegistry.components.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.variants ?? []).some((v) => v.toLowerCase().includes(q)) ||
        c.props.some((p) => p.name.toLowerCase().includes(q)),
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              query,
              components: matchingComponents,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Failed to start Azurite MCP server:', err);
  process.exit(1);
});
