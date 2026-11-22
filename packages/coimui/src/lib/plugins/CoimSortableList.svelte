<script lang="ts" generics="TItem extends CoimSortableItem = CoimSortableItem">
  import type { Snippet } from "svelte";
  import CiArrowDown from "../icons/ui/CiArrowDown.svelte";
  import CiArrowUp from "../icons/ui/CiArrowUp.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimSortableItem, CoimSortableListProps } from "./types.js";

  type Props = CoimSortableListProps<TItem>;

  let {
    items = $bindable<TItem[]>([]),
    ariaLabel = "Sortable list",
    onReorder,
    itemContent,
    class: className = "",
  }: Props = $props();

  let listEl = $state<HTMLUListElement | null>(null);
  let announcement = $state("");

  function moveItem(fromIndex: number, toIndex: number) {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= items.length ||
      toIndex >= items.length ||
      fromIndex === toIndex
    ) {
      return;
    }
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    items = next;
    announcement = `Moved ${moved.label} to position ${toIndex + 1} of ${next.length}`;
    onReorder?.(next);
  }

  $effect(() => {
    if (typeof window === "undefined" || !listEl) return;
    let cleanups: Array<() => void> = [];
    let cancelled = false;

    void import("@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter").then(
      ({ draggable, dropTargetForElements }) => {
        if (cancelled || !listEl) return;
        const rows = Array.from(listEl.querySelectorAll<HTMLLIElement>("li[data-sort-id]"));
        for (const rowEl of rows) {
          const id = rowEl.dataset.sortId;
          if (!id) continue;
          cleanups.push(
            draggable({
              element: rowEl,
              getInitialData: () => ({ id }),
            }),
            dropTargetForElements({
              element: rowEl,
              onDrop: ({ source }) => {
                const sourceId = source.data?.id as string | undefined;
                if (!sourceId || sourceId === id) return;
                const fromIdx = items.findIndex((i) => i.id === sourceId);
                const toIdx = items.findIndex((i) => i.id === id);
                moveItem(fromIdx, toIdx);
              },
            }),
          );
        }
      },
    );

    return () => {
      cancelled = true;
      for (const dispose of cleanups) dispose();
      cleanups = [];
    };
  });
</script>

<div>
  <div class="sr-only" aria-live="polite">{announcement}</div>
  <ul bind:this={listEl} aria-label={ariaLabel} class={cn("coim-sortable-list", className)}>
    {#each items as item, idx (item.id)}
      <li
        data-sort-id={item.id}
        class={cn("coim-sortable-item", item.disabled && "opacity-disabled")}
      >
        <div class="min-w-0 flex-1">
          {#if itemContent}
            {@render itemContent(item, idx)}
          {:else}
            <div class="font-medium">{item.label}</div>
            {#if item.description}
              <div class="text-text-secondary text-sm">{item.description}</div>
            {/if}
          {/if}
        </div>

        <div class="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={item.disabled || idx === 0}
            aria-label={`Move ${item.label} up`}
            class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
            onclick={() => moveItem(idx, idx - 1)}
          >
            <CiArrowUp size="small" />
          </button>
          <button
            type="button"
            disabled={item.disabled || idx === items.length - 1}
            aria-label={`Move ${item.label} down`}
            class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
            onclick={() => moveItem(idx, idx + 1)}
          >
            <CiArrowDown size="small" />
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
