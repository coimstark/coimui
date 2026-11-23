<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimStack,
    CoimTypography,
    MenuType,
    getLayoutContext,
  } from "@coimui/svelte";

  const layout = getLayoutContext();
</script>

<svelte:head>
  <title>CoimUI Starter — Single Menu Item</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Overview", href: "/" }, { label: "Single Menu" }]} />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">Single-Menu View</CoimTypography>
      <CoimChip label="Top-Level Entry" size="small" color="secondary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1 text-sm">
      Demonstrates a leaf workspace entry mounted directly without nested secondary child items.
    </p>
  </div>

  <CoimCard>
    <CoimCardHeader title="Navigation Mode Switcher" subheader={`Active menu mode: ${layout.leftMenuType}`} />
    <CoimCardContent class="flex flex-wrap gap-2">
      <CoimButton
        size="small"
        variant={layout.leftMenuType === MenuType.Minimal ? "contained" : "outlined"}
        onclick={() => layout.setLeftMenuType(MenuType.Minimal)}
      >
        Minimal
      </CoimButton>
      <CoimButton
        size="small"
        variant={layout.leftMenuType === MenuType.Comfort ? "contained" : "outlined"}
        onclick={() => layout.setLeftMenuType(MenuType.Comfort)}
      >
        Comfort
      </CoimButton>
      <CoimButton
        size="small"
        variant={layout.leftMenuType === MenuType.SingleLayer ? "contained" : "outlined"}
        onclick={() => layout.setLeftMenuType(MenuType.SingleLayer)}
      >
        Single Layer
      </CoimButton>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
