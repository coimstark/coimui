<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import type { CoimLightboxImage } from "./types.js";

  interface Props {
    images: CoimLightboxImage[];
    galleryId?: string;
    class?: string;
  }

  const uid = $props.id();

  let { images, galleryId, class: className = "" }: Props = $props();

  let galleryEl = $state<HTMLDivElement | null>(null);
  const resolvedId = $derived(galleryId ?? `coim-lightbox-${uid}`);

  $effect(() => {
    if (typeof window === "undefined" || !galleryEl) return;
    let lightbox: { init: () => void; destroy: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      await import("photoswipe/style.css");
      const { default: PhotoSwipeLightbox } = await import("photoswipe/lightbox");
      if (cancelled || !galleryEl) return;
      lightbox = new PhotoSwipeLightbox({
        gallery: `#${resolvedId}`,
        children: "a[data-pswp-width]",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
    })();

    return () => {
      cancelled = true;
      lightbox?.destroy();
      lightbox = null;
    };
  });
</script>

<div bind:this={galleryEl} id={resolvedId} class={cn("coim-lightbox-grid", className)}>
  {#each images as img, idx (`${idx}-${img.src}`)}
    <a
      href={img.src}
      data-pswp-width={img.width}
      data-pswp-height={img.height}
      aria-label={img.alt}
      class="border-grey-100 hover:border-primary block overflow-hidden rounded-lg border transition-colors"
    >
      <img
        src={img.thumbnailSrc ?? img.src}
        alt={img.alt}
        loading="lazy"
        class="h-32 w-full object-cover"
      />
      {#if img.caption}
        <div class="text-text-secondary px-2 py-1 text-xs">{img.caption}</div>
      {/if}
    </a>
  {/each}
</div>
