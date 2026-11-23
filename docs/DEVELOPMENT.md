# CoimUI Development Guide

## Prerequisites

- **Bun** (`>= 1.4.4`)
- Chromium for Playwright verification (`./node_modules/.bin/playwright install chromium`)

## Workspace Commands

| Command | Scope | Description |
|---|---|---|
| `bun install --frozen-lockfile` | Root workspace | Deterministic dependency installation |
| `bun run package` | `@coimui/svelte` | Packages `src/lib/` to `dist/` via `@sveltejs/package` |
| `bun run check` | Library + Starter + Showcase | Packages library, syncs SvelteKit routes, runs `svelte-check --tsgo` (TS 7) |
| `bun run typecheck:ts7` | `@coimui/svelte` | Runs standalone TypeScript 7.0.2 (`tsc --noEmit`) |
| `bun run test:unit` | `@coimui/svelte` | Runs Vitest JSDOM component tests + Vitest SSR suite |
| `bun run build` | Library + Starter + Showcase | Builds `@coimui/svelte`, `@coimui/starter`, and `@coimui/showcase` |
| `bun run test:parity` | Showcase & Starter builds | Runs Playwright runtime, visual token, keyboard, viewport & axe WCAG 2.1 AA tests |

## Authoring Rules

- **Library Packaging (`packages/coimui`)**: Preserve strict separation between core entrypoints (`src/lib/index.ts`, `styles/core.css`) and optional subpaths (`data-grid`, `charts`, `date-pickers`, `plugins` and their dedicated CSS files).
- **SvelteKit 3 App Imports**: In `apps/*`, configure local aliases via `package.json` `"imports"` (e.g., `"#lib/*": "./src/lib/*"`) rather than legacy `$lib` paths.
- **Accessibility Standards**:
  - Maintain sequential headings (`<h1>` -> `<h2>` -> `<h3>`) per route.
  - Keep interactive controls outside `role="img"` containers.
  - Provide accessible names on progress bars, icon buttons, scrollable code regions (`role="region"` + `aria-label` + `tabindex="0"`), and list action buttons (`<li>` inside `<ul>`).
  - Keep foreground/surface contrast `>= 4.5:1` across both light and dark tokens.

## Release Verification

- **OIDC Submission vs. Availability**: Pushing a `vX.Y.Z` tag runs `.github/workflows/publish.yml`, which finishes once `npm publish --access public --provenance` exits `0` (**`SUBMITTED`**: `Accepted by npm — registry processing pending`). Because npm publish-time malware scanning can delay availability for several minutes or longer, GitHub Actions does not poll the registry.
- **Local Verification (Outside GitHub Actions)**: Run `bun run verify:release -- <version>` (or add `--wait` to poll locally) before creating a GitHub Release:
  - **`SUBMITTED` (exit 2)**: Submitted to npm and still pending publish-time security scanning; wait and re-check locally without re-tagging or republishing.
  - **`AVAILABLE` (exit 0)**: Version is publicly indexed, SLSA provenance attestation metadata is present, and the published tarball installs and passes `npm audit signatures` in a clean temporary directory.
  - **`BLOCKED/REJECTED` (exit 3)**: Security hold, rejection, missing provenance, signature mismatch, or install failure; check npm maintainer notices/support before taking action.
