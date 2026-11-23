<script lang="ts">
  import { page } from "$app/state";
  import VariantDashboard from "#lib/dashboards/VariantDashboard.svelte";

  const variantKey = $derived(page.params.variant ?? "analytics");
</script>

<svelte:head>
  <title>CoimUI Showcase — {variantKey} Dashboard</title>
</svelte:head>

<VariantDashboard variant={variantKey} />
