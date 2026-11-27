export interface ComponentDirectoryEntry {
  name: string;
  category:
    | "Foundation & Layout"
    | "Surfaces"
    | "Inputs & Controls"
    | "Data Display"
    | "Navigation"
    | "Feedback & Overlays"
    | "Icons & Theme"
    | "Layouts & Shell"
    | "Utilities & Transitions"
    | "Data Grid"
    | "Charts"
    | "Date & Time Pickers"
    | "Plugins";
  subpath:
    | "@coimui/svelte"
    | "@coimui/svelte/data-grid"
    | "@coimui/svelte/charts"
    | "@coimui/svelte/date-pickers"
    | "@coimui/svelte/plugins";
  href: string;
  summary: string;
}

export const COMPONENT_DIRECTORY: ComponentDirectoryEntry[] = [
  // Foundation & Layout (10)
  { name: "CoimTypography", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-typography", summary: "Urbanist headings, Mulish body scale, ellipsis clamping" },
  { name: "CoimDivider", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-typography", summary: "Horizontal or vertical section divider with optional label" },
  { name: "CoimBox", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-layout-grid", summary: "Polymorphic layout container supporting Tailwind utility classes" },
  { name: "CoimContainer", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-layout-grid", summary: "Centered max-width container with responsive gutters" },
  { name: "CoimGrid", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-layout-grid", summary: "Responsive 12-column container and breakpoint span items" },
  { name: "CoimStack", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-layout-grid", summary: "Flexbox vertical/horizontal spacing stack with optional dividers" },
  { name: "CoimImageList", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-media-grid", summary: "Multi-column grid of responsive media tiles" },
  { name: "CoimImageListItem", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-media-grid", summary: "Individual media item tile inside CoimImageList" },
  { name: "CoimImageListItemBar", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-media-grid", summary: "Title/subtitle caption overlay or footer bar for media tiles" },
  { name: "CoimMasonry", category: "Foundation & Layout", subpath: "@coimui/svelte", href: "/components/foundation#coim-media-grid", summary: "Balanced CSS columns masonry grid across responsive breakpoints" },

  // Surfaces (13)
  { name: "CoimPaper", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-paper", summary: "Elevated or outlined surface container (elevation 0-6)" },
  { name: "CoimSurface", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-paper", summary: "Tonal surface variant for subtle content hierarchy" },
  { name: "CoimCard", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Structured content card with shadow or border emphasis" },
  { name: "CoimCardHeader", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Card title, subheader, avatar, and action slots" },
  { name: "CoimCardMedia", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Responsive image/video media banner inside CoimCard" },
  { name: "CoimCardContent", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Padded card body container" },
  { name: "CoimCardActions", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Aligned card footer action strip" },
  { name: "CoimCardActionArea", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-card", summary: "Keyboard-accessible clickable card region" },
  { name: "CoimAccordionGroup", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-accordion", summary: "Single or multiple disclosure group powered by Bits UI" },
  { name: "CoimAccordion", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-accordion", summary: "Expandable accordion panel" },
  { name: "CoimAccordionSummary", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-accordion", summary: "Accessible heading trigger for CoimAccordion" },
  { name: "CoimAccordionDetails", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-accordion", summary: "Collapsible accordion content body" },
  { name: "CoimAccordionActions", category: "Surfaces", subpath: "@coimui/svelte", href: "/components/surfaces#coim-accordion", summary: "Accordion footer action row" },

  // Inputs & Controls (27)
  { name: "CoimButton", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Contained, outlined, pastel, surface, text & loading buttons" },
  { name: "CoimIconButton", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Compact icon trigger button" },
  { name: "CoimButtonGroup", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Segmented group of connected action buttons" },
  { name: "CoimFab", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Floating action button with circular/extended sizing" },
  { name: "CoimToggleButtonGroup", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Roving-focus exclusive or multi-select toggle group" },
  { name: "CoimToggleButton", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-button", summary: "Toggle option button inside CoimToggleButtonGroup" },
  { name: "CoimTextField", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-text-field", summary: "Labeled text field with adornments, validation & masks" },
  { name: "CoimNumberField", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-text-field", summary: "Numeric input field with min/max/step bounds" },
  { name: "CoimSelect", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-text-field", summary: "Single or multi-select dropdown powered by Bits UI" },
  { name: "CoimAutocomplete", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-text-field", summary: "Searchable combobox with optional freeSolo text entry" },
  { name: "CoimCheckbox", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Checked, unchecked, and indeterminate checkbox" },
  { name: "CoimRadioGroup", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Accessible radio selection container" },
  { name: "CoimRadio", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Individual radio option control" },
  { name: "CoimSwitch", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Toggle switch with optional label binding" },
  { name: "CoimSlider", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Continuous/discrete range slider with value tooltip" },
  { name: "CoimRating", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Star rating widget supporting half-step precision" },
  { name: "CoimOtpInput", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Multi-digit verification code input with paste support" },
  { name: "CoimDropzone", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Drag-and-drop file selector with maxFiles & validation" },
  { name: "CoimFormControlLabel", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-selection", summary: "Aligns label text with Checkbox, Radio, or Switch" },
  { name: "CoimInput", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Low-level base input primitive with variants, masks & adornments" },
  { name: "CoimInputAdornment", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Start/end prefix or suffix slot wrapper inside inputs" },
  { name: "CoimNumberSpinner", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Compact numeric stepper with increment/decrement triggers" },
  { name: "CoimTextareaAutosize", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Auto-growing textarea constrained by minRows and maxRows" },
  { name: "CoimFormControl", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Shared form field state context (error, disabled, required, size)" },
  { name: "CoimFormGroup", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Fieldset wrapper grouping checkboxes or switches with legend" },
  { name: "CoimFormLabel", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Accessible label/legend synced with CoimFormControl error state" },
  { name: "CoimFormHelperText", category: "Inputs & Controls", subpath: "@coimui/svelte", href: "/components/inputs#coim-input-primitives", summary: "Field hint or validation message rendered below controls" },

  // Data Display (32)
  { name: "CoimAvatar", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Circular user avatar supporting images, initials & semantic colors" },
  { name: "CoimAvatarGroup", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Overlapping avatar stack with configurable max overflow pill" },
  { name: "CoimBadge", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Numeric or dot status indicator anchored to any element" },
  { name: "CoimChip", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Compact tag/pill with filled, outlined, pastel & deletable modes" },
  { name: "CoimTooltip", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Accessible hover/focus tooltip anchored to trigger elements" },
  { name: "CoimTooltipProvider", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-badge-chip", summary: "Shared delay & portal provider for descendant tooltips" },
  { name: "CoimTableContainer", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Horizontal scroll container wrapping CoimTable" },
  { name: "CoimTable", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Semantic HTML table with compact or comfortable density" },
  { name: "CoimTableHead", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Table header section" },
  { name: "CoimTableBody", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Table body section" },
  { name: "CoimTableFooter", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Semantic table footer section for column summaries" },
  { name: "CoimTableRow", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Table row with optional hover and selected states" },
  { name: "CoimTableCell", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Header, body, or footer table cell with alignment" },
  { name: "CoimTableSortLabel", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Interactive sort button and direction indicator for headers" },
  { name: "CoimTablePagination", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Page and rows-per-page footer controls for CoimTable" },
  { name: "CoimList", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Vertical list container" },
  { name: "CoimListSubheader", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Sticky or inline section header inside CoimList" },
  { name: "CoimListItem", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Static list row container" },
  { name: "CoimListItemButton", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Interactive clickable list row" },
  { name: "CoimListItemIcon", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Leading icon slot inside list rows" },
  { name: "CoimListItemAvatar", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Leading avatar container aligned cleanly in CoimListItem" },
  { name: "CoimListItemText", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Primary and secondary text lines inside list items" },
  { name: "CoimSimpleTreeView", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Declarative expandable tree view with single/multi selection" },
  { name: "CoimTreeItem", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Nested node inside CoimSimpleTreeView" },
  { name: "CoimRichTreeView", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Data-driven tree view with inline editing and reordering" },
  { name: "CoimTimeline", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Chronological event list with left/right/alternate layout" },
  { name: "CoimTimelineItem", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Individual row inside CoimTimeline" },
  { name: "CoimTimelineOppositeContent", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Timestamp or secondary side label opposite timeline content" },
  { name: "CoimTimelineSeparator", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Vertical track holding CoimTimelineDot and CoimTimelineConnector" },
  { name: "CoimTimelineDot", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Status marker dot or icon node on timeline track" },
  { name: "CoimTimelineConnector", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Connecting track segment between timeline dots" },
  { name: "CoimTimelineContent", category: "Data Display", subpath: "@coimui/svelte", href: "/components/data-display#coim-table-tree", summary: "Primary description slot inside CoimTimelineItem" },

  // Navigation (20)
  { name: "CoimTabs", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Horizontal or vertical ARIA tabs with standard, scrollable & fullWidth styles" },
  { name: "CoimTab", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Individual tab trigger inside CoimTabs" },
  { name: "CoimTabPanel", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Panel content associated with a CoimTab value" },
  { name: "CoimMenu", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Accessible dropdown action menu" },
  { name: "CoimMenuItem", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Action item with optional shortcut hint inside CoimMenu" },
  { name: "CoimMenuDivider", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Visual separator between menu item groups" },
  { name: "CoimMenubar", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Desktop application menu bar with keyboard arrow traversal" },
  { name: "CoimToolbar", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Horizontal control strip with roving focus" },
  { name: "CoimLink", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-tabs", summary: "Styled anchor link with underline visibility options" },
  { name: "CoimBreadcrumbs", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Hierarchical navigation trail with maxItems collapsing" },
  { name: "CoimPagination", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Configurable page navigator with first/last & shape variants" },
  { name: "CoimStepper", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Linear or non-linear multi-step progression indicator" },
  { name: "CoimStep", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Individual step wrapper inside CoimStepper" },
  { name: "CoimStepLabel", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Step title with optional subtitle annotation" },
  { name: "CoimStepContent", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Expandable content section within vertical steppers" },
  { name: "CoimMobileStepper", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Compact progress, dot, or text step indicator for narrow screens" },
  { name: "CoimBottomNavigation", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Mobile bottom destination bar" },
  { name: "CoimBottomNavigationAction", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Destination button inside CoimBottomNavigation" },
  { name: "CoimSpeedDial", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Expandable floating quick-action menu" },
  { name: "CoimSpeedDialAction", category: "Navigation", subpath: "@coimui/svelte", href: "/components/navigation#coim-steppers", summary: "Action trigger revealed by CoimSpeedDial" },

  // Feedback & Overlays (18)
  { name: "CoimAlert", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Contextual banner supporting standard/filled/outlined & neutral styles" },
  { name: "CoimAlertTitle", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Bold heading line inside CoimAlert" },
  { name: "CoimDialog", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Top-layer modal dialog with optional dragging & width presets" },
  { name: "CoimDialogTitle", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Accessible dialog title bar" },
  { name: "CoimDialogContent", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Scrollable dialog body wrapper" },
  { name: "CoimDialogContentText", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Styled secondary description text inside dialogs" },
  { name: "CoimDialogActions", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Right-aligned footer action buttons for CoimDialog" },
  { name: "CoimConfirmDialog", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Pre-wired confirmation prompt with severity and async loading" },
  { name: "CoimDrawer", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Edge-anchored slide-over panel (left/right/top/bottom)" },
  { name: "CoimModal", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Low-level portal modal container with backdrop & focus handling" },
  { name: "CoimPopover", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Trigger-anchored interactive popover panel" },
  { name: "CoimBackdrop", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-backdrop-popper", summary: "Fullscreen dimming scrim for busy states and custom overlays" },
  { name: "CoimPopper", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-backdrop-popper", summary: "Lightweight floating element positioned relative to an anchorEl" },
  { name: "CoimSnackbar", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Floating single-message notification with action button" },
  { name: "CoimToastProvider", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-alert", summary: "Global toast queue host controlled via toast.success/info/error" },
  { name: "CoimCircularProgress", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-progress", summary: "Determinate and indeterminate radial spinner" },
  { name: "CoimLinearProgress", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-progress", summary: "Determinate, indeterminate, and buffer progress bar" },
  { name: "CoimSkeleton", category: "Feedback & Overlays", subpath: "@coimui/svelte", href: "/components/feedback#coim-progress", summary: "Animated placeholder silhouette (text/circular/rectangular/rounded)" },

  // Icons & Theme (2)
  { name: "CoimIcon", category: "Icons & Theme", subpath: "@coimui/svelte", href: "/components/icons#coim-icon-api", summary: "Dynamic icon renderer for all 469 Ci* icons with size & variant" },
  { name: "CoimThemeProvider", category: "Icons & Theme", subpath: "@coimui/svelte", href: "/docs/theme/theme-provider", summary: "Root Svelte 5 provider managing palette, mode, direction & elevation" },

  // Layouts & Shell (21)
  { name: "CoimAppShell", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Complete application workspace frame with dual sidebar & topbar" },
  { name: "CoimAuthLayout", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-auth-layout", summary: "Centered authentication flow wrapper for login & signup pages" },
  { name: "CoimHeader", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Top navigation bar orchestrated inside CoimAppShell" },
  { name: "CoimLeftMenu", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Minimal, Comfort, or Single-Layer dual navigation sidebar" },
  { name: "CoimMain", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Primary content region offsetting active header & sidebar widths" },
  { name: "CoimBackgroundWrapper", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Full-bleed themed canvas backdrop layer" },
  { name: "CoimContentWrapper", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Boxed or fluid content width container inside CoimMain" },
  { name: "CoimTitleWrapper", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Header alignment wrapper for page title areas" },
  { name: "CoimMenuBackdrop", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Mobile/temporary drawer dismissal scrim" },
  { name: "CoimPrimaryItem", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Top-level navigation rail tile" },
  { name: "CoimSecondaryItem", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Nested collapsible menu item inside secondary sidebar" },
  { name: "CoimFooter", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Footer bar with navigable and external links" },
  { name: "CoimListingPageContent", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components", summary: "Filterable visual directory grid built from CoimNavItem metadata" },
  { name: "CoimLogo", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Responsive SVG brand mark adapting to desktop and mobile headers" },
  { name: "CoimModeToggle", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Instant Light/Dark color-mode toggle button" },
  { name: "CoimVersionSelect", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Header dropdown switcher for versions or workspaces" },
  { name: "CoimSearchDialog", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Cmd/Ctrl+K command palette with category tabs and search filtering" },
  { name: "CoimNotificationsMenu", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Popover notification center with unread state and inline actions" },
  { name: "CoimShortcutsMenu", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "Quick-access application shortcut grid menu" },
  { name: "CoimUserMenu", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-header-controls", summary: "User profile dropdown with account switch, theme, locale & sign out" },
  { name: "CoimThemeConfiguration", category: "Layouts & Shell", subpath: "@coimui/svelte", href: "/components/layouts#coim-app-shell", summary: "Floating settings drawer for live palette, mode, menu & elevation tuning" },

  // Utilities & Transitions (7)
  { name: "CoimCollapse", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-transitions", summary: "Smooth vertical or horizontal height/width collapse transition" },
  { name: "CoimFade", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-transitions", summary: "Opacity enter/exit transition with optional unmountOnExit" },
  { name: "CoimGrow", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-transitions", summary: "Scale + opacity grow transition for cards and popovers" },
  { name: "CoimSlide", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-transitions", summary: "Directional edge slide transition (up/down/left/right)" },
  { name: "CoimZoom", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-transitions", summary: "Crisp center scale transition" },
  { name: "CoimClickAwayListener", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-click-away", summary: "Detects pointer/touch interactions outside a child DOM subtree" },
  { name: "CoimPortal", category: "Utilities & Transitions", subpath: "@coimui/svelte", href: "/components/utilities#coim-portal", summary: "Teleports child DOM to document.body or custom selector/element" },

  // Data Grid (4)
  { name: "CoimDataGrid", category: "Data Grid", subpath: "@coimui/svelte/data-grid", href: "/data-grid", summary: "Enterprise grid with pinning, filtering, grouping, row editing, pivot, translate i18n & CSV/XLSX" },
  { name: "CoimDataGridToolbar", category: "Data Grid", subpath: "@coimui/svelte/data-grid", href: "/data-grid#coim-datagrid-modular", summary: "Standalone toolbar with search, grouping, density, columns, export & Pivot/AI toggles" },
  { name: "CoimDataGridPivotPanel", category: "Data Grid", subpath: "@coimui/svelte/data-grid", href: "/data-grid#coim-datagrid-modular", summary: "Interactive drag/control field configurator for dynamic pivot tables" },
  { name: "CoimDataGridAiBar", category: "Data Grid", subpath: "@coimui/svelte/data-grid", href: "/data-grid#coim-datagrid-modular", summary: "Provider-agnostic natural-language filter/sort/pivot prompt bar" },

  // Charts (11)
  { name: "CoimBarChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Grouped, stacked & interval range bars powered by LayerChart/D3" },
  { name: "CoimLineChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Multi-series responsive SVG trend line chart" },
  { name: "CoimAreaChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Smooth or stacked area fill trend visualization" },
  { name: "CoimPieChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Pie and donut breakdown chart with interactive series toggling" },
  { name: "CoimScatterChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "XY scatter correlation plot supporting optional dual Y-axis" },
  { name: "CoimRadarChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Polygonal or circular multi-axis capability radar chart" },
  { name: "CoimFunnelChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Stepped or smooth-curve conversion pipeline funnel" },
  { name: "CoimGaugeChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Arc KPI meter with optional needle pointer indicator" },
  { name: "CoimSparklineChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "Compact inline bar, line, or area metric sparkline" },
  { name: "CoimHeatmapChart", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts", summary: "2D density matrix heatmap with color ramp interpolation" },
  { name: "CoimChartLegend", category: "Charts", subpath: "@coimui/svelte/charts", href: "/charts#coim-chart-legend", summary: "Interactive series legend component with toggle visibility support" },

  // Date & Time Pickers (11)
  { name: "CoimCalendar", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Inline ISO single-date calendar" },
  { name: "CoimRangeCalendar", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Inline multi-month date range selection calendar" },
  { name: "CoimDateField", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Keyboard-segmented ISO date input field" },
  { name: "CoimTimeField", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Keyboard-segmented 12h/24h time input field" },
  { name: "CoimDatePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Clearable input paired with popover calendar" },
  { name: "CoimDateRangePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Start/end date picker with optional quick preset ranges" },
  { name: "CoimTimePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Digital column picker or interactive analog clock face" },
  { name: "CoimTimeRangePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Coordinated start and end time selection control" },
  { name: "CoimDateTimePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Combined date and time picker for scheduling timestamps" },
  { name: "CoimDateTimeRangePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Coordinated date-time range window selector" },
  { name: "CoimStaticDatePicker", category: "Date & Time Pickers", subpath: "@coimui/svelte/date-pickers", href: "/date-pickers", summary: "Always-open static calendar card" },

  // Plugins (9)
  { name: "CoimCodeBlock", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Syntax-highlighted code block with line numbers and clipboard copy" },
  { name: "CoimMarkdown", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "DOMPurify-sanitized Marked markdown renderer" },
  { name: "CoimRichTextEditor", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Client-guarded Quill v2 rich text editor (snow/bubble themes)" },
  { name: "CoimCarousel", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Accessible responsive slider backed by Swiper" },
  { name: "CoimLightbox", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Zoomable PhotoSwipe image gallery with captions & download" },
  { name: "CoimEmojiPicker", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Client-guarded emoji-picker-element wrapper" },
  { name: "CoimVideoPlayer", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Styled HTML5 video player backed by @videojs/html" },
  { name: "CoimSortableList", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Reorderable list powered by Pragmatic Drag & Drop + keyboard moves" },
  { name: "CoimEventCalendar", category: "Plugins", subpath: "@coimui/svelte/plugins", href: "/plugins", summary: "Full interactive schedule calendar backed by @event-calendar/core" },
];
