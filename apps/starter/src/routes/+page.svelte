<script lang="ts">
  import {
    CoimAlert,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimCircularProgress,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimGrid,
    CoimLinearProgress,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTableSortLabel,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { starterI18n } from "#lib/i18n.svelte.ts";

  interface ActivityRow {
    id: string;
    project: string;
    owner: string;
    status: "Active" | "Review" | "Scheduled";
    progress: number;
  }

  let rows = $state<ActivityRow[]>([
    { id: "PRJ-101", project: "Billing Portal v2", owner: "Laura Ellis", status: "Active", progress: 84 },
    { id: "PRJ-102", project: "Inventory Sync API", owner: "Zoila Vittorino", status: "Review", progress: 62 },
    { id: "PRJ-103", project: "Partner Onboarding", owner: "Daniel Miller", status: "Active", progress: 91 },
    { id: "PRJ-104", project: "Mobile Checkout", owner: "Sofia Alvarez", status: "Scheduled", progress: 28 },
  ]);

  let sortDir = $state<"asc" | "desc">("desc");
  let dialogOpen = $state(false);
  let newName = $state("");
  let newOwner = $state("");

  const sortedRows = $derived(
    [...rows].sort((a, b) =>
      sortDir === "asc" ? a.progress - b.progress : b.progress - a.progress,
    ),
  );

  function createProject() {
    if (!newName.trim()) return;
    rows = [
      {
        id: `PRJ-${105 + rows.length}`,
        project: newName.trim(),
        owner: newOwner.trim() || "Workspace Team",
        status: "Active",
        progress: 15,
      },
      ...rows,
    ];
    newName = "";
    newOwner = "";
    dialogOpen = false;
    toast.success("Project created in starter workspace");
  }
</script>

<svelte:head>
  <title>CoimUI Starter — {starterI18n.t("nav-dashboard")}</title>
</svelte:head>

<CoimStack spacing={6}>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <CoimBreadcrumbs items={[{ label: starterI18n.t("nav-overview"), href: "/" }, { label: starterI18n.t("nav-dashboard") }]} />
      <CoimTypography variant="h1" class="mt-2">{starterI18n.t("hero-title")}</CoimTypography>
      <CoimTypography variant="body1" class="text-text-secondary mt-1">
        {starterI18n.t("hero-subtitle")}
      </CoimTypography>
    </div>

    <div class="flex items-center gap-2">
      <CoimButton variant="outlined" color="secondary" href="/forms">
        {starterI18n.t("nav-forms")}
      </CoimButton>
      <CoimButton variant="contained" color="primary" onclick={() => (dialogOpen = true)}>
        {starterI18n.t("quick-create")}
      </CoimButton>
    </div>
  </div>

  <CoimAlert severity="info" title="Lean Core Architecture">
    CoimUI Starter imports solely from <code>@coimui/svelte</code>, <code>i18next</code>, <code>zod</code>, and <code>sveltekit-superforms</code>.
  </CoimAlert>

  <CoimGrid container spacing={4}>
    {#each [
      { label: starterI18n.t("kpi-revenue"), value: "$48,920", delta: "+12.4%", color: "primary" as const, progress: 82 },
      { label: starterI18n.t("kpi-customers"), value: "1,284", delta: "+8.1%", color: "secondary" as const, progress: 74 },
      { label: starterI18n.t("kpi-conversion"), value: "4.62%", delta: "+0.9%", color: "success" as const, progress: 68 },
      { label: starterI18n.t("kpi-uptime"), value: "99.98%", delta: "SLA OK", color: "info" as const, progress: 99 },
    ] as kpi (kpi.label)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="h-full">
          <CoimCardContent class="flex h-full flex-col justify-between">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-text-secondary text-sm">{kpi.label}</div>
                <div class="font-heading mt-1 text-2xl font-bold">{kpi.value}</div>
                <CoimChip label={kpi.delta} size="small" variant="pastel" color={kpi.color} class="mt-2" />
              </div>
              <CoimCircularProgress value={kpi.progress} color={kpi.color} size={44} label={`${kpi.label} ${kpi.progress}%`} />
            </div>
            <CoimLinearProgress value={kpi.progress} color={kpi.color} label={`${kpi.label} trend ${kpi.progress}%`} class="mt-4" />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimCard>
    <CoimCardHeader title={starterI18n.t("recent-activity")} subheader="Click completion header to sort records" />
    <CoimCardContent>
      <CoimTableContainer>
        <CoimTable>
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell>ID</CoimTableCell>
              <CoimTableCell>Project</CoimTableCell>
              <CoimTableCell>Owner</CoimTableCell>
              <CoimTableCell>Status</CoimTableCell>
              <CoimTableCell align="right">
                <CoimTableSortLabel
                  active={true}
                  direction={sortDir}
                  onclick={() => {
                    sortDir = sortDir === "asc" ? "desc" : "asc";
                  }}
                >
                  Completion
                </CoimTableSortLabel>
              </CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each sortedRows as row (row.id)}
              <CoimTableRow>
                <CoimTableCell class="font-medium">{row.id}</CoimTableCell>
                <CoimTableCell>{row.project}</CoimTableCell>
                <CoimTableCell>{row.owner}</CoimTableCell>
                <CoimTableCell>
                  <CoimChip
                    label={row.status}
                    size="small"
                    variant="pastel"
                    color={row.status === "Active" ? "success" : row.status === "Review" ? "warning" : "info"}
                  />
                </CoimTableCell>
                <CoimTableCell align="right">{row.progress}%</CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</CoimStack>

<CoimDialog bind:open={dialogOpen}>
  <CoimDialogTitle>Create Starter Project</CoimDialogTitle>
  <CoimDialogContent>
    <CoimStack spacing={4} class="pt-2">
      <CoimTextField label="Project Name" bind:value={newName} required fullWidth />
      <CoimTextField label="Lead Owner" bind:value={newOwner} placeholder="e.g. Laura Ellis" fullWidth />
    </CoimStack>
  </CoimDialogContent>
  <CoimDialogActions>
    <CoimButton variant="text" onclick={() => (dialogOpen = false)}>Cancel</CoimButton>
    <CoimButton variant="contained" color="primary" onclick={createProject}>Create</CoimButton>
  </CoimDialogActions>
</CoimDialog>
