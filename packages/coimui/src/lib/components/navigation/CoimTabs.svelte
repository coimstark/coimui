<script lang="ts">
  import { Tabs } from "bits-ui";
  import type { Snippet } from "svelte";
  import CiChevronLeftSmall from "../../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { setTabsContext } from "./context.js";
  import CoimTab from "./CoimTab.svelte";
  import CoimTabPanel from "./CoimTabPanel.svelte";
  import type { CoimTabOption, CoimTabsSize, CoimTabsVariant } from "./types.js";

  interface Props {
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: "horizontal" | "vertical";
    variant?: CoimTabsVariant;
    centered?: boolean;
    scrollButtons?: boolean;
    hairline?: boolean;
    size?: CoimTabsSize;
    color?: CoimColor;
    loop?: boolean;
    activationMode?: "automatic" | "manual";
    disabled?: boolean;
    items?: CoimTabOption[];
    tabs?: Snippet;
    ariaLabel?: string;
    class?: string;
    listClass?: string;
    children?: Snippet;
  }

  let {
    value = $bindable(""),
    onValueChange,
    orientation = "horizontal",
    variant = "standard",
    centered = false,
    scrollButtons = false,
    hairline = false,
    size = "medium",
    color = "primary",
    loop = true,
    activationMode = "automatic",
    disabled = false,
    items,
    tabs,
    ariaLabel,
    class: className = "",
    listClass = "",
    children,
  }: Props = $props();

  let listEl = $state<HTMLDivElement | null>(null);

  setTabsContext({
    get color() {
      return color;
    },
    get size() {
      return size;
    },
    get hairline() {
      return hairline;
    },
  });

  function scrollList(delta: number) {
    if (!listEl) return;
    if (typeof listEl.scrollBy === "function") {
      listEl.scrollBy({ left: delta, behavior: "smooth" });
    } else {
      listEl.scrollLeft += delta;
    }
  }
</script>

<Tabs.Root
  bind:value
  onValueChange={(next: string) => {
    value = next;
    onValueChange?.(next);
  }}
  {orientation}
  {loop}
  {activationMode}
  {disabled}
  class={cn(
    "coim-tabs-root",
    `coim-tabs-color-${color}`,
    orientation === "vertical" && "coim-tabs-root-vertical",
    hairline && "coim-tabs-hairline",
    className,
  )}
>
  <div class="coim-tabs-scroller-wrapper">
    {#if variant === "scrollable" && scrollButtons && orientation === "horizontal"}
      <button
        type="button"
        aria-label="Scroll tabs left"
        class="coim-tabs-scroll-button"
        onclick={() => scrollList(-160)}
      >
        <CiChevronLeftSmall size="small" />
      </button>
    {/if}

    <div bind:this={listEl} class={cn("min-w-0 flex-1", variant === "scrollable" && "coim-tabs-list-scrollable")}>
      <Tabs.List
        aria-label={ariaLabel}
        class={cn(
          "coim-tabs-list",
          orientation === "vertical" && "coim-tabs-list-vertical",
          variant === "fullWidth" && "coim-tabs-list-fullwidth",
          centered && orientation === "horizontal" && "coim-tabs-list-centered",
          listClass,
        )}
      >
        {#if items && items.length > 0}
          {#each items as item (item.value)}
            <CoimTab
              value={item.value}
              label={item.label}
              disabled={item.disabled}
              icon={item.icon}
            />
          {/each}
        {:else if tabs}
          {@render tabs()}
        {:else if children}
          {@render children()}
        {/if}
      </Tabs.List>
    </div>

    {#if variant === "scrollable" && scrollButtons && orientation === "horizontal"}
      <button
        type="button"
        aria-label="Scroll tabs right"
        class="coim-tabs-scroll-button"
        onclick={() => scrollList(160)}
      >
        <CiChevronRightSmall size="small" />
      </button>
    {/if}
  </div>

  {#if items && items.length > 0}
    {#each items as item (item.value)}
      {#if item.content}
        <CoimTabPanel value={item.value}>
          {@render item.content()}
        </CoimTabPanel>
      {/if}
    {/each}
  {:else if tabs && children}
    {@render children()}
  {/if}
</Tabs.Root>
