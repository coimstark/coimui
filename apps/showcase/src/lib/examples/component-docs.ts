const END_SCRIPT = "</" + "script>";

export const COMPONENT_CODE_EXAMPLES = {
  typography: `<script lang="ts">
  import { CoimTypography, CoimDivider } from "@coimui/svelte";
${END_SCRIPT}

<CoimTypography variant="h2">Headline Display</CoimTypography>
<CoimTypography variant="body1">Primary prose scale with Urbanist display headings.</CoimTypography>
<CoimDivider />
<CoimTypography variant="caption">Caption metadata</CoimTypography>`,

  gridAndStack: `<script lang="ts">
  import { CoimGrid, CoimStack, CoimPaper } from "@coimui/svelte";
${END_SCRIPT}

<CoimGrid container spacing={4}>
  <CoimGrid size={{ xs: 12, md: 6 }}>
    <CoimPaper class="p-4">Responsive Half</CoimPaper>
  </CoimGrid>
  <CoimGrid size={{ xs: 12, md: 6 }}>
    <CoimStack direction="row" spacing={2}>
      <CoimPaper class="p-3">Item A</CoimPaper>
      <CoimPaper class="p-3">Item B</CoimPaper>
    </CoimStack>
  </CoimGrid>
</CoimGrid>`,

  imageListAndMasonry: `<script lang="ts">
  import { CoimImageList, CoimImageListItem, CoimImageListItemBar, CoimMasonry } from "@coimui/svelte";
${END_SCRIPT}

<CoimImageList cols={2} gap={12}>
  <CoimImageListItem>
    <img src="/images/products/product-1.jpg" alt="Studio monitor kit" />
    <CoimImageListItemBar title="Studio Monitor Kit" subtitle="Hardware" />
  </CoimImageListItem>
</CoimImageList>

<CoimMasonry columns={{ xs: 1, md: 3 }} spacing={2}>
  <!-- Variable-height tiles flow into balanced CSS columns -->
</CoimMasonry>`,

  paperAndSurface: `<script lang="ts">
  import { CoimPaper, CoimSurface } from "@coimui/svelte";
${END_SCRIPT}

<CoimPaper elevation={2} class="p-5">Elevated container</CoimPaper>
<CoimPaper variant="outlined" class="p-5">Outlined container</CoimPaper>
<CoimSurface elevation={1} class="p-5">Soft tonal surface</CoimSurface>`,

  card: `<script lang="ts">
  import {
    CoimCard,
    CoimCardHeader,
    CoimCardMedia,
    CoimCardContent,
    CoimCardActions,
    CoimButton,
  } from "@coimui/svelte";
${END_SCRIPT}

<CoimCard>
  <CoimCardHeader title="Acoustic Desk Lamp" subheader="Industrial Design" />
  <CoimCardMedia image="/images/products/product-2.jpg" alt="Desk lamp" class="h-44" />
  <CoimCardContent>Precision anodized aluminum housing with rotary dimmer.</CoimCardContent>
  <CoimCardActions>
    <CoimButton variant="text">Bookmark</CoimButton>
    <CoimButton variant="contained">Inspect</CoimButton>
  </CoimCardActions>
</CoimCard>`,

  accordion: `<script lang="ts">
  import {
    CoimAccordionGroup,
    CoimAccordion,
    CoimAccordionSummary,
    CoimAccordionDetails,
  } from "@coimui/svelte";
${END_SCRIPT}

<CoimAccordionGroup variant="default">
  <CoimAccordion defaultExpanded>
    <CoimAccordionSummary>Built-in keyboard accessibility</CoimAccordionSummary>
    <CoimAccordionDetails>Uses Bits UI disclosure triggers and smooth transitions.</CoimAccordionDetails>
  </CoimAccordion>
</CoimAccordionGroup>`,

  buttons: `<script lang="ts">
  import { CoimButton, CoimIconButton, CoimButtonGroup, CoimFab, CoimToggleButtonGroup, CoimToggleButton } from "@coimui/svelte";
  import { CiPlus, CiPen } from "@coimui/svelte/icons";
${END_SCRIPT}

<CoimButton variant="contained" color="primary">Save Changes</CoimButton>
<CoimButton variant="outlined" color="secondary">Preview</CoimButton>
<CoimIconButton aria-label="Edit item"><CiPen /></CoimIconButton>
<CoimButtonGroup variant="outlined">
  <CoimButton>Day</CoimButton>
  <CoimButton>Week</CoimButton>
</CoimButtonGroup>
<CoimFab color="primary" aria-label="Add record"><CiPlus /></CoimFab>`,

  textAndSelectInputs: `<script lang="ts">
  import { CoimTextField, CoimNumberField, CoimSelect, CoimAutocomplete } from "@coimui/svelte";
  let title = $state("Quarterly Report");
  let qty = $state<number | null>(12);
  let tier = $state("pro");
  let owner = $state<string | null>("eng");
${END_SCRIPT}

<CoimTextField label="Document Title" bind:value={title} required fullWidth />
<CoimNumberField label="Seat Count" bind:value={qty} min={1} max={500} />
<CoimSelect label="Plan Tier" bind:value={tier} options={[{ value: "pro", label: "Pro" }]} />
<CoimAutocomplete label="Department" bind:value={owner} options={[{ value: "eng", label: "Engineering" }]} />`,

  selectionAndAdvancedInputs: `<script lang="ts">
  import { CoimCheckbox, CoimRadioGroup, CoimRadio, CoimSwitch, CoimSlider, CoimRating, CoimOtpInput, CoimDropzone } from "@coimui/svelte";
  let accepted = $state(true);
  let channel = $state("email");
  let volume = $state(65);
  let score = $state<number | null>(4);
  let otp = $state("482910");
${END_SCRIPT}

<CoimCheckbox label="Enable notifications" bind:checked={accepted} />
<CoimRadioGroup label="Alert channel" bind:value={channel}>
  <CoimRadio value="email" label="Email" />
  <CoimRadio value="sms" label="SMS" />
</CoimRadioGroup>
<CoimSwitch label="Auto-archive" checked />
<CoimSlider aria-label="Budget cap" bind:value={volume} />
<CoimRating aria-label="Release quality" bind:value={score} />
<CoimOtpInput bind:value={otp} length={6} />`,

  avatarsAndChips: `<script lang="ts">
  import { CoimAvatar, CoimAvatarGroup, CoimBadge, CoimChip, CoimTooltip, CoimTooltipProvider, type CoimAvatarItem } from "@coimui/svelte";
  const avatars: CoimAvatarItem[] = [
    { id: "1", initials: "LE", alt: "Laura Ellis" },
    { id: "2", initials: "MK", alt: "Mateo Khan" },
    { id: "3", initials: "SR", alt: "Sora Park" },
    { id: "4", initials: "AL", alt: "Ari Lindqvist" },
  ];
${END_SCRIPT}

<CoimTooltipProvider>
  <CoimAvatarGroup {avatars} max={3} />
  <CoimBadge badgeContent={14} max={9} color="error">
    <CoimChip label="Inbox" deletable variant="pastel" color="primary" />
  </CoimBadge>
  <CoimTooltip title="Active queue"><CoimAvatar initials="CU" alt="Coim User" /></CoimTooltip>
</CoimTooltipProvider>`,

  tablesListsTrees: `<script lang="ts">
  import { CoimTableContainer, CoimTable, CoimTableHead, CoimTableRow, CoimTableCell, CoimTableBody, CoimSimpleTreeView, CoimTreeItem, CoimTimeline, CoimTimelineItem, CoimTimelineSeparator, CoimTimelineDot, CoimTimelineConnector, CoimTimelineContent } from "@coimui/svelte";
${END_SCRIPT}

<CoimSimpleTreeView defaultExpandedItems={["workspace"]}>
  <CoimTreeItem itemId="workspace" label="Workspace">
    <CoimTreeItem itemId="routes" label="Routes" />
    <CoimTreeItem itemId="styles" label="Styles" />
  </CoimTreeItem>
</CoimSimpleTreeView>`,

  tabsAndMenus: `<script lang="ts">
  import { CoimTabs, CoimTab, CoimTabPanel, CoimMenu, CoimMenuItem, CoimToolbar, CoimButton } from "@coimui/svelte";
  let tab = $state("overview");
${END_SCRIPT}

<CoimTabs bind:value={tab} hairline>
  {#snippet tabs()}
    <CoimTab value="overview" label="Overview" />
    <CoimTab value="audit" label="Audit" />
  {/snippet}
  <CoimTabPanel value="overview">Overview details</CoimTabPanel>
  <CoimTabPanel value="audit">Audit trail</CoimTabPanel>
</CoimTabs>`,

  steppersAndPagination: `<script lang="ts">
  import { CoimPagination, CoimStepper, CoimStep, CoimStepLabel, CoimBreadcrumbs, CoimSpeedDial, CoimSpeedDialAction } from "@coimui/svelte";
  let page = $state(2);
  let activeStep = $state(1);
${END_SCRIPT}

<CoimPagination count={8} bind:page />
<CoimStepper bind:activeStep nonLinear>
  <CoimStep><CoimStepLabel>Details</CoimStepLabel></CoimStep>
  <CoimStep><CoimStepLabel>Review</CoimStepLabel></CoimStep>
  <CoimStep><CoimStepLabel>Publish</CoimStepLabel></CoimStep>
</CoimStepper>`,

  alertsAndDialogs: `<script lang="ts">
  import { CoimAlert, CoimAlertTitle, CoimDialog, CoimDialogTitle, CoimDialogContent, CoimDialogActions, CoimButton, toast } from "@coimui/svelte";
  let open = $state(false);
${END_SCRIPT}

<CoimAlert severity="info">
  <CoimAlertTitle>Release Ready</CoimAlertTitle>
  All verification gates completed cleanly.
</CoimAlert>

<CoimButton variant="contained" onclick={() => (open = true)}>Open Dialog</CoimButton>
<CoimDialog bind:open aria-labelledby="dlg-title">
  <CoimDialogTitle id="dlg-title">Publish Artifact</CoimDialogTitle>
  <CoimDialogContent>Confirm publication to package registry.</CoimDialogContent>
  <CoimDialogActions>
    <CoimButton onclick={() => (open = false)}>Cancel</CoimButton>
    <CoimButton variant="contained" onclick={() => { open = false; toast.success("Published"); }}>Publish</CoimButton>
  </CoimDialogActions>
</CoimDialog>`,

  progressAndFeedback: `<script lang="ts">
  import { CoimCircularProgress, CoimLinearProgress, CoimSkeleton, CoimSnackbar } from "@coimui/svelte";
${END_SCRIPT}

<CoimCircularProgress variant="determinate" value={72} label="72%" />
<CoimLinearProgress variant="determinate" value={64} />
<CoimSkeleton variant="rectangular" height={48} />`,

  dataGrid: `<script lang="ts">
  import { CoimDataGrid, type CoimDataGridColumn } from "@coimui/svelte/data-grid";
  const columns: CoimDataGridColumn<any>[] = [
    { id: "id", field: "id", headerName: "ID", width: 100 },
    { id: "account", field: "account", headerName: "Account", width: 200, editable: true },
  ];
  const t = (key: string) => key;
${END_SCRIPT}

<CoimDataGrid {rows} {columns} translate={t} checkboxSelection showColumnFilters />`,

  charts: `<script lang="ts">
  import { CoimBarChart, CoimLineChart, CoimPieChart } from "@coimui/svelte/charts";
${END_SCRIPT}

<CoimBarChart
  data={quarterly}
  xKey="quarter"
  series={[
    { key: "revenue", label: "Revenue" },
    { key: "target", label: "Target" },
  ]}
/>`,

  datePickers: `<script lang="ts">
  import { CalendarDate, CoimDatePicker, CoimDateRangePicker, CoimTimePicker } from "@coimui/svelte/date-pickers";
  let date = $state(new CalendarDate(2026, 11, 22));
${END_SCRIPT}

<CoimDatePicker label="Release Date" bind:value={date} />`,

  plugins: `<script lang="ts">
  import { CoimRichTextEditor, CoimCarousel, CoimMarkdown, CoimSortableList } from "@coimui/svelte/plugins";
${END_SCRIPT}

<CoimMarkdown content={"## Release Summary\n- Tree-shakeable subpath exports"} />`,
} as const;
