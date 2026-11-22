# CoimUI v1.0.0 Dependency Inventory

All runtime, optional peer, and development dependencies are pinned cleanly and reproduced via `bun.lock` (`bun install --frozen-lockfile`).

## Core Library Direct Dependencies (`packages/coimui/package.json`)

| Package | Version | License | Usage |
|---|---|---|---|
| `@fontsource/mulish` | `5.3.0` | OFL-1.1 | Body & UI sans font family |
| `@fontsource/urbanist` | `5.3.0` | OFL-1.1 | Display & heading font family |
| `@internationalized/date` | `3.12.4` | Apache-2.0 | Timezone-aware ISO date/time value objects |
| `bits-ui` | `2.22.0` | MIT | Unstyled accessible Svelte 5 UI primitives |
| `clsx` | `2.1.1` | MIT | Conditional class concatenation |
| `dayjs` | `1.11.23` | MIT | Lightweight date formatting helpers |
| `tailwind-merge` | `3.7.1` | MIT | Conflict-free Tailwind utility merging (`cn`) |

## Optional Peer Dependencies (`packages/coimui/package.json`)

Consumers using only `@coimui/svelte` do not pull optional engines into their client bundle. Consumers using optional subpath exports install only the matching peers:

| Peer Package | Range / Workspace Version | Required For |
|---|---|---|
| `svelte` | `^5.59.0` (`5.59.1`) | All entrypoints |
| `tailwindcss` | `^4.0.0` (`4.3.5`) | Style tokens & layers |
| `@tanstack/svelte-table` | `^9.3.2` (`9.3.2`) | `./data-grid` |
| `@tanstack/svelte-virtual` | `^3.13.52` (`3.13.52`) | `./data-grid` virtualization |
| `@atlaskit/pragmatic-drag-and-drop` | `^4.0.0` (`4.0.0`) | `./data-grid`, `./plugins` sortable list |
| `papaparse` | `^5.7.1` (`5.7.1`) | `./data-grid` CSV export |
| `exceljs` | `^4.4.0` (`4.4.0`) | `./data-grid` dynamic XLSX export |
| `layerchart` | `^2.11.0` (`2.11.0`) | `./charts` |
| `d3-array`, `d3-scale`, `d3-shape` | `^3.2.5`, `^4.0.3`, `^3.2.1` | `./charts` scales & geometry |
| `imask` | `^7.6.1` (`7.6.1`) | Core masked input optional adapter |
| `quill` | `^2.0.3` (`2.0.3`) | `./plugins` rich text editor |
| `swiper` | `^14.4.0` (`14.4.0`) | `./plugins` carousel |
| `photoswipe` | `^5.4.4` (`5.4.4`) | `./plugins` lightbox |
| `emoji-picker-element` | `^1.29.1` (`1.29.1`) | `./plugins` emoji picker |
| `marked` & `dompurify` | `^18.2.1`, `^3.4.18` | `./plugins` sanitized Markdown |
| `highlight.js` | `^11.12.0` (`11.12.0`) | `./plugins` code blocks |
| `@videojs/html` | `^10.6.0` (`10.6.0`) | `./plugins` video player |
| `@event-calendar/core` | `^5.21.1` (`5.21.1`) | `./plugins` event calendar |

## Workspace Apps & Quality Tooling

- **Starter (`apps/starter`)**: `@coimui/svelte`, `i18next@27.2.3`, `sveltekit-superforms@3.1.0`, `zod@4.6.7`, `@sveltejs/adapter-node@6.0.5`.
- **Showcase (`apps/showcase`)**: Core + all subpath peers + `i18next@27.2.3`, `sveltekit-superforms@3.1.0`, `zod@4.6.7`, `@sveltejs/adapter-node@6.0.5`.
- **Testing & Typechecking (root `devDependencies`)**: `vitest@5.1.1`, `@testing-library/svelte@5.4.2`, `@testing-library/jest-dom@8.0.0`, `jsdom@31.0.1`, `@playwright/test@1.65.1`, `@axe-core/playwright@4.14.0`, `svelte-check@4.7.8`, `@typescript/native` (`npm:typescript@7.0.2`), `typescript@6.0.3`.
