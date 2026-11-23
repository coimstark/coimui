<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
  } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  const model = $derived(aiContentStore.selectedModel);
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Model Detail</title>
</svelte:head>

<AiContentShell
  title={model.name}
  subtitle={`${model.modality} Pipeline · Release v${model.version}`}
>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimStack spacing={4}>
        <CoimCard class="overflow-hidden">
          <CoimCardMedia component="img" image={model.thumbnail} alt={model.name} class="h-60 w-full object-cover" />
          <CoimCardHeader title="Model Overview" subheader={model.summary} />
          <CoimCardContent>
            <div class="flex flex-wrap gap-2">
              {#each model.tags as tag (tag)}
                <CoimChip label={tag} size="small" color="primary" variant="pastel" />
              {/each}
            </div>
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Release Changelog" />
          <CoimCardContent>
            <CoimList>
              {#each model.changelog as item (item.version)}
                <CoimListItem>
                  <CoimListItemText primary={`v${item.version} (${item.date})`} secondary={item.notes} />
                </CoimListItem>
              {/each}
            </CoimList>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimCard>
        <CoimCardHeader title="Runtime Metrics" />
        <CoimCardContent>
          <CoimStack spacing={2.5}>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Runs Indexed</span>
              <span class="font-semibold">{model.runs}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Median Latency</span>
              <span class="font-semibold">{model.latency}</span>
            </div>
            <CoimButton href="/apps/ai-content/ai-image" variant="contained" fullWidth>
              Open in Studio
            </CoimButton>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</AiContentShell>
