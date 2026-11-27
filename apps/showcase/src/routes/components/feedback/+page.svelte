<script lang="ts">
  import {
    CoimAlert,
    CoimAlertTitle,
    CoimBackdrop,
    CoimBreadcrumbs,
    CoimButton,
    CoimCircularProgress,
    CoimConfirmDialog,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogContentText,
    CoimDialogTitle,
    CoimDrawer,
    CoimFormControlLabel,
    CoimGrid,
    CoimLinearProgress,
    CoimModal,
    CoimPaper,
    CoimPopover,
    CoimPopper,
    CoimSelect,
    CoimSkeleton,
    CoimSlider,
    CoimSnackbar,
    CoimStack,
    CoimSwitch,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const END_SCRIPT = "</" + "script>";

  let dialogOpen = $state(false);
  let confirmOpen = $state(false);
  let drawerOpen = $state(false);
  let modalOpen = $state(false);
  let popoverOpen = $state(false);
  let snackbarOpen = $state(false);

  // Alert interactive controls
  let alertSeverity = $state<"success" | "info" | "warning" | "error">("success");
  let alertVariant = $state<"standard" | "filled" | "outlined">("standard");
  let alertNeutral = $state(false);

  const alertInteractiveCode = $derived(`<script lang="ts">
  import { CoimAlert, CoimAlertTitle } from "@coimui/svelte";
${END_SCRIPT}

<CoimAlert severity="${alertSeverity}" variant="${alertVariant}"${alertNeutral ? " neutral" : ""}>
  <CoimAlertTitle>Verification Complete</CoimAlertTitle>
  All contract and bundle isolation assertions passed.
</CoimAlert>`);

  // Progress interactive controls
  let progressColor = $state<"primary" | "secondary" | "success" | "warning" | "error" | "info">("primary");
  let progressValue = $state(72);

  const progressCode = $derived(`<script lang="ts">
  import { CoimCircularProgress, CoimLinearProgress, CoimSkeleton } from "@coimui/svelte";
${END_SCRIPT}

<CoimCircularProgress variant="determinate" value={${progressValue}} color="${progressColor}" label="${progressValue}% Complete" />
<CoimLinearProgress variant="determinate" value={${progressValue}} color="${progressColor}" label="${progressValue}% uploaded" />
<CoimSkeleton variant="rounded" height={64} />`);

  // Backdrop & Popper state
  let backdropOpen = $state(false);
  let popperOpen = $state(false);
  let popperPlacement = $state<"top" | "bottom" | "left" | "right">("bottom");
  let popperAnchor = $state<HTMLElement | null>(null);

  const backdropPopperCode = $derived(`<script lang="ts">
  import { CoimBackdrop, CoimButton, CoimPaper, CoimPopper, CoimCircularProgress } from "@coimui/svelte";
  let backdropOpen = $state(false);
  let popperOpen = $state(false);
  let anchorEl = $state<HTMLElement | null>(null);
${END_SCRIPT}

<CoimButton variant="outlined" onclick={() => (backdropOpen = true)}>Show Backdrop</CoimButton>
<span bind:this={anchorEl} class="inline-block">
  <CoimButton variant="contained" onclick={() => (popperOpen = !popperOpen)}>Toggle Popper</CoimButton>
</span>

<CoimPopper open={popperOpen} {anchorEl} placement="${popperPlacement}" offset={8}>
  <CoimPaper elevation={4} class="p-3 text-sm">Anchored Popper (${popperPlacement})</CoimPaper>
</CoimPopper>

<CoimBackdrop open={backdropOpen} onclick={() => (backdropOpen = false)}>
  <CoimCircularProgress variant="indeterminate" color="primary" />
</CoimBackdrop>`);

  const feedbackApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimAlert & CoimSnackbar & CoimToastProvider",
      props: [
        { name: "CoimAlert.severity / variant", type: "\"success\" | \"info\" | \"warning\" | \"error\" / \"standard\" | \"filled\" | \"outlined\"", description: "Semantic status tone and surface styling (plus neutral boolean)." },
        { name: "CoimSnackbar", type: "open?, title?, message?, variant?, autoHideDuration?, actionLabel?", kind: "bindable", description: "Single inline or portal notification banner." },
        { name: "CoimToastProvider + toast", type: "maxStack?, autoHideDuration?, anchorOrigin?", description: "Mount once in +layout.svelte, then invoke toast.success/info/warning/error()." },
      ],
    },
    {
      title: "CoimDialog, CoimConfirmDialog, CoimDrawer, CoimModal & CoimPopover",
      props: [
        { name: "CoimDialog.open", type: "boolean", defaultValue: "false", kind: "bindable", description: "Native modal dialog with maxWidth, fullScreen, scroll, and draggable." },
        { name: "CoimConfirmDialog.onConfirm", type: "() => void | Promise<void>", kind: "event", description: "Confirms destructive/important actions with built-in loading support." },
        { name: "CoimDrawer.anchor", type: "\"left\" | \"right\" | \"top\" | \"bottom\"", defaultValue: "\"left\"", description: "Edge panel with focus restoration and backdrop dismissal." },
        { name: "CoimModal / CoimPopover", type: "open?, keepMounted?, disablePortal? / trigger snippet, openOnHover?", description: "Low-level modal backdrop portal and floating popover primitive." },
      ],
    },
  ];

  const backdropPopperProps = [
    { name: "CoimBackdrop.open / invisible", type: "boolean / boolean", defaultValue: "false / false", description: "Shows full-viewport scrim (or transparent click-catcher when invisible)." },
    { name: "CoimBackdrop.onclick", type: "(event: MouseEvent) => void", kind: "event" as const, description: "Handles scrim dismissal clicks." },
    { name: "CoimPopper.open / anchorEl", type: "boolean / HTMLElement | PopperVirtualElement | null", description: "Anchors floating content directly against a DOM or virtual coordinate box." },
    { name: "CoimPopper.placement / offset", type: "PopperPlacement / number", defaultValue: "\"bottom\" / 6", description: "Popper alignment relative to anchorEl." },
  ];

  const progressProps = [
    { name: "variant (Circular / Linear)", type: "\"determinate\" | \"indeterminate\" | \"buffer\"", defaultValue: "\"determinate\" (with value) / \"indeterminate\"", description: "Determinate percent display or continuous activity animation." },
    { name: "value / valueBuffer", type: "number (0-100)", defaultValue: "0", description: "Current completion percentage (and buffer bar on LinearProgress)." },
    { name: "color", type: "\"primary\" | \"secondary\" | \"success\" | \"error\" | \"warning\" | \"info\"", defaultValue: "\"primary\"", description: "Progress indicator color token." },
    { name: "CoimSkeleton", type: "variant?: \"text\" | \"circular\" | \"rectangular\" | \"rounded\", width?, height?, animation?", description: "Animated loading placeholder silhouette." },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Feedback &amp; Overlays</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Feedback & Overlays" }]} />
    <CoimTypography variant="h1" class="mt-2">Feedback &amp; Overlays</CoimTypography>
    <p class="text-text-secondary mt-1">
      Alerts, native modal dialogs, confirmation prompts, side drawers, popovers, poppers, backdrops, inline progress meters, skeletons, and live toast queues.
    </p>
  </div>

  <CoimTypography variant="h2">Alerts, Dialogs, Drawers &amp; Progress Indicators</CoimTypography>

  <ComponentDocCard
    id="coim-alert"
    title="Alerts, Dialogs, ConfirmDialog, Drawer, Modal &amp; Popover"
    description="Built on native top-layer <dialog> semantics where appropriate and accessible focus restoration."
    code={`${alertInteractiveCode}\n\n${COMPONENT_CODE_EXAMPLES.alertsAndDialogs}`}
    apiGroups={feedbackApiGroups}
  >
    <CoimStack spacing={4}>
      <CoimGrid container spacing={3}>
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimAlert severity={alertSeverity} variant={alertVariant} neutral={alertNeutral}>
            <CoimAlertTitle>Verification Status ({alertSeverity})</CoimAlertTitle>
            All contract and bundle isolation assertions passed cleanly.
          </CoimAlert>
        </CoimGrid>
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimAlert severity="warning" variant="outlined">
            <CoimAlertTitle>Staging Preview</CoimAlertTitle>
            Sample data shown in this view does not mutate persistent records.
          </CoimAlert>
        </CoimGrid>
      </CoimGrid>

      <div class="flex flex-wrap items-center gap-3">
        <CoimButton variant="contained" onclick={() => (dialogOpen = true)}>Open Dialog</CoimButton>
        <CoimButton variant="outlined" color="warning" onclick={() => (confirmOpen = true)}>Confirm Action</CoimButton>
        <CoimButton variant="outlined" onclick={() => (drawerOpen = true)}>Open Right Drawer</CoimButton>
        <CoimButton variant="outlined" onclick={() => (modalOpen = true)}>Low-Level Modal</CoimButton>

        <CoimPopover bind:open={popoverOpen}>
          {#snippet trigger({ props })}
            <CoimButton variant="pastel" {...props}>Toggle Popover</CoimButton>
          {/snippet}
          <div class="w-60 p-3 text-sm">
            <p class="font-semibold">Contextual Details</p>
            <p class="text-text-secondary mt-1">Anchored via Bits UI floating positioning with Escape dismissal.</p>
          </div>
        </CoimPopover>

        <CoimButton variant="text" onclick={() => toast.success("Toast queued via context store")}>
          Push Toast
        </CoimButton>
        <CoimButton variant="text" onclick={() => (snackbarOpen = true)}>Show Snackbar</CoimButton>
      </div>
    </CoimStack>

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-3 sm:items-center">
        <CoimSelect
          label="Alert Severity"
          size="small"
          value={alertSeverity}
          onValueChange={(v) => {
            if (v === "success" || v === "info" || v === "warning" || v === "error") alertSeverity = v;
          }}
          options={[
            { value: "success", label: "success" },
            { value: "info", label: "info" },
            { value: "warning", label: "warning" },
            { value: "error", label: "error" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="Alert Variant"
          size="small"
          value={alertVariant}
          onValueChange={(v) => {
            if (v === "standard" || v === "filled" || v === "outlined") alertVariant = v;
          }}
          options={[
            { value: "standard", label: "standard" },
            { value: "outlined", label: "outlined" },
            { value: "filled", label: "filled" },
          ]}
          fullWidth
        />
        <CoimFormControlLabel label="Neutral Surface">
          <CoimSwitch bind:checked={alertNeutral} />
        </CoimFormControlLabel>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-backdrop-popper"
    title="CoimBackdrop &amp; CoimPopper"
    description="Blocking loading scrim overlays and lightweight floating poppers anchored to any DOM element."
    code={backdropPopperCode}
    propsDocs={backdropPopperProps}
  >
    <div class="flex flex-wrap items-center gap-3">
      <CoimButton variant="outlined" onclick={() => (backdropOpen = true)}>
        Show Backdrop (click scrim to close)
      </CoimButton>

      <span bind:this={popperAnchor} class="inline-block">
        <CoimButton variant="contained" onclick={() => (popperOpen = !popperOpen)}>
          {popperOpen ? "Hide Popper" : "Show Popper"} ({popperPlacement})
        </CoimButton>
      </span>
    </div>

    <CoimPopper open={popperOpen} anchorEl={popperAnchor} placement={popperPlacement} offset={8}>
      <CoimPaper elevation={4} class="border-grey-100 border px-3.5 py-2.5 text-sm">
        <p class="font-semibold">Anchored CoimPopper</p>
        <p class="text-text-secondary text-xs">Placement: {popperPlacement}</p>
      </CoimPaper>
    </CoimPopper>

    {#snippet controls()}
      <div class="flex flex-wrap items-center gap-3">
        <CoimSelect
          label="Popper Placement"
          size="small"
          value={popperPlacement}
          onValueChange={(v) => {
            if (v === "top" || v === "bottom" || v === "left" || v === "right") popperPlacement = v;
          }}
          options={[
            { value: "top", label: "top" },
            { value: "bottom", label: "bottom" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
          ]}
        />
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-progress"
    title="Progress Indicators &amp; Skeletons"
    description="Determinate and indeterminate circular/linear progress bars plus skeleton shimmer placeholders."
    code={progressCode}
    propsDocs={progressProps}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={4}>
          <div class="flex items-center gap-5">
            <CoimCircularProgress
              variant="determinate"
              value={progressValue}
              color={progressColor}
              label={`${progressValue}% Complete`}
            />
            <CoimCircularProgress variant="indeterminate" size={32} color={progressColor} label="Syncing" />
          </div>
          <CoimLinearProgress
            variant="determinate"
            value={progressValue}
            color={progressColor}
            label={`${progressValue}% uploaded`}
          />
          <CoimLinearProgress variant="buffer" value={45} valueBuffer={75} color="secondary" label="Buffering" />
        </CoimStack>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={2}>
          <div class="flex items-center gap-3">
            <CoimSkeleton variant="circular" width={40} height={40} />
            <div class="flex-1 space-y-2">
              <CoimSkeleton variant="text" width="60%" />
              <CoimSkeleton variant="text" width="40%" />
            </div>
          </div>
          <CoimSkeleton variant="rounded" height={64} />
        </CoimStack>
      </CoimGrid>
    </CoimGrid>

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-2 sm:items-center">
        <CoimSelect
          label="Progress Color"
          size="small"
          value={progressColor}
          onValueChange={(v) => {
            if (typeof v === "string") progressColor = v as typeof progressColor;
          }}
          options={[
            { value: "primary", label: "primary" },
            { value: "secondary", label: "secondary" },
            { value: "success", label: "success" },
            { value: "info", label: "info" },
            { value: "warning", label: "warning" },
            { value: "error", label: "error" },
          ]}
          fullWidth
        />
        <div>
          <span class="text-text-secondary mb-1 block text-xs font-medium">Progress Value: {progressValue}%</span>
          <CoimSlider aria-label="Progress value" min={0} max={100} bind:value={progressValue} />
        </div>
      </div>
    {/snippet}
  </ComponentDocCard>
</CoimStack>

<CoimBackdrop open={backdropOpen} onclick={() => (backdropOpen = false)}>
  <CoimStack spacing={2} class="items-center text-white">
    <CoimCircularProgress variant="indeterminate" color="primary" />
    <span class="text-sm font-medium">Click anywhere to dismiss backdrop</span>
  </CoimStack>
</CoimBackdrop>

<CoimDialog bind:open={dialogOpen}>
  <CoimDialogTitle>Publish Workspace Snapshot</CoimDialogTitle>
  <CoimDialogContent>
    <CoimDialogContentText>
      Snapshots record current theme tokens and navigation permissions for instant rollback.
    </CoimDialogContentText>
  </CoimDialogContent>
  <CoimDialogActions>
    <CoimButton onclick={() => (dialogOpen = false)}>Cancel</CoimButton>
    <CoimButton
      variant="contained"
      onclick={() => {
        dialogOpen = false;
        toast.success("Snapshot created");
      }}
    >
      Publish
    </CoimButton>
  </CoimDialogActions>
</CoimDialog>

<CoimConfirmDialog
  bind:open={confirmOpen}
  severity="warning"
  title="Reset local preferences?"
  description="This restores default color mode, typography density, and layout orientation."
  onConfirm={() => {
    toast.info("Preferences reset");
  }}
/>

<CoimDrawer bind:open={drawerOpen} anchor="right" aria-label="Inspector drawer">
  <div class="w-80 max-w-full p-6">
    <h2 class="font-heading text-lg font-bold">Release Inspector</h2>
    <p class="text-text-secondary mt-2 text-sm">
      Side drawers lock outside background interaction and restore trigger focus on close.
    </p>
    <div class="mt-6">
      <CoimButton variant="contained" fullWidth onclick={() => (drawerOpen = false)}>Close Drawer</CoimButton>
    </div>
  </div>
</CoimDrawer>

<CoimModal bind:open={modalOpen}>
  <CoimPaper elevation={4} class="mx-auto mt-24 w-full max-w-md p-6">
    <h2 class="font-heading text-lg font-bold">Custom Portal Modal</h2>
    <p class="text-text-secondary mt-2 text-sm">Low-level portal overlay for custom full-surface modals.</p>
    <div class="mt-4 flex justify-end">
      <CoimButton variant="contained" onclick={() => (modalOpen = false)}>Close</CoimButton>
    </div>
  </CoimPaper>
</CoimModal>

<CoimSnackbar
  bind:open={snackbarOpen}
  title="Queued Export"
  message="Your CSV artifact is ready for download."
  variant="info"
/>
