# CoimUI Design System

## Typography

CoimUI pairs two self-hosted variable/static font families bundled cleanly via Fontsource:

- **Headings (`--coim-font-heading`)**: `Urbanist`, fallback `ui-sans-serif, system-ui, sans-serif`
- **Body & Controls (`--coim-font-body`)**: `Mulish`, fallback `ui-sans-serif, system-ui, sans-serif`

Semantic typographic variants (`h1`–`h6`, `subtitle1`, `subtitle2`, `body1`, `body2`, `button`, `overline`, `caption`, `inherit`) are exposed by `CoimTypography`, with optional `component` tag overrides to preserve sequential heading outlines (`h1 -> h2 -> h3`).

## Color Tokens & WCAG 2.1 AA Compliance

All core color tokens are defined using HSL CSS custom properties in `packages/coimui/src/lib/styles/tokens.css` and preset overrides under `packages/coimui/src/lib/styles/themes/`.

### Neutral Surfaces & Text

| Token | Light Mode HSL | Dark Mode HSL | Purpose |
|---|---|---|---|
| `--background` | `0 0% 98%` | `226 4% 12%` | Primary application viewport canvas |
| `--background-paper` | `0 0% 100%` | `226 4% 14%` | Cards, menus, drawers, modals |
| `--text-primary` | `0 0% 30%` | `0 0% 90%` | Primary copy & headings |
| `--text-secondary` | `0 0% 42%` | `0 0% 70%` | Breadcrumbs, helper text, subheaders (>= 4.76:1 AA verified) |

### Semantic Feedback Tokens

| Token | Light Mode HSL | Dark Mode HSL |
|---|---|---|
| `--error` | `347 68% 46%` | `347 68% 62%` |
| `--info` | `193 84% 31%` | `193 74% 60%` |
| `--success` | `115 60% 30%` | `115 48% 58%` |
| `--warning` | `25 88% 37%` | `25 84% 62%` |

### Theme Presets

1. `theme-purple` (`THEME_OPTIONS.PURPLE`, default)
2. `theme-blue` (`THEME_OPTIONS.BLUE`)
3. `theme-green` (`THEME_OPTIONS.GREEN`)
4. `theme-orange` (`THEME_OPTIONS.ORANGE`)

Each preset defines `--primary`, `--secondary`, and `--accent-1` through `--accent-6` with `-light` and `-dark` scales tuned for `>= 4.5:1` foreground contrast on filled, outlined, text, and pastel variants.

## Elevation, Radius, Layout & RTL

- **Elevation**: Levels `0` through `6` plus global `Elevation.Flat` mode toggle.
- **Border Radius Scale**: `--border-radius-4xs` (`0.5rem`) through `--border-radius-4xl` (`2rem`).
- **Logical Styling & RTL**: Padding, margins, column pinning, tabs, and shell navigation flip seamlessly when `document.documentElement.dir = "rtl"`.
