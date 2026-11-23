<script lang="ts">
  import { CoimBreadcrumbs, CoimButton, CoimPaper, CoimStack, CoimTypography } from "@coimui/svelte";
  import { CiPlus } from "@coimui/svelte/icons";
</script>

<svelte:head>
  <title>CoimUI Showcase — Empty State</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Empty" }]} />
    <CoimTypography variant="h1" class="mt-2">Empty Workspace View</CoimTypography>
  </div>

  <CoimPaper variant="outlined" class="flex flex-col items-center rounded-2xl p-12 text-center">
    <img src="/images/icons/box-icon.png" alt="Empty state box" class="mb-4 h-16 w-16 object-contain" />
    <h2 class="font-heading text-xl font-bold">No records created in this space yet</h2>
    <p class="text-text-secondary mt-1 max-w-md text-sm">
      Launch a workspace template, import a CSV dataset, or create your first resource to get started.
    </p>
    <div class="mt-5 flex flex-wrap gap-2">
      <CoimButton href="/data-grid" variant="contained">
        {#snippet startIcon()}
          <CiPlus size={16} />
        {/snippet}
        Open Data Grid
      </CoimButton>
      <CoimButton href="/pages/miscellaneous" variant="outlined">Back to Miscellaneous</CoimButton>
    </div>
  </CoimPaper>
</CoimStack>
