<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimPaper,
    CoimStack,
  } from "@coimui/svelte";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  const modules = [
    { title: "Hero Composition", desc: "Balance camera distance, focal material cues, and lighting hierarchy." },
    { title: "Seed Locking & Variants", desc: "Freeze deterministic seeds while iterating negative prompts or aspect ratios." },
    { title: "Upscale Preservation", desc: "Prevent edge ringing when taking 1024px masters to 4x print resolution." },
    { title: "Provider Contracts", desc: "Configure authenticated media webhooks via standard API endpoints." },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Learn</title>
</svelte:head>

<AiContentShell
  title="Creative Studio Guides"
  subtitle="Reference documentation for studio workflows, parameter tuning, and provider adapters."
>
  <CoimStack spacing={4}>
    <CoimPaper variant="outlined" class="rounded-2xl p-6">
      <h2 class="font-heading text-xl font-bold">From Rough Plate to Production Master</h2>
      <p class="text-text-secondary mt-1 text-sm">
        Structure repeatable studio runs by staging reference plates in Uploads before dispatching configured model pipelines.
      </p>
    </CoimPaper>

    <CoimGrid container spacing={4}>
      {#each modules as mod (mod.title)}
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimCard class="h-full">
            <CoimCardHeader title={mod.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{mod.desc}</p>
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</AiContentShell>
