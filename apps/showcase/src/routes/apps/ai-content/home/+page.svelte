<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimPaper,
    CoimStack,
  } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Home</title>
</svelte:head>

<AiContentShell
  title="Creative Studio Home"
  subtitle="Recent creations, generation tips, workflow tutorials, and quick-launch pipelines."
>
  <CoimStack spacing={5}>
    <CoimPaper variant="outlined" class="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
      <div>
        <CoimChip label="Studio Pipeline" color="primary" variant="pastel" size="small" />
        <h2 class="font-heading mt-2 text-2xl font-bold">Prepare prompts, models, and reference uploads</h2>
        <p class="text-text-secondary mt-1 text-sm">
          Connect a provider endpoint to dispatch generation jobs or manage your saved asset library locally.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <CoimButton href="/apps/ai-content/ai-image" variant="contained">Image Studio</CoimButton>
        <CoimButton href="/apps/ai-content/ai-video" variant="outlined">Video Studio</CoimButton>
      </div>
    </CoimPaper>

    <CoimGrid container spacing={4}>
      {#each aiContentStore.assets as asset (asset.id)}
        <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CoimCard class="h-full overflow-hidden">
            <CoimCardMedia component="img" image={asset.src} alt={asset.title} class="h-40 w-full object-cover" />
            <CoimCardHeader title={asset.title} subheader={`${asset.modelName} · ${asset.createdAt}`} />
            <CoimCardContent>
              <CoimChip label={asset.kind.toUpperCase()} size="small" variant="pastel" color="secondary" />
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>

    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title="Prompt Crafting Tips" subheader="Structured lighting & focal hierarchy" />
          <CoimCardContent>
            <p class="text-text-secondary text-sm">
              Combine material textures, deterministic seed lock, and aspect ratios tuned to target placements before queuing renders.
            </p>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title="Guided Tutorials" subheader="Step-by-step creative recipes" />
          <CoimCardContent>
            <CoimButton href="/apps/ai-content/learn" variant="outlined" size="small">Open Learning Hub</CoimButton>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>
  </CoimStack>
</AiContentShell>
