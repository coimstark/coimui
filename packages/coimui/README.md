# @coimui/svelte

**CoimUI** is an original Svelte 5 UI component library, accessible design system, and application shell framework built with TypeScript, Tailwind CSS 4, and Bits UI.

- GitHub Repository: https://github.com/coimstark/coimui
- npm Package: https://www.npmjs.com/package/@coimui/svelte

## Installation

```bash
bun add @coimui/svelte
```

Make sure compatible peer dependencies (`svelte`, `tailwindcss`) are installed in your application:

- Svelte: `>= 5.20.0` (verified with Svelte `5.59.1`)
- Tailwind CSS: `>= 4.0.0` (verified with Tailwind CSS `4.3.5`)
- TypeScript: `>= 6.0` / `7.0.2`
- Package Managers / Runtimes: Bun `1.4+` or Node.js `24+`

## Quick Usage

### 1. Import CoimUI styles

In your application stylesheet (e.g. `src/app.css`):

```css
@import "@coimui/svelte/styles";
```

Or load core styles without bundled fonts:

```css
@import "@coimui/svelte/styles/core.css";
```

When using optional feature modules, import their stylesheets alongside the corresponding JS subpath:

```css
@import "@coimui/svelte/styles/data-grid.css";
@import "@coimui/svelte/styles/charts.css";
@import "@coimui/svelte/styles/date-pickers.css";
@import "@coimui/svelte/styles/plugins.css";
```

### 2. Wrap your app in `CoimThemeProvider` and render components

```svelte
<script lang="ts">
  import { CoimThemeProvider, CoimCard, CoimCardContent, CoimButton } from "@coimui/svelte";
</script>

<CoimThemeProvider>
  <CoimCard>
    <CoimCardContent class="flex items-center justify-between gap-4">
      <span>Welcome to CoimUI</span>
      <CoimButton variant="contained">Get Started</CoimButton>
    </CoimCardContent>
  </CoimCard>
</CoimThemeProvider>
```

## Subpath Exports

Heavy optional integrations remain isolated behind explicit subpaths so core applications stay lean:

| JS Subpath | Purpose | Optional CSS |
|---|---|---|
| `@coimui/svelte` | Core components, layouts, theme engine, forms, utilities, icons | `@coimui/svelte/styles` or `@coimui/svelte/styles/core.css` |
| `@coimui/svelte/theme` | `CoimThemeProvider`, `ThemeState`, theme types & tokens | — |
| `@coimui/svelte/components` | Layout, surfaces, inputs, data display, navigation, feedback | — |
| `@coimui/svelte/layouts` | `CoimAppShell`, header/sidebar navigation, configurator, user/notifications/search chrome | — |
| `@coimui/svelte/icons` | `CoimIcon` and UI icon library (`@coimui/svelte/icons/ui/*`, `./icons/illustrations/*`) | — |
| `@coimui/svelte/forms` | Schema-agnostic form & Zod issue adapter | — |
| `@coimui/svelte/utilities` | Portal, click-away listener, transitions, screen & utility helpers | — |
| `@coimui/svelte/data-grid` | TanStack Table v9 + Virtualizer grid, inline editing, pinning, native i18n (`translate`, `DEFAULT_DATA_GRID_LABELS`, `resolveDataGridLabel`), CSV & XLSX exports | `@coimui/svelte/styles/data-grid.css` |
| `@coimui/svelte/charts` | Area, Bar, Line, Pie, Scatter, Sparkline, Gauge, Radar, Heatmap & Funnel charts | `@coimui/svelte/styles/charts.css` |
| `@coimui/svelte/date-pickers` | ISO Calendar, RangeCalendar, DatePicker, DateRangePicker, TimePicker & DateTimePicker | `@coimui/svelte/styles/date-pickers.css` |
| `@coimui/svelte/plugins` | RichTextEditor, Markdown, CodeBlock, Carousel, Lightbox, EmojiPicker, SortableList, VideoPlayer, EventCalendar & print | `@coimui/svelte/styles/plugins.css` |

## Optional Peer Dependencies by Subpath

- `@coimui/svelte/data-grid`: `@tanstack/svelte-table`, `@tanstack/svelte-virtual`, `@atlaskit/pragmatic-drag-and-drop`, `papaparse`, `exceljs`
- `@coimui/svelte/charts`: `layerchart`, `d3-array`, `d3-scale`, `d3-shape`
- `@coimui/svelte/date-pickers`: `dayjs` (included) + `bits-ui` & `@internationalized/date` (included)
- `@coimui/svelte/plugins`: `quill`, `marked`, `dompurify`, `highlight.js`, `swiper`, `photoswipe`, `emoji-picker-element`, `@event-calendar/core`, `@atlaskit/pragmatic-drag-and-drop`, `@videojs/html`

## License

MIT
