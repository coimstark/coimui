# Changelog

All notable changes to `@coimui/svelte` and the CoimUI workspace are documented in this file.

## [1.1.2] - 2026-11-28

### Sidebar Navigation & Accordion Fixes
- Fixed `CoimSecondaryItem` and `CoimLeftMenu` accordion state management so expanding sibling or different navigation groups works reliably even while another group owns the active route (removed the competing auto-reopen `$effect` inside `CoimSecondaryItem`).
- Synchronized initial SSR and route-driven `openedAccordions` expansion centrally in `CoimLeftMenu` using `findActiveAccordionChain` (exported from `@coimui/svelte/layouts`), supporting click navigation, hard refresh, deep links, browser back/forward, desktop, and mobile drawers while preserving manual group toggles across `items` array identity updates.
- Eliminated duplicate `onNavigate` invocations and spurious desktop backdrop triggers in `MenuType.SingleLayer`, and added modifier-key guards before triggering internal link selection.
- Replaced abrupt `{#if isExpanded}` submenu mounts with accessible smooth CSS `grid-template-rows` + `inert` collapse transitions (`motion-reduce:transition-none`).

## [1.1.1] - 2026-11-27

### Accessibility & Layout Fixes
- Fixed WCAG 1.3.1 `aria-required-children` in `CoimDataGridPivotPanel` by converting the Row Fields container to a semantic `<ul>`/`<li>` list and moving the "Add row field" `<select>` + button controls outside the list, with `Enter`-key submission support.
- Updated `CoimVersionSelect` to derive its default selected label from `versions[0].label` (and default option `CoimUI v${COIMUI_VERSION}`) instead of hardcoding `CoimUI v1.0.0`.
- Reconciled Showcase API documentation defaults (`CoimButton`, `CoimTextField`, `CoimPopper`, `CoimCircularProgress`, `CoimLinearProgress`, `CoimCollapse`) and SvelteKit 3 installation config against the library TypeScript implementation.

## [1.1.0] - 2026-11-27

### Application Shell & DataGrid Enhancements
- Added native `translate?: TranslateFn` i18n support across `CoimDataGrid`, `CoimDataGridToolbar`, `CoimDataGridPivotPanel`, `CoimDataGridAiBar`, and `buildPivotTable`, backed by `DEFAULT_DATA_GRID_LABELS` and `resolveDataGridLabel` exported from `@coimui/svelte/data-grid`.
- Improved DataGrid keyboard scrolling and sorting semantics (`role="region"` + `tabindex="0"` scroll container and conditional `aria-sort` without `"none"`).
- Added `logoSlot`, `brandText`, `showThemeConfiguration`, `showFooter`, and `fullHeight` props on `CoimAppShell` (threaded through `CoimHeader`, `CoimLeftMenu`, and `CoimMain`) for white-label SaaS branding and full-height flush workspaces.
- Enabled `ctaSlot` rendering in `MenuType.SingleLayer` in `CoimLeftMenu`.
- Added initials avatar fallback for avatar-less users (fixing `< md` mobile visibility) plus `activeAccountId`, `keepUserProfileOnAccountSwitch`, `showAccounts`, `showThemePicker`, and `showLocalePicker` options on `CoimUserMenu`.
- Threaded `translate` into `CoimSearchDialog`, `CoimNotificationsMenu`, and `CoimThemeConfiguration` with fallback keys in `DEFAULT_LAYOUT_LABELS`, and hid unused/demo category tabs when custom search items are supplied.
- Decoupled standalone `onRowDelete` action rendering in `CoimDataGrid` from `editMode="row"`.

## [1.0.1] - 2026-11-23

### Visual & Layout Refinements
- Aligned `CoimVersionSelect` trigger button geometry to medium outlined control sizing (`rounded-md`, `36px` height) with matching medium chevron alignment.
- Refined `CoimContentWrapper` responsive padding (`lg:py-8` without asymmetric desktop trailing inset) and kept `CoimLeftMenu` layered beneath sticky headers on mobile drawers.
- Updated `CoimThemeConfiguration` dividers (`my-0`), theme-tinted palette options, and modal/drawer backdrop scrims (`rgba(0, 0, 0, 0.5)`) across `CoimDialog`, `CoimDrawer`, `CoimBackdrop`, `CoimSearchDialog`, and `CoimThemeConfiguration`.
- Updated `CoimSearchDialog` (`900px` desktop width, outlined `rounded-md` filter tabs, scroll-safe footer) and `CoimNotificationsMenu` (`20px` unread badge, outlined filter tabs).
- Upgraded `CoimListingPageContent` with a full-width soft surface filter input and alternating primary/secondary `h-24 w-16 rounded-2xl` icon panels.

### Components, Charts, DataGrid, Date Pickers & Plugins
- Fixed outlined `CoimButton` and `CoimIconButton` border-compensated padding helpers so `outlined` and `contained` variants share exact pixel heights (`28px` / `32px` / `36px` / `40px`).
- Removed `overflow: hidden` from `.coim-card` so dropdowns, tooltips, and chart annotations inside cards are never clipped.
- Aligned `.coim-typography-*` heading, subtitle, and caption line-heights for consistent vertical rhythm.
- Updated chart components (`CoimBarChart`, `CoimPieChart`, `CoimAreaChart`, `CoimScatterChart`, `CoimSparklineChart`, `CoimRadarChart`, `CoimFunnelChart`) and `charts.css` to render translucent pastel fills with crisp `2px` series strokes while keeping contrast-safe funnel text labels in light and dark themes.
- Refined `data-grid.css` for seamless borderless presentation inside card containers with clean header dividers and subtle hover rows.
- Unified `CoimDateTimePicker` and `CoimTimePicker` popup triggers inside `.coim-date-input` (`endAdornment` support on `CoimDateField` and `CoimTimeField`) and softened calendar navigation button borders.
- Refined `plugins.css` with soft surface Quill editor styling, dark-mode editor toolbar contrast rules, rounded event chips, and circular day-grid today indicators.

## [1.0.0] - 2026-04-20

### Initial Release
- Released `@coimui/svelte` 1.0.0 with Svelte 5 core UI components, dual-layer navigation shell, 4 accessible color themes (`purple`, `blue`, `green`, `orange`), LTR/RTL support, TanStack Table v9 DataGrid, 10 SVG chart families, ISO date/time pickers, and specialized plugin integrations.
