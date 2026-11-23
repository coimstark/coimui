<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
</script>

<svelte:head>
  <title>CoimUI Starter — Overview Subpage</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Overview", href: "/" }, { label: "Subpage" }]} />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">Workspace Sub-Route</CoimTypography>
      <CoimChip label="Nested Navigation" size="small" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1 text-sm">
      Dedicated nested overview page demonstrating breadcrumb trail and secondary sidebar state synchronization.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Sub-Section Metrics" subheader="Scoped child workspace view" />
        <CoimCardContent>
          <p class="text-text-secondary text-sm">
            Child routes preserve light/dark tokens, theme presets, RTL sync, and lean package boundaries.
          </p>
          <div class="mt-4 flex gap-2">
            <CoimButton href="/" size="small" variant="contained">Back to Overview</CoimButton>
            <CoimButton href="/projects" size="small" variant="outlined">Open Projects</CoimButton>
          </div>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Single-Layer Demo" subheader="Direct single-level navigation check" />
        <CoimCardContent>
          <CoimButton href="/single-menu" size="small" variant="outlined">Open Single-Menu View</CoimButton>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
