#!/usr/bin/env node
/**
 * Generates skills/azurite/references/components.md, references/tokens.md, and
 * apps/web/public/.well-known/agent-skills (+ .well-known/skills) directly from
 * azurite-react/registry and packages/react/src/tokens/tokens.css so skill
 * references never drift out of sync with the library.
 *
 * Usage: npm run build:lib && npm run sync:skill
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(skillDir, '..', '..');
const registryPath = path.join(repoRoot, 'packages/react/dist/registry.js');
const tokensCssPath = path.join(repoRoot, 'packages/react/src/tokens/tokens.css');
const refsDir = path.join(skillDir, 'references');
const webPublicDir = path.join(repoRoot, 'apps/web/public');

if (!fs.existsSync(registryPath)) {
  console.error(
    `Missing built registry at ${registryPath}. Run "npm run build:lib" before "npm run sync:skill".`,
  );
  process.exit(1);
}

const { azuriteRegistry } = await import(pathToFileURL(registryPath).href);
const tokensCss = fs.readFileSync(tokensCssPath, 'utf8').trim();

fs.mkdirSync(refsDir, { recursive: true });

/* ============================================================================
 * 1. Generate references/components.md
 * ============================================================================ */

function escapeCell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

const byCategory = new Map();
for (const comp of azuriteRegistry.components) {
  const list = byCategory.get(comp.category) ?? [];
  list.push(comp);
  byCategory.set(comp.category, list);
}

const compLines = [
  '# Azurite Component Catalog',
  '',
  '> Auto-generated from `azurite-react/registry` via `npm run sync:skill`.',
  `> Total registered component families: **${azuriteRegistry.components.length}** · Library version: \`${azuriteRegistry.version}\``,
  '',
  'If `azurite-mcp` is connected, prefer calling `get_component_spec(name)` for live lookup. Use this reference as a complete offline fallback.',
  '',
  '## Quick Index by Category',
  '',
];

for (const [category, comps] of byCategory.entries()) {
  const names = comps.map((c) => `\`${c.name}\``).join(', ');
  compLines.push(`- **${category}** (${comps.length}): ${names}`);
}
compLines.push('');

for (const [category, comps] of byCategory.entries()) {
  compLines.push(`---`, '', `## ${category}`, '');
  for (const comp of comps) {
    compLines.push(`### ${comp.name}`);
    compLines.push('');
    compLines.push(comp.description);
    compLines.push('');
    compLines.push(`- **Import**: \`import { ${comp.name} } from '${comp.importPath}';\``);
    if (comp.variants && comp.variants.length > 0) {
      compLines.push(`- **Variants**: ${comp.variants.map((v) => `\`${v}\``).join(', ')}`);
    }
    if (comp.animations && comp.animations.length > 0) {
      const anims = comp.animations
        .map((a) => `${a.name} (${a.trigger}${a.duration ? `, ${a.duration}` : ''})`)
        .join('; ');
      compLines.push(`- **Animations**: ${anims}`);
    }
    if (comp.props && comp.props.length > 0) {
      compLines.push('');
      compLines.push('| Prop | Type | Default | Description |');
      compLines.push('| :--- | :--- | :--- | :--- |');
      for (const p of comp.props) {
        const nameCol = p.required ? `\`${p.name}\` *` : `\`${p.name}\``;
        const typeCol = `\`${escapeCell(p.type)}\``;
        const defCol = p.defaultValue ? `\`${escapeCell(p.defaultValue)}\`` : '—';
        compLines.push(`| ${nameCol} | ${typeCol} | ${defCol} | ${escapeCell(p.description)} |`);
      }
    }
    compLines.push('');
  }
}

fs.writeFileSync(path.join(refsDir, 'components.md'), `${compLines.join('\n').trimEnd()}\n`, 'utf8');

/* ============================================================================
 * 2. Generate references/tokens.md
 * ============================================================================ */

const { tokens } = azuriteRegistry;

function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const tokenLines = [
  '# Azurite Design Tokens & Standalone Theme Setup',
  '',
  '> Auto-generated from `azurite-react/registry` and `packages/react/src/tokens/tokens.css` via `npm run sync:skill`.',
  '',
  'Always consume semantic CSS custom properties (`var(--az-*)`) so Light Mode (`[data-theme="light"]`) and Dark Mode (`[data-theme="dark"]` / `.dark`) stay in AA-calibrated parity.',
  '',
  '## Color Palette (Light & Dark)',
  '',
  '| Token Role | CSS Variable | Light | Dark |',
  '| :--- | :--- | :--- | :--- |',
];

for (const key of Object.keys(tokens.colors.light)) {
  const cssVar = `--az-color-${camelToKebab(key)}`;
  tokenLines.push(
    `| \`${key}\` | \`${cssVar}\` | \`${tokens.colors.light[key]}\` | \`${tokens.colors.dark[key]}\` |`,
  );
}

tokenLines.push(
  '',
  '## Typography Scale (`Instrument Sans`)',
  '',
  '| Role | Size | Line Height | Weight | Letter Spacing |',
  '| :--- | :--- | :--- | :--- | :--- |',
);

for (const [role, spec] of Object.entries(tokens.typography)) {
  tokenLines.push(
    `| \`${role}\` | \`${spec.fontSize}\` | \`${spec.lineHeight}\` | \`${spec.fontWeight}\` | \`${spec.letterSpacing}\` |`,
  );
}

tokenLines.push(
  '',
  '## Spacing Rhythm (8px base, 4px micro)',
  '',
  '| Token | CSS Variable | Value |',
  '| :--- | :--- | :--- |',
);

for (const [key, val] of Object.entries(tokens.spacing)) {
  tokenLines.push(`| \`${key}\` | \`--az-space-${key}\` | \`${val}\` |`);
}

