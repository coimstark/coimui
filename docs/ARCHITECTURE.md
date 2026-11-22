# CoimUI Architecture

## Monorepo Layout

CoimUI is organized as a Bun workspace with strict separation between library distribution, lean starter usage, and full showcase verification:

```text
coimui/
├── packages/coimui/          # @coimui/svelte library (@sveltejs/package -> dist/)
├── apps/starter/             # @coimui/starter minimal template app
├── apps/showcase/            # @coimui/showcase full interactive reference app
├── tests/visual-parity/      # Playwright + @axe-core/playwright runtime & WCAG AA suite
└── docs/                     # Product & engineering documentation
```

## Subpath Boundary Design

The core entrypoint (`@coimui/svelte`) depends only on lightweight primitives (`bits-ui`, `@internationalized/date`, `dayjs`, `clsx`, `tailwind-merge`, `@fontsource/mulish`, `@fontsource/urbanist`). Optional feature domains live in separate entrypoints with matching optional stylesheets:

| Entrypoint | Core Dependencies / Peer Engine | SSR Strategy |
|---|---|---|
| `.`, `./theme`, `./components`, `./layouts`, `./forms`, `./utilities`, `./icons` | Bits UI, Tailwind 4 CSS tokens | Full deterministic HTML SSR |
| `./data-grid` | `@tanstack/svelte-table`, `@tanstack/svelte-virtual`, `papaparse`, `@atlaskit/pragmatic-drag-and-drop`, lazy `exceljs` | Full table HTML SSR; ExcelJS dynamically imported on export |
| `./charts` | `layerchart` (`ssr: true`), `d3-array`, `d3-scale`, `d3-shape` | Deterministic SVG chart SSR |
| `./date-pickers` | `bits-ui`, `@internationalized/date`, `dayjs` | Full SSR support |
| `./plugins` | `quill`, `swiper`, `photoswipe`, `emoji-picker-element`, `marked`, `dompurify`, `highlight.js`, `video.js`, `@event-calendar/core`, `@atlaskit/pragmatic-drag-and-drop` | Guarded browser `$effect` initialization with SSR fallback markup |

## Application Shell & State Architecture

- **Theme Context (`CoimThemeProvider` & `ThemeState`)**: Manages accent preset (`theme-purple`, `theme-blue`, `theme-green`, `theme-orange`), color mode (`light`, `dark`, `system`), content width (`boxed`, `fluid`), elevation (`elevated`, `flat`), top navigation width, and writing direction (`ltr`, `rtl`) with SSR-safe hydration.
- **Navigation Shell (`CoimAppShell` & `LayoutState`)**: Coordinates collapsible single-layer / dual-layer navigation drawers, responsive mobile drawer overlays, header search modal (`CoimSearchDialog`), notifications/shortcuts/user menus, and customizer drawer (`CoimThemeConfiguration`).
- **Route Structure in Apps**: Both `apps/starter` and `apps/showcase` use SvelteKit 3 path aliases (`#lib/*` configured via Node `package.json` `"imports"`) and Vite 8 + `@sveltejs/adapter-node`.
