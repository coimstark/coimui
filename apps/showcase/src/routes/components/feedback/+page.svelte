<script lang="ts">
  import {
    CoimAlert,
    CoimAlertTitle,
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
    CoimGrid,
    CoimLinearProgress,
    CoimModal,
    CoimPaper,
    CoimPopover,
    CoimSkeleton,
    CoimSnackbar,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  let dialogOpen = $state(false);
  let confirmOpen = $state(false);
  let drawerOpen = $state(false);
  let modalOpen = $state(false);
  let popoverOpen = $state(false);
  let snackbarOpen = $state(false);
</script>

<svelte:head>
  <title>CoimUI Showcase — Feedback & Overlays</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Feedback & Overlays" }]} />
    <CoimTypography variant="h1" class="mt-2">Feedback &amp; Overlays</CoimTypography>
    <p class="text-text-secondary mt-1">
      Alerts, native modal dialogs, confirmation prompts, side drawers, popovers, inline progress meters, skeletons, and live toast queues.
    </p>
  </div>

  <CoimTypography variant="h2">Alerts, Dialogs, Drawers &amp; Progress Indicators</CoimTypography>

  <ComponentDocCard
    title="Alerts, Dialogs, ConfirmDialog, Drawer, Modal & Popover"
    description="Built on native top-layer <dialog> semantics where appropriate and accessible focus restoration."
    code={COMPONENT_CODE_EXAMPLES.alertsAndDialogs}
  >
    <CoimStack spacing={4}>
      <CoimGrid container spacing={3}>
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimAlert severity="success">
            <CoimAlertTitle>Verification Complete</CoimAlertTitle>
            All contract and bundle isolation assertions passed.
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
  </ComponentDocCard>

  <ComponentDocCard
    title="Progress Indicators & Skeletons"
    description="Determinate and indeterminate circular/linear progress bars plus skeleton shimmer placeholders."
    code={COMPONENT_CODE_EXAMPLES.progressAndFeedback}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={4}>
          <div class="flex items-center gap-5">
            <CoimCircularProgress variant="determinate" value={76} label="76% Complete" />
            <CoimCircularProgress variant="indeterminate" size={32} label="Syncing" />
          </div>
          <CoimLinearProgress variant="determinate" value={68} label="68% uploaded" />
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
  </ComponentDocCard>
</CoimStack>

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
