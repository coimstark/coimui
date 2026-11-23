<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CoimLightbox } from "@coimui/svelte/plugins";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  let query = $state("");
  let kindFilter = $state<"all" | "image" | "video" | "upscale">("all");
  let onlyFavorites = $state(false);

  const visibleAssets = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return aiContentStore.assets.filter((item) => {
      if (kindFilter !== "all" && item.kind !== kindFilter) return false;
      if (onlyFavorites && !item.favorite) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.prompt.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  });

  const lightboxImages = $derived(
    visibleAssets.map((a) => ({
      src: a.src,
      width: 960,
      height: 720,
      alt: a.title,
      caption: `${a.title} — ${a.modelName}`,
    })),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Library</title>
</svelte:head>

<AiContentShell
  title="Media Library"
  subtitle="Search, favorite, preview in Lightbox, or remove studio assets."
>
  <CoimStack spacing={4}>
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-64 flex-1">
        <CoimTextField label="Search library" placeholder="Filter by title or prompt..." bind:value={query} fullWidth />
      </div>
      <div class="flex flex-wrap gap-2">
        {#each (["all", "image", "video", "upscale"] as const) as kind (kind)}
          <CoimButton
            size="small"
            variant={kindFilter === kind ? "contained" : "outlined"}
            onclick={() => (kindFilter = kind)}
          >
            {kind === "all" ? "All" : kind.toUpperCase()}
          </CoimButton>
        {/each}
        <CoimButton
          size="small"
          variant={onlyFavorites ? "contained" : "outlined"}
          onclick={() => (onlyFavorites = !onlyFavorites)}
        >
          Favorites Only
        </CoimButton>
      </div>
    </div>

    {#if lightboxImages.length > 0}
      <CoimCard>
        <CoimCardHeader title="Interactive Lightbox Preview" subheader="Click any frame to open fullscreen zoom" />
        <CoimCardContent>
          <CoimLightbox images={lightboxImages} showCounter showDownload showCaptions />
        </CoimCardContent>
      </CoimCard>
    {/if}

    <CoimGrid container spacing={4}>
      {#each visibleAssets as asset (asset.id)}
        <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CoimCard class="flex h-full flex-col justify-between overflow-hidden">
            <div>
              <CoimCardMedia component="img" image={asset.src} alt={asset.title} class="h-40 w-full object-cover" />
              <CoimCardHeader title={asset.title} subheader={`${asset.modelName} · ${asset.aspect}`}>
                {#snippet action()}
                  <CoimChip label={asset.kind} size="small" variant="pastel" color="primary" />
                {/snippet}
              </CoimCardHeader>
              <CoimCardContent>
                <p class="text-text-secondary text-xs">{asset.prompt}</p>
              </CoimCardContent>
            </div>
            <CoimCardActions>
              <CoimButton
                size="tiny"
                variant={asset.favorite ? "contained" : "outlined"}
                onclick={() => aiContentStore.toggleFavorite(asset.id)}
              >
                {asset.favorite ? "Starred" : "Favorite"}
              </CoimButton>
              <CoimButton
                size="tiny"
                variant="text"
                color="error"
                onclick={() => {
                  aiContentStore.deleteAsset(asset.id);
                  toast.info(`Removed ${asset.title}`);
                }}
              >
                Remove
              </CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</AiContentShell>
