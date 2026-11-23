<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
  } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  let modalityFilter = $state("All");
  const modalities = ["All", "Image", "Video", "Upscale"];

  const visibleModels = $derived(
    modalityFilter === "All"
      ? aiContentStore.models
      : aiContentStore.models.filter((m) => m.modality === modalityFilter),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Models</title>
</svelte:head>

<AiContentShell
  title="Media Models Catalog"
  subtitle="Inspect capabilities, version history, and latency metrics across available media pipelines."
>
  <div class="flex flex-wrap gap-2">
    {#each modalities as mod (mod)}
      <CoimButton
        size="small"
        variant={modalityFilter === mod ? "contained" : "outlined"}
        onclick={() => (modalityFilter = mod)}
      >
        {mod}
      </CoimButton>
    {/each}
  </div>

  <CoimGrid container spacing={4}>
    {#each visibleModels as model (model.id)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class="flex h-full flex-col justify-between overflow-hidden">
          <div>
            <CoimCardMedia component="img" image={model.thumbnail} alt={model.name} class="h-44 w-full object-cover" />
            <CoimCardHeader title={model.name} subheader={`${model.modality} · v${model.version}`}>
              {#snippet action()}
                <CoimChip label={model.latency} size="small" color="info" variant="pastel" />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{model.summary}</p>
              <div class="mt-3 flex flex-wrap gap-1.5">
                {#each model.tags as tag (tag)}
                  <CoimChip label={tag} size="small" variant="outlined" />
                {/each}
              </div>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton
              size="small"
              variant="contained"
              fullWidth
              onclick={() => {
                aiContentStore.selectModel(model.id);
                void goto("/apps/ai-content/ai-models/detail");
              }}
            >
              Inspect Model
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</AiContentShell>
