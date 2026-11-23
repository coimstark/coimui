<script lang="ts">
  import { page } from "$app/state";
  import VariantDashboard from "#lib/dashboards/VariantDashboard.svelte";

  const variantKey = $derived(page.params.variant ?? "default");
</script>

<svelte:head>
  <title>CoimUI Showcase — {variantKey} (Titles Inside)</title>
</svelte:head>

<VariantDashboard variant={variantKey} titlesInside />
