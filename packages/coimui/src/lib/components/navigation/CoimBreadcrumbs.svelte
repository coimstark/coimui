<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CiEllipsisHorizontal from "../../icons/ui/CiEllipsisHorizontal.svelte";
  import { cn } from "../../utilities/utils.js";
  import type { CoimBreadcrumbItem } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    items?: CoimBreadcrumbItem[];
    separator?: string | Snippet;
    maxItems?: number;
    itemsBeforeCollapse?: number;
    itemsAfterCollapse?: number;
    expandLabel?: string;
    ariaLabel?: string;
    onNavigate?: (href: string) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    items = [],
    separator = "/",
    maxItems = 8,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    expandLabel = "Show path",
    ariaLabel = "Breadcrumb",
    onNavigate,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let expanded = $state(false);

  const shouldCollapse = $derived(
    !expanded && items.length > maxItems && itemsBeforeCollapse + itemsAfterCollapse < items.length,
  );

  const displayEntries = $derived.by(() => {
    if (!shouldCollapse) {
      return items.map((item, idx) => ({
        kind: "item" as const,
        item,
        isLast: idx === items.length - 1,
        key: item.id ?? `${idx}-${item.label}`,
      }));
    }

    const head = items.slice(0, itemsBeforeCollapse).map((item, idx) => ({
      kind: "item" as const,
      item,
      isLast: false,
      key: item.id ?? `head-${idx}-${item.label}`,
    }));
    const tailStart = items.length - itemsAfterCollapse;
    const tail = items.slice(tailStart).map((item, idx) => ({
      kind: "item" as const,
      item,
      isLast: idx === itemsAfterCollapse - 1,
      key: item.id ?? `tail-${idx}-${item.label}`,
    }));

    return [
      ...head,
      { kind: "ellipsis" as const, key: "collapsed-ellipsis" },
      ...tail,
    ];
  });

  function handleAnchorClick(event: MouseEvent, href: string) {
    if (!onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  }
</script>

<nav aria-label={ariaLabel} class={className} {...rest}>
  <ol class="coim-breadcrumbs-ol">
    {#if items.length > 0}
      {#each displayEntries as entry, index (entry.key)}
        {#if index > 0}
          <li aria-hidden="true" class="coim-breadcrumbs-separator">
            {#if typeof separator === "string"}
              {separator}
            {:else}
              {@render separator()}
            {/if}
          </li>
        {/if}

        {#if entry.kind === "ellipsis"}
          <li class="coim-breadcrumbs-li">
            <button
              type="button"
              aria-label={expandLabel}
              class="coim-breadcrumbs-expand"
              onclick={() => {
                expanded = true;
              }}
            >
              <CiEllipsisHorizontal size="small" />
            </button>
          </li>
        {:else if entry.item.href && !entry.isLast}
          <li class="coim-breadcrumbs-li">
            <a
              href={entry.item.href}
              class="inline-flex items-center gap-1"
              onclick={(e) => handleAnchorClick(e, entry.item.href!)}
            >
              {#if entry.item.icon}
                {@render entry.item.icon()}
              {/if}
              <span>{entry.item.label}</span>
            </a>
          </li>
        {:else}
          <li
            class={cn("coim-breadcrumbs-li gap-1", entry.isLast && "text-text-primary")}
            aria-current={entry.isLast ? "page" : undefined}
          >
            {#if entry.item.icon}
              {@render entry.item.icon()}
            {/if}
            <span>{entry.item.label}</span>
          </li>
        {/if}
      {/each}
    {:else if children}
      {@render children()}
    {/if}
  </ol>
</nav>
