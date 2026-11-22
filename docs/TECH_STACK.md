# CoimUI v1.0.0 Technology Stack

## Core Runtime & Toolchain

| Layer | Technology | Locked Version | Purpose |
|---|---|---|---|
| UI Framework | `svelte` | `5.59.1` | Native Svelte 5 runes components (`$state`, `$derived`, `$effect`, `$props`, `$bindable`) |
| Meta-Framework | `@sveltejs/kit` | `3.4.0` | Routing, SSR, form actions, `@sveltejs/adapter-node` (`6.0.5`) builds |
| Library Packager | `@sveltejs/package` | `3.0.3` | Generates tree-shakeable ESM + `.svelte` + `.d.ts` output in `packages/coimui/dist/` |
| Bundler | `vite` | `8.3.8` | Client + SSR asset compilation with `@sveltejs/vite-plugin-svelte` (`7.3.1`) |
| Styling | `tailwindcss` | `4.3.5` | Tailwind CSS v4 with `@tailwindcss/vite` (`4.3.5`) & HSL token variables |
| Package Manager | `bun` | `1.4.4` (workspace lockfile verified) | Workspaces, frozen-lockfile installs, script execution, and `pm pack` |
| Primary Compiler | TypeScript 7 (`@typescript/native`) | `npm:typescript@7.0.2` | Native `tsgo` checks (`svelte-check --tsgo` and `tsc --noEmit`) |
| Tooling Compatibility Compiler | `typescript` | `6.0.3` | Compiler-API consumer compatibility for packaging & Kit syncing |

## Component Primitives & Engines

- **Accessible UI Primitives**: `bits-ui@2.22.0` (Dialog, Popover, Menu, Menubar, Select, Combobox, Tooltip, Accordion, Tabs, Slider, Switch, Checkbox, RadioGroup, Calendar, RangeCalendar, DateField, TimeField, DatePicker, DateRangePicker).
- **Date & Locale Arithmetic**: `@internationalized/date@3.12.4`, `dayjs@1.11.23`.
- **Fonts**: `@fontsource/mulish@5.3.0`, `@fontsource/urbanist@5.3.0`.
- **Forms & Validation**: `zod@4.6.7`, `sveltekit-superforms@3.1.0` (`zod4` / `zod4Client` adapters), `imask@7.6.1`.
- **Internationalization**: `i18next@27.2.3` (multi-locale LTR + Arabic RTL support).
- **Data Grid (`./data-grid`)**: `@tanstack/svelte-table@9.3.2`, `@tanstack/svelte-virtual@3.13.52`, `@atlaskit/pragmatic-drag-and-drop@4.0.0`, `papaparse@5.7.1`, `exceljs@4.4.0` (dynamically imported).
- **Charts (`./charts`)**: `layerchart@2.11.0`, `d3-array@3.2.5`, `d3-scale@4.0.3`, `d3-shape@3.2.1`.
- **Plugins (`./plugins`)**: `quill@2.0.3`, `swiper@14.4.0`, `photoswipe@5.4.4`, `emoji-picker-element@1.29.1`, `marked@18.2.1`, `dompurify@3.4.18`, `highlight.js@11.12.0`, `@videojs/html@10.6.0`, `@event-calendar/core@5.21.1`.

## Compiler & TypeScript 7 Side-by-Side Strategy

`typecheck:ts7` runs TypeScript 7.0.2 natively via `@typescript/native` (`tsc --noEmit -p tsconfig.json`), and `svelte-check --tsgo` runs TypeScript 7 diagnostics across all Svelte files in `@coimui/svelte`, `@coimui/starter`, and `@coimui/showcase`, while `typescript@6.0.3` satisfies classic compiler-API consumers (`@sveltejs/package@3.0.3`).
