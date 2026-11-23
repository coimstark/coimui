<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import type { CoimVideoSource } from "./types.js";
  import { resolveVideoEmbed, type CoimVideoProvider } from "./video-utils.js";

  interface Props {
    src?: string;
    sources?: CoimVideoSource[];
    provider?: CoimVideoProvider;
    poster?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    captionsSrc?: string;
    captionsLabel?: string;
    captionsLang?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    src,
    sources = [],
    provider = "auto",
    poster,
    controls = true,
    autoplay = false,
    loop = false,
    muted = false,
    captionsSrc,
    captionsLabel = "English",
    captionsLang = "en",
    ariaLabel = "Video player",
    class: className = "",
  }: Props = $props();

  let videoEl = $state<HTMLVideoElement | null>(null);
  let upgraded = $state(false);

  const embed = $derived(resolveVideoEmbed(src, provider));

  const resolvedSources = $derived(
    sources.length > 0 ? sources : src && !embed ? [{ src, type: "video/mp4" }] : [],
  );

  $effect(() => {
    if (typeof window === "undefined" || embed) return;
    let cancelled = false;

    void Promise.all([
      import("@videojs/html/video/player"),
      import("@videojs/html/video/skin"),
    ]).then(() => {
      if (!cancelled) upgraded = true;
    });

    return () => {
      cancelled = true;
    };
  });
</script>

<div class={cn("coim-video-player-wrap", className)}>
  {#if embed}
    <iframe
      src={embed.embedUrl}
      title={ariaLabel}
      data-video-provider={embed.kind}
      class="aspect-video w-full rounded-lg border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  {:else}
    <video-player>
      <video-skin class="block aspect-video w-full">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          bind:this={videoEl}
          aria-label={ariaLabel}
          class="h-full w-full"
          {poster}
          controls={controls && !upgraded}
          {autoplay}
          {loop}
          {muted}
          playsinline
        >
          {#each resolvedSources as source (source.src)}
            <source src={source.src} type={source.type ?? "video/mp4"} />
          {/each}
          {#if captionsSrc}
            <track kind="captions" src={captionsSrc} srclang={captionsLang} label={captionsLabel} default />
          {/if}
        </video>
      </video-skin>
    </video-player>
  {/if}
</div>
