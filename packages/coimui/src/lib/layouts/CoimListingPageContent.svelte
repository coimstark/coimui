<script lang="ts">
  import CoimIcon from "../icons/CoimIcon.svelte";
  import CiSearch from "../icons/ui/CiSearch.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import { cn, isPathMatch } from "../utilities/utils.js";
  import type { CoimNavItem, NavigateFn, TranslateFn } from "./types.js";

  interface Props {
    items?: CoimNavItem[];
    currentPath: string;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    showSearch?: boolean;
    class?: string;
  }

  let {
    items = [],
    currentPath,
    onNavigate,
    translate = (k) => k,
    showSearch = true,
    class: className = "",
  }: Props = $props();

  let filterText = $state("");

  function findMenuItemByPath(menuItems: CoimNavItem[], path: string): CoimNavItem | undefined {
    for (const item of menuItems) {
      if (item.children && item.children.length > 0) {
        const nested = findMenuItemByPath(item.children, path);
        if (nested) return nested;
      }
      if (item.href && isPathMatch(path, item.href)) {
        return item;
      }
    }
    return undefined;
  }

  const activeParent = $derived(findMenuItemByPath(items, currentPath));

  const visibleChildren = $derived.by(() => {
    const raw = (activeParent?.children ?? []).filter((x) => !x.hideInMenu);
    const term = filterText.trim().toLowerCase();
    if (!term) return raw;
    return raw.filter((item) => {
      const label = translate(item.label).toLowerCase();
      const desc = item.description ? translate(item.description).toLowerCase() : "";
      return label.includes(term) || desc.includes(term);
    });
  });

  function handleCardClick(event: MouseEvent, item: CoimNavItem) {
    if (!item.href || item.isExternalLink || !onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(item.href);
  }
</script>

<div class={cn("flex w-full flex-col gap-5", className)}>
  {#if showSearch && (activeParent?.children?.length ?? 0) > 0}
    <div class="relative w-full">
      <span
        class="text-text-secondary pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
      >
        <CiSearch size="small" />
      </span>
      <input
        type="search"
        bind:value={filterText}
        aria-label="Filter items"
        placeholder="Filter..."
        class="bg-background-paper border-transparent focus:border-primary/40 text-text-primary placeholder:text-text-secondary h-11 w-full rounded-2xl border border-solid ps-10 pe-9 text-base shadow-xs outline-none transition-colors"
      />
      {#if filterText}
        <button
          type="button"
          aria-label="Clear filter"
          onclick={() => (filterText = "")}
          class="text-text-secondary hover:text-text-primary absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent"
        >
          <CiCross size="tiny" />
        </button>
      {/if}
    </div>
  {/if}

  <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    {#each visibleChildren as item, index (item.id)}
      <a
        href={item.href ?? "#"}
        target={item.isExternalLink ? "_blank" : undefined}
        rel={item.isExternalLink ? "noopener noreferrer" : undefined}
        onclick={(e) => handleCardClick(e, item)}
        class="bg-background-paper flex h-full flex-row items-center rounded-3xl p-1 shadow-xs transition-transform hover:scale-[1.02] no-underline"
      >
        {#if item.icon}
          <div
            class={cn(
              "flex h-24 w-16 flex-none items-center justify-center rounded-2xl",
              index % 2 === 0
                ? "bg-primary-light/10 text-primary"
                : "bg-secondary-light/10 text-secondary",
            )}
          >
            <CoimIcon icon={item.icon} size="large" />
          </div>
        {/if}

        <div class="flex min-w-0 flex-1 flex-col gap-1 px-4 py-4">
          <div class="font-heading text-text-primary text-base font-semibold">
            {translate(item.label)}
          </div>
          {#if item.description}
            <p class="font-body text-text-secondary m-0 line-clamp-2 text-sm">
              {translate(item.description)}
            </p>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</div>
