<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import type { CoimLightboxImage } from "./types.js";

  interface Props {
    images: CoimLightboxImage[];
    galleryId?: string;
    showCounter?: boolean;
    showDownload?: boolean;
    showCaptions?: boolean;
    class?: string;
  }

  const uid = $props.id();

  let {
    images,
    galleryId,
    showCounter = true,
    showDownload = false,
    showCaptions = true,
    class: className = "",
  }: Props = $props();

  let galleryEl = $state<HTMLDivElement | null>(null);
  const resolvedId = $derived(galleryId ?? `coim-lightbox-${uid}`);

  $effect(() => {
    if (typeof window === "undefined" || !galleryEl) return;
    let lightbox: {
      on?: (event: string, fn: () => void) => void;
      pswp?: {
        on?: (event: string, fn: () => void) => void;
        ui?: {
          registerElement: (spec: Record<string, unknown>) => void;
        };
        currSlide?: { data?: { element?: Element; src?: string } };
      };
      init: () => void;
      destroy: () => void;
    } | null = null;
    let cancelled = false;

    void (async () => {
      await import("photoswipe/style.css");
      const { default: PhotoSwipeLightbox } = await import("photoswipe/lightbox");
      if (cancelled || !galleryEl) return;
      const instance = new PhotoSwipeLightbox({
        gallery: `#${resolvedId}`,
        children: "a[data-pswp-width]",
        counter: showCounter,
        pswpModule: () => import("photoswipe"),
      });

      instance.on("uiRegister", () => {
        if (showDownload) {
          instance.pswp?.ui?.registerElement({
            name: "download-button",
            order: 8,
            isButton: true,
            tagName: "a",
            html: '<span aria-hidden="true">⬇</span>',
            onInit: (el: HTMLElement) => {
              el.setAttribute("download", "");
              el.setAttribute("target", "_blank");
              el.setAttribute("rel", "noopener");
              el.setAttribute("aria-label", "Download image");
              instance.pswp?.on?.("change", () => {
                const src = instance.pswp?.currSlide?.data?.src;
                if (src) el.setAttribute("href", src);
              });
            },
          });
        }

        if (showCaptions) {
          instance.pswp?.ui?.registerElement({
            name: "custom-caption",
            order: 9,
            isButton: false,
            appendTo: "root",
            html: "",
            onInit: (el: HTMLElement) => {
              el.className = "pswp__custom-caption text-center text-white text-sm px-4 py-2 bg-black/50";
              instance.pswp?.on?.("change", () => {
                const slideEl = instance.pswp?.currSlide?.data?.element;
                const cap = slideEl?.getAttribute("data-pswp-caption") ?? "";
                el.textContent = cap;
                el.style.display = cap ? "block" : "none";
              });
            },
          });
        }
      });

      instance.init();
      lightbox = instance as unknown as typeof lightbox;
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
      data-pswp-caption={img.caption ?? img.alt}
      aria-label={img.caption ? undefined : img.alt}
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
