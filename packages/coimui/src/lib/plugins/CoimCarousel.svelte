<script lang="ts">
  import type { Snippet } from "svelte";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimCarouselItem } from "./types.js";

  interface Props {
    items?: CoimCarouselItem[];
    slidesPerView?: number;
    spaceBetween?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayDelayMs?: number;
    navigation?: boolean;
    pagination?: boolean;
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    items = [],
    slidesPerView = 1,
    spaceBetween = 16,
    loop = false,
    autoplay = false,
    autoplayDelayMs = 4000,
    navigation = true,
    pagination = true,
    ariaLabel = "Carousel",
    class: className = "",
    children,
  }: Props = $props();

  let containerEl = $state<HTMLDivElement | null>(null);
  let prevEl = $state<HTMLButtonElement | null>(null);
  let nextEl = $state<HTMLButtonElement | null>(null);
  let pagEl = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (typeof window === "undefined" || !containerEl) return;
    let instance: { destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void } | null = null;
    let cancelled = false;

    void (async () => {
      await Promise.all([
        import("swiper/css"),
        import("swiper/css/navigation"),
        import("swiper/css/pagination"),
      ]);
      const [{ default: Swiper }, { Navigation, Pagination, Autoplay }] = await Promise.all([
        import("swiper"),
        import("swiper/modules"),
      ]);
      if (cancelled || !containerEl) return;

      instance = new Swiper(containerEl, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView,
        spaceBetween,
        loop,
        autoplay: autoplay ? { delay: autoplayDelayMs, disableOnInteraction: false } : false,
        navigation: navigation && prevEl && nextEl ? { prevEl, nextEl } : false,
        pagination: pagination && pagEl ? { el: pagEl, clickable: true } : false,
      });
    })();

    return () => {
      cancelled = true;
      instance?.destroy(true, true);
      instance = null;
    };
  });
</script>

<div class={cn("coim-carousel", className)} role="region" aria-roledescription="carousel" aria-label={ariaLabel}>
  <div bind:this={containerEl} class="swiper">
    <div class="swiper-wrapper">
      {#if items.length > 0}
        {#each items as slide (slide.id)}
          <div class="swiper-slide">
            {#if slide.content}
              {@render slide.content()}
            {:else}
              <div class="bg-grey-25 border-grey-100 rounded-lg border p-6">
                {#if slide.imageSrc}
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt ?? slide.title ?? "Slide image"}
                    class="mb-3 h-48 w-full rounded object-cover"
                  />
                {/if}
                {#if slide.title}
                  <div class="font-heading text-base font-semibold">{slide.title}</div>
                {/if}
                {#if slide.subtitle}
                  <p class="text-text-secondary mt-1 text-sm">{slide.subtitle}</p>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      {:else if children}
        {@render children()}
      {/if}
    </div>

    {#if pagination}
      <div bind:this={pagEl} class="swiper-pagination mt-2"></div>
    {/if}
  </div>

  {#if navigation}
    <button
      bind:this={prevEl}
      type="button"
      aria-label="Previous slide"
      class="coim-carousel-nav-btn start-2"
    >
      <CiChevronLeftSmall size="small" />
    </button>
    <button
      bind:this={nextEl}
      type="button"
      aria-label="Next slide"
      class="coim-carousel-nav-btn end-2"
    >
      <CiChevronRightSmall size="small" />
    </button>
  {/if}
</div>
