<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimChip,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTablePagination,
    CoimTableRow,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { starterI18n } from "#lib/i18n.svelte.ts";

  interface ProjectRecord {
    id: string;
    name: string;
    owner: string;
    environment: "Production" | "Staging" | "Sandbox";
    budget: number;
  }

  let projects = $state<ProjectRecord[]>([
    { id: "PRJ-01", name: "Core Design Tokens", owner: "Laura Ellis", environment: "Production", budget: 18500 },
    { id: "PRJ-02", name: "Checkout Flow v3", owner: "Sofia Alvarez", environment: "Staging", budget: 24000 },
    { id: "PRJ-03", name: "Customer Audit Portal", owner: "Daniel Miller", environment: "Production", budget: 31200 },
    { id: "PRJ-04", name: "Notification Worker", owner: "Zoila Vittorino", environment: "Production", budget: 12400 },
    { id: "PRJ-05", name: "Partner API Explorer", owner: "Noah Kim", environment: "Sandbox", budget: 9800 },
    { id: "PRJ-06", name: "Invoice Export Batch", owner: "Mina Patel", environment: "Staging", budget: 15600 },
  ]);

  let search = $state("");
  let envFilter = $state<"All" | "Production" | "Staging" | "Sandbox">("All");
  let page = $state(0);
  let rowsPerPage = $state(4);
  let createOpen = $state(false);
  let draftName = $state("");
  let draftOwner = $state("");

  const filtered = $derived(
    projects.filter((p) => {
      const matchEnv = envFilter === "All" || p.environment === envFilter;
      const q = search.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return matchEnv && matchQuery;
    }),
  );

  const paged = $derived(
    filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  );

  function addProject() {
    if (!draftName.trim()) return;
    projects = [
      {
        id: `PRJ-0${projects.length + 1}`,
        name: draftName.trim(),
        owner: draftOwner.trim() || "Assigned Lead",
        environment: "Sandbox",
        budget: 10000,
      },
      ...projects,
    ];
    draftName = "";
    draftOwner = "";
    createOpen = false;
    page = 0;
    toast.success("Project added");
  }
</script>

<svelte:head>
  <title>CoimUI Starter — {starterI18n.t("nav-projects")}</title>
</svelte:head>

<CoimStack spacing={6}>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <CoimBreadcrumbs items={[{ label: starterI18n.t("nav-overview"), href: "/" }, { label: starterI18n.t("nav-projects") }]} />
      <CoimTypography variant="h1" class="mt-2">{starterI18n.t("nav-projects")}</CoimTypography>
    </div>
    <CoimButton variant="contained" onclick={() => (createOpen = true)}>
      {starterI18n.t("quick-create")}
    </CoimButton>
  </div>

  <CoimCard>
    <CoimCardContent>
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <CoimTextField
          label="Search projects"
          size="small"
          bind:value={search}
          onValueChange={() => {
            page = 0;
          }}
        />
        <div class="flex flex-wrap gap-2">
          {#each ["All", "Production", "Staging", "Sandbox"] as env (env)}
            <CoimChip
              label={env}
              clickable
              variant={envFilter === env ? "filled" : "outlined"}
              color={envFilter === env ? "primary" : "grey"}
              onclick={() => {
                envFilter = env as typeof envFilter;
                page = 0;
              }}
            />
          {/each}
        </div>
      </div>

      <CoimTableContainer>
        <CoimTable>
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell>ID</CoimTableCell>
              <CoimTableCell>Name</CoimTableCell>
              <CoimTableCell>Owner</CoimTableCell>
              <CoimTableCell>Environment</CoimTableCell>
              <CoimTableCell align="right">Budget</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each paged as item (item.id)}
              <CoimTableRow>
                <CoimTableCell class="font-medium">{item.id}</CoimTableCell>
                <CoimTableCell>{item.name}</CoimTableCell>
                <CoimTableCell>{item.owner}</CoimTableCell>
                <CoimTableCell>
                  <CoimChip
                    label={item.environment}
                    size="small"
                    variant="pastel"
                    color={item.environment === "Production" ? "success" : item.environment === "Staging" ? "warning" : "info"}
                  />
                </CoimTableCell>
                <CoimTableCell align="right">${item.budget.toLocaleString()}</CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
        <CoimTablePagination
          count={filtered.length}
          bind:page
          bind:rowsPerPage
          rowsPerPageOptions={[4, 8, 12]}
        />
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</CoimStack>

<CoimDialog bind:open={createOpen}>
  <CoimDialogTitle>New Workspace Project</CoimDialogTitle>
  <CoimDialogContent>
    <CoimStack spacing={4} class="pt-2">
      <CoimTextField label="Project Title" bind:value={draftName} required fullWidth />
      <CoimTextField label="Owner" bind:value={draftOwner} fullWidth />
    </CoimStack>
  </CoimDialogContent>
  <CoimDialogActions>
    <CoimButton variant="text" onclick={() => (createOpen = false)}>Cancel</CoimButton>
    <CoimButton variant="contained" onclick={addProject}>Save</CoimButton>
  </CoimDialogActions>
</CoimDialog>
