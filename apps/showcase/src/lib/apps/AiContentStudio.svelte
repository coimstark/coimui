<script lang="ts">
  import {
    CoimAlert,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimPaper,
    CoimSelect,
    CoimSlider,
    CoimStack,
    CoimSwitch,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CiSparkle } from "@coimui/svelte/icons";
  import { aiContentStore } from "./ai-content.svelte.ts";

  interface Props {
    mode: "image" | "video" | "upscale";
  }

  let { mode }: Props = $props();

  let prompt = $state("Studio acoustic desk lamp on matte brushed concrete, soft daylight");
  let negativePrompt = $state("blurry edges, overexposed highlights");
  let selectedModel = $state("");
  let aspectRatio = $state("16:9");
  let steps = $state(28);
  let upscaleFactor = $state("4x");
  let deterministicSeed = $state(true);

  $effect.pre(() => {
    if (!selectedModel) {
      selectedModel =
        mode === "video" ? "Motion Frame Pro" : mode === "upscale" ? "Clarity 4x" : "Vision Studio v2";
    }
  });

  function handleSavePreset() {
    toast.success(`Saved ${mode} parameter preset (${selectedModel})`);
  }

  function handleGenerate(event: SubmitEvent) {
    event.preventDefault();
    if (!aiContentStore.isProviderConfigured) return;
    toast.info(`Recorded ${mode} demo request for ${aiContentStore.providerModel} (local showcase state only)`);
  }
</script>

<CoimGrid container spacing={4}>
  <CoimGrid size={{ xs: 12, lg: 5 }}>
    <CoimCard>
      <CoimCardHeader
        title={mode === "image"
          ? "Image Parameters"
          : mode === "video"
            ? "Video Motion Parameters"
            : "Upscale Pipeline Parameters"}
        subheader="Configure model, dimensions, and deterministic generation options"
      />
      <CoimCardContent>
        <form onsubmit={handleGenerate}>
          <CoimStack spacing={3}>
            <CoimTextField
              label={mode === "upscale" ? "Enhancement Notes" : "Prompt"}
              bind:value={prompt}
              multiline
              rows={3}
              fullWidth
            />
            {#if mode !== "upscale"}
              <CoimTextField
                label="Negative Prompt"
                bind:value={negativePrompt}
                fullWidth
              />
            {/if}

            <CoimSelect
              label="Model Preset"
              value={selectedModel}
              onValueChange={(v) => {
                if (typeof v === "string") selectedModel = v;
              }}
              options={aiContentStore.models.map((m) => ({ value: m.name, label: `${m.name} (${m.modality})` }))}
              fullWidth
            />

            {#if mode === "upscale"}
              <CoimSelect
                label="Scale Factor"
                value={upscaleFactor}
                onValueChange={(v) => {
                  if (typeof v === "string") upscaleFactor = v;
                }}
                options={[
                  { value: "2x", label: "2x Super Resolution" },
                  { value: "4x", label: "4x Ultra Clarity" },
                ]}
                fullWidth
              />
            {:else}
              <CoimSelect
                label="Aspect Ratio"
                value={aspectRatio}
                onValueChange={(v) => {
                  if (typeof v === "string") aspectRatio = v;
                }}
                options={[
                  { value: "1:1", label: "1:1 Square" },
                  { value: "4:3", label: "4:3 Studio" },
                  { value: "16:9", label: "16:9 Widescreen" },
                ]}
                fullWidth
              />
            {/if}

            <div>
              <span class="text-text-secondary mb-1.5 block text-xs font-medium">
                {mode === "video" ? `Frames per second (${steps})` : `Sampling steps (${steps})`}
              </span>
              <CoimSlider
                aria-label={mode === "video" ? "Frames per second" : "Sampling steps"}
                bind:value={steps}
                min={12}
                max={60}
                valueLabelDisplay="auto"
              />
            </div>

            <CoimSwitch label="Lock deterministic seed" bind:checked={deterministicSeed} />

            {#if !aiContentStore.isProviderConfigured}
              <CoimAlert severity="info">
                Generation is disabled until a media provider endpoint is configured in the header dialog.
              </CoimAlert>
            {/if}

            <div class="flex flex-wrap gap-2">
              <CoimButton
                type="submit"
                variant="contained"
                disabled={!aiContentStore.isProviderConfigured}
              >
                {#snippet startIcon()}
                  <CiSparkle size={16} />
                {/snippet}
                {mode === "upscale" ? "Run Upscale" : mode === "video" ? "Render Video" : "Generate Image"}
              </CoimButton>
              <CoimButton type="button" variant="outlined" onclick={handleSavePreset}>
                Save Preset
              </CoimButton>
            </div>
          </CoimStack>
        </form>
      </CoimCardContent>
    </CoimCard>
  </CoimGrid>

  <CoimGrid size={{ xs: 12, lg: 7 }}>
    <CoimCard class="h-full">
      <CoimCardHeader
        title="Reference Gallery &amp; Active Uploads"
        subheader="Inspect existing studio renders or manage queued upload references"
      />
      <CoimCardContent>
        <CoimGrid container spacing={3}>
          {#each aiContentStore.assets.filter((a) => a.kind === mode || mode === "image") as asset (asset.id)}
            <CoimGrid size={{ xs: 12, sm: 6 }}>
              <CoimPaper variant="outlined" class="overflow-hidden rounded-xl">
                <img src={asset.src} alt={asset.title} class="h-44 w-full object-cover" />
                <div class="p-3">
                  <p class="font-semibold text-sm">{asset.title}</p>
                  <p class="text-text-secondary text-xs">{asset.modelName} · {asset.aspect}</p>
                </div>
              </CoimPaper>
            </CoimGrid>
          {/each}
        </CoimGrid>
      </CoimCardContent>
    </CoimCard>
  </CoimGrid>
</CoimGrid>