tokenLines.push(
  '',
  '## Radii (M3 Expressive)',
  '',
  '| Token | CSS Variable | Value | Usage |',
  '| :--- | :--- | :--- | :--- |',
  `| \`sm\` | \`--az-radius-sm\` | \`${tokens.radii.sm}\` | Micro badges, checkboxes |`,
  `| \`md\` | \`--az-radius-md\` | \`${tokens.radii.md}\` | Menu items, inputs, small cards |`,
  `| \`lg\` | \`--az-radius-lg\` | \`${tokens.radii.lg}\` | Popovers, menus, grouped lists |`,
  `| \`xl\` | \`--az-radius-xl\` | \`${tokens.radii.xl}\` | Primary cards, modals, panels |`,
  `| \`full\` | \`--az-radius-full\` | \`${tokens.radii.full}\` | Buttons, chips, search pills |`,
  '',
  '## Motion Curves',
  '',
  '| Role | Duration | Timing Function |',
  '| :--- | :--- | :--- |',
);

for (const [role, m] of Object.entries(tokens.motion)) {
  tokenLines.push(`| \`${role}\` | \`${m.duration}\` | \`${m.timingFunction}\` |`);
}

tokenLines.push(
  '',
  '## AI Ambient Aura (Strictly for AI Features)',
  '',
  `- **Gradient Stops**: ${tokens.aura.stops.map((c) => `\`${c}\``).join(', ')}`,
  `- **CSS Vars**: \`${tokens.aura.gradientVar}\`, \`${tokens.aura.glowVar}\``,
  '',
  '---',
  '',
  '## Standalone Tailwind `theme.extend` Snippet (Non-React Fallback)',
  '',
  'Use this when building a Tailwind CSS project without `azurite-react`:',
  '',
  '```js',
  '// tailwind.config.js (pair with the CSS custom properties below for automatic Dark Mode)',
  'export default {',
  "  darkMode: ['class', '[data-theme=\"dark\"]'],",
  '  theme: {',
  '    extend: {',
  '      fontFamily: {',
  "        sans: ['\"Instrument Sans\"', 'system-ui', 'sans-serif'],",
  '      },',
  '      colors: {',
  "        primary: 'var(--az-color-primary)',",
  "        'on-primary': 'var(--az-color-on-primary)',",
  "        'primary-container': 'var(--az-color-primary-container)',",
  "        'on-primary-container': 'var(--az-color-on-primary-container)',",
  "        secondary: 'var(--az-color-secondary)',",
  "        tertiary: 'var(--az-color-tertiary)',",
  "        'tertiary-container': 'var(--az-color-tertiary-container)',",
  "        'on-tertiary-container': 'var(--az-color-on-tertiary-container)',",
  "        surface: 'var(--az-color-surface)',",
  "        'on-surface': 'var(--az-color-on-surface)',",
  "        'on-surface-variant': 'var(--az-color-on-surface-variant)',",
  "        'surface-container-low': 'var(--az-color-surface-container-low)',",
  "        'surface-container': 'var(--az-color-surface-container)',",
  "        'surface-container-high': 'var(--az-color-surface-container-high)',",
  "        outline: 'var(--az-color-outline)',",
  "        'outline-variant': 'var(--az-color-outline-variant)',",
  "        error: 'var(--az-color-error)',",
  "        'error-container': 'var(--az-color-error-container)',",
  "        'on-error-container': 'var(--az-color-on-error-container)',",
  '      },',
  '      borderRadius: {',
  "        sm: '6px',",
  "        md: '12px',",
  "        lg: '16px',",
  "        xl: '24px',",
  "        full: '9999px',",
  '      },',
  '    },',
  '  },',
  '};',
  '```',
  '',
  '## Canonical CSS Tokens (`tokens.css`)',
  '',
  '```css',
  tokensCss,
  '```',
  '',
);

fs.writeFileSync(path.join(refsDir, 'tokens.md'), tokenLines.join('\n'), 'utf8');

/* ============================================================================
 * 3. Publish .well-known/agent-skills & .well-known/skills for npx skills add
 * ============================================================================ */

const skillIndexPayload = {
  skills: [
    {
      name: 'azurite-design',
      description:
        'Design and build websites, web applications, dashboards, AI workspaces, surveys, and documentation interfaces using the Azurite Design System (Swiss editorial 12-column grid + Google Material Design 3 Expressive geometry + subtle AI RGB Aura).',
      files: [
        'SKILL.md',
        'references/components.md',
        'references/tokens.md',
        'references/layouts.md',
      ],
    },
  ],
};

if (fs.existsSync(path.join(repoRoot, 'apps/web'))) {
  for (const wellKnownRootName of ['agent-skills', 'skills']) {
    const wkDir = path.join(webPublicDir, '.well-known', wellKnownRootName);
    const wkSkillDir = path.join(wkDir, 'azurite-design');
    const wkRefsDir = path.join(wkSkillDir, 'references');
    fs.mkdirSync(wkRefsDir, { recursive: true });
    fs.writeFileSync(
      path.join(wkDir, 'index.json'),
      `${JSON.stringify(skillIndexPayload, null, 2)}\n`,
      'utf8',
    );
    fs.copyFileSync(path.join(skillDir, 'SKILL.md'), path.join(wkSkillDir, 'SKILL.md'));
    for (const refFile of ['components.md', 'tokens.md', 'layouts.md']) {
      fs.copyFileSync(path.join(refsDir, refFile), path.join(wkRefsDir, refFile));
    }
  }
}

console.log(
  `Synced Azurite skill references (${azuriteRegistry.components.length} components, v${azuriteRegistry.version}) -> references/ & apps/web/public/.well-known/`,
);

