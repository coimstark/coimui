<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimSwitch,
    toast,
  } from "@coimui/svelte";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  let annual = $state(true);

  const plans = [
    { name: "Creator Sandbox", monthly: 0, annual: 0, features: "Local preset editing, gallery previews & uploads", featured: false },
    { name: "Studio Pro", monthly: 39, annual: 29, features: "Shared model presets, 4x upscaling queue & batch keys", featured: true },
    { name: "Dedicated Cluster", monthly: 149, annual: 119, features: "Private GPU worker routing & custom style checkpoints", featured: false },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Plans</title>
</svelte:head>

<AiContentShell title="Media Studio Plans" subtitle="Compute tiers and enterprise rendering quotas.">
  <CoimStack spacing={4}>
    <CoimSwitch label="Annual studio billing" bind:checked={annual} />

    <CoimGrid container spacing={4}>
      {#each plans as plan (plan.name)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class={plan.featured ? "border-primary border-2 h-full" : "h-full"}>
            <CoimCardHeader title={plan.name} subheader={plan.features}>
              {#snippet action()}
                {#if plan.featured}
                  <CoimChip label="Recommended" color="primary" size="small" variant="pastel" />
                {/if}
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="font-heading text-3xl font-bold">
                ${annual ? plan.annual : plan.monthly}<span class="text-text-secondary text-sm font-normal"> / month</span>
              </p>
            </CoimCardContent>
            <CoimCardActions>
              <CoimButton
                fullWidth
                variant={plan.featured ? "contained" : "outlined"}
                onclick={() => toast.success(`Activated ${plan.name} preview`)}
              >
                Choose Plan
              </CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</AiContentShell>
