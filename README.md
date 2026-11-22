# CoimUI v1.0.0

**CoimUI** is an original Svelte 5 UI component library, accessible design system, application shell framework, and multi-application ecosystem built with TypeScript 7, Tailwind CSS 4, Bits UI, and SvelteKit 3.

## Workspace Packages

| Package | Path | Role |
|---|---|---|
| `@coimui/svelte` | `packages/coimui` | Publishable Svelte 5 library (`src/lib` -> `dist`) with modular subpath exports |
| `@coimui/starter` | `apps/starter` | Lean SvelteKit 3 starter admin application consuming only `@coimui/svelte` |
| `@coimui/showcase` | `apps/showcase` | Interactive component catalog, dashboards, data grid, charts, date pickers, plugins, forms & docs app |

## Modular Exports (`@coimui/svelte`)

CoimUI keeps core application bundles lean while exposing heavy data visualization and rich editor modules as opt-in subpath exports:

- `@coimui/svelte` — Core components, layout shell primitives, theme engine, forms/Zod adapter, utilities, and icons (`@coimui/svelte/styles`)
- `@coimui/svelte/data-grid` — TanStack Table v9 + Virtualizer grid with sorting, filtering, pinning, inline editing, CSV & XLSX exports (`@coimui/svelte/styles/data-grid.css`)
- `@coimui/svelte/charts` — Eleven chart and legend components powered by LayerChart & D3 (`@coimui/svelte/styles/charts.css`)
- `@coimui/svelte/date-pickers` — Calendar, range calendar, segmented ISO date/time fields, digital/analog clock, date-time pickers (`@coimui/svelte/styles/date-pickers.css`)
- `@coimui/svelte/plugins` — Client-guarded rich text, carousel, lightbox, emoji picker, markdown, syntax-highlighted code block, video, event calendar, sortable list & print utilities (`@coimui/svelte/styles/plugins.css`)

## Quick Start

```bash
bun install --frozen-lockfile
bun run check
bun run typecheck:ts7
bun run test:unit
bun run build
bun run test:parity
```

To run the local apps during development:

```bash
bun run dev:starter   # http://localhost:4175
bun run dev:showcase  # http://localhost:4174
```

See the `docs/` directory for full architectural, design token, component catalog, dependency, and development documentation.
