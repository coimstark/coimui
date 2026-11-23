<script lang="ts">
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
  import { CoimButton, CoimCard, CoimCardActions, CoimCardContent, CoimCardHeader, CoimCardMedia, CoimGrid, CoimStack } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";

  const studios = [
    { title: "Image Generation Studio", desc: "Editorial aspect ratios, prompt presets, and Vision Studio v2.", href: "/apps/ai-content/ai-image", img: "/images/models/model-1.jpg" },
    { title: "Video Motion Studio", desc: "Keyframe loops, frame-rate sliders, and Motion Frame Pro.", href: "/apps/ai-content/ai-video", img: "/images/models/model-4.jpg" },
    { title: "Upscale Pipeline", desc: "2x/4x edge-preserving enhancement via Clarity 4x.", href: "/apps/ai-content/ai-upscale", img: "/images/models/model-3.jpg" },
    { title: "Media Library", desc: "Searchable gallery, favorites, lightbox preview, and cleanup.", href: "/apps/ai-content/library", img: "/images/models/model-5.jpg" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content</title>
</svelte:head>

<AiContentShell
  title="AI Content Suite"
  subtitle="Creative studios for image synthesis, motion rendering, super-resolution, models, and asset library curation."
>
  <CoimStack spacing={4}>
    <CoimGrid container spacing={4}>
      {#each studios as s (s.href)}
        <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CoimCard class="flex h-full flex-col justify-between overflow-hidden">
            <div>
              <CoimCardMedia component="img" image={s.img} alt={s.title} class="h-40 w-full object-cover" />
              <CoimCardHeader title={s.title} />
              <CoimCardContent>
                <p class="text-text-secondary text-sm">{s.desc}</p>
              </CoimCardContent>
            </div>
            <CoimCardActions>
              <CoimButton href={s.href} variant="contained" size="small" fullWidth>Open Studio</CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>

    <CoimCard>
      <CoimCardHeader title="Recent Assets" subheader={`${aiContentStore.assets.length} saved items`} />
      <CoimCardContent>
        <CoimButton href="/apps/ai-content/home" variant="outlined">Open Creative Home Dashboard</CoimButton>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</AiContentShell>
