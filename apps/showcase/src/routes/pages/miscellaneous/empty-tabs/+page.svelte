<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimPaper,
    CoimStack,
    CoimTab,
    CoimTabPanel,
    CoimTabs,
    CoimTypography,
  } from "@coimui/svelte";

  let tab = $state("assigned");
</script>

<svelte:head>
  <title>CoimUI Showcase — Empty Tabs State</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Empty Tabs" }]} />
    <CoimTypography variant="h1" class="mt-2">Tabbed Workspace States</CoimTypography>
  </div>

  <CoimTabs bind:value={tab} hairline>
    {#snippet tabs()}
      <CoimTab value="assigned" label="Assigned to Me (0)" />
      <CoimTab value="archived" label="Archived (0)" />
    {/snippet}

    <CoimTabPanel value="assigned">
      <CoimPaper variant="outlined" class="mt-4 flex flex-col items-center rounded-xl p-10 text-center">
        <p class="font-semibold">All caught up</p>
        <p class="text-text-secondary mt-1 text-sm">No tasks are currently waiting for your review.</p>
        <CoimButton href="/apps/kanban" size="small" variant="contained" class="mt-4">Open Kanban</CoimButton>
      </CoimPaper>
    </CoimTabPanel>

    <CoimTabPanel value="archived">
      <CoimPaper variant="outlined" class="mt-4 flex flex-col items-center rounded-xl p-10 text-center">
        <p class="font-semibold">Archive folder is empty</p>
        <p class="text-text-secondary mt-1 text-sm">Completed records will appear here after sprint closure.</p>
      </CoimPaper>
    </CoimTabPanel>
  </CoimTabs>
</CoimStack>
