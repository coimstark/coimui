# CoimUI Component Catalog

## Core Entrypoint (`@coimui/svelte`)

### Foundation (2)
- `CoimTypography`, `CoimDivider`

### Layout Primitives (8)
- `CoimBox`, `CoimContainer`, `CoimGrid`, `CoimStack`, `CoimImageList`, `CoimImageListItem`, `CoimImageListItemBar`, `CoimMasonry`

### Surfaces (13)
- `CoimPaper`, `CoimSurface`
- `CoimCard`, `CoimCardHeader`, `CoimCardMedia`, `CoimCardContent`, `CoimCardActions`, `CoimCardActionArea`
- `CoimAccordionGroup`, `CoimAccordion`, `CoimAccordionSummary`, `CoimAccordionDetails`, `CoimAccordionActions`

### Inputs & Form Controls (27)
- Actions: `CoimButton`, `CoimIconButton`, `CoimButtonGroup`, `CoimFab`, `CoimToggleButtonGroup`, `CoimToggleButton`
- Form Scaffolding: `CoimFormControl`, `CoimFormLabel`, `CoimFormGroup`, `CoimFormControlLabel`, `CoimFormHelperText`, `CoimInputAdornment`
- Text & Numeric: `CoimInput`, `CoimTextField`, `CoimTextareaAutosize`, `CoimNumberField`, `CoimNumberSpinner`
- Selection & Specialized: `CoimSelect`, `CoimAutocomplete`, `CoimCheckbox`, `CoimRadioGroup`, `CoimRadio`, `CoimSwitch`, `CoimSlider`, `CoimRating`, `CoimOtpInput`, `CoimDropzone`

### Data Display (32)
- Identity & Tags: `CoimAvatar`, `CoimAvatarGroup`, `CoimBadge`, `CoimChip`, `CoimTooltipProvider`, `CoimTooltip`
- Lists: `CoimList`, `CoimListSubheader`, `CoimListItem`, `CoimListItemButton`, `CoimListItemIcon`, `CoimListItemAvatar`, `CoimListItemText`
- Tables: `CoimTableContainer`, `CoimTable`, `CoimTableHead`, `CoimTableBody`, `CoimTableFooter`, `CoimTableRow`, `CoimTableCell`, `CoimTableSortLabel`, `CoimTablePagination`
- Timelines: `CoimTimeline`, `CoimTimelineItem`, `CoimTimelineSeparator`, `CoimTimelineDot`, `CoimTimelineConnector`, `CoimTimelineOppositeContent`, `CoimTimelineContent`
- Trees: `CoimSimpleTreeView`, `CoimRichTreeView`, `CoimTreeItem`

### Navigation (20)
- `CoimLink`, `CoimBreadcrumbs`, `CoimBottomNavigation`, `CoimBottomNavigationAction`, `CoimPagination`
- `CoimSpeedDial`, `CoimSpeedDialAction`, `CoimStepper`, `CoimStep`, `CoimStepLabel`, `CoimStepContent`, `CoimMobileStepper`
- `CoimTabs`, `CoimTab`, `CoimTabPanel`, `CoimMenu`, `CoimMenuItem`, `CoimMenuDivider`, `CoimMenubar`, `CoimToolbar`

### Feedback & Overlays (18)
- `CoimAlert`, `CoimAlertTitle`, `CoimBackdrop`, `CoimCircularProgress`, `CoimLinearProgress`, `CoimSkeleton`
- `CoimDialog`, `CoimDialogTitle`, `CoimDialogContent`, `CoimDialogContentText`, `CoimDialogActions`, `CoimConfirmDialog`
- `CoimDrawer`, `CoimModal`, `CoimPopover`, `CoimPopper`, `CoimSnackbar`, `CoimToastProvider` (+ `ToastState` / `toast` store)

### Application Shell & Layouts (21)
- `CoimAppShell`, `CoimAuthLayout`, `CoimHeader`, `CoimFooter`, `CoimMain`, `CoimLeftMenu`, `CoimPrimaryItem`, `CoimSecondaryItem`, `CoimMenuBackdrop`
- `CoimContentWrapper`, `CoimBackgroundWrapper`, `CoimTitleWrapper`, `CoimListingPageContent`, `CoimLogo`, `CoimModeToggle`, `CoimSearchDialog`
- `CoimNotificationsMenu`, `CoimShortcutsMenu`, `CoimUserMenu`, `CoimThemeConfiguration`, `CoimVersionSelect`

### Theme, Forms, Utilities & Icons
- Theme: `CoimThemeProvider`, `ThemeState`, `getThemeContext`, `setThemeContext`, `tryGetThemeContext`, `THEME_OPTIONS`
- Forms: `createZodValidator`
- Utilities: `CoimPortal`, `CoimClickAwayListener`, `clickAway`, `CoimCollapse`, `CoimFade`, `CoimGrow`, `CoimSlide`, `CoimZoom`, `cn`
- Icons (`@coimui/svelte/icons`): `CoimIcon`, `IconMap`, **469** UI icon components (`Ci*` including `CiCoimMark`), **14** form control SVGs, and **16** SVG illustrations (`Illustration*`)

## Optional Feature Subpaths

| Subpath | Exported Components & Utilities |
|---|---|
| `@coimui/svelte/data-grid` | `CoimDataGrid`, `CoimDataGridToolbar`, `buildCsvContent`, `downloadCsvExport`, `exportDataGridToExcel`, `printDataGrid` |
| `@coimui/svelte/charts` | `CoimAreaChart`, `CoimBarChart`, `CoimChartLegend`, `CoimFunnelChart`, `CoimGaugeChart`, `CoimHeatmapChart`, `CoimLineChart`, `CoimPieChart`, `CoimRadarChart`, `CoimScatterChart`, `CoimSparklineChart`, `COIM_CHART_PALETTE`, `getChartColor` |
| `@coimui/svelte/date-pickers` | `CoimCalendar`, `CoimRangeCalendar`, `CoimDateField`, `CoimTimeField`, `CoimDatePicker`, `CoimDateRangePicker`, `CoimTimePicker`, `CoimDateTimePicker`, `CoimStaticDatePicker`, `CalendarDate`, `CalendarDateTime`, `Time`, `today`, `getLocalTimeZone`, `formatDateWithDayjs`, `getPresetDateRanges`, `parseIsoDateValue`, `parseIsoTimeValue` |
| `@coimui/svelte/plugins` | `CoimCarousel`, `CoimCodeBlock`, `CoimEmojiPicker`, `CoimEventCalendar`, `CoimLightbox`, `CoimMarkdown`, `CoimRichTextEditor`, `CoimSortableList`, `CoimVideoPlayer`, `printElement` |
