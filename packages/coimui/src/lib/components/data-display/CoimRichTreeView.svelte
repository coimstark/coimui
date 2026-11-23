<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CoimSimpleTreeView from "./CoimSimpleTreeView.svelte";
  import CoimTreeItem from "./CoimTreeItem.svelte";
  import { moveTreeItemSibling, reorderTreeItems } from "./tree-context.svelte.js";
  import type {
    CoimTreeItemData,
    CoimTreeReorderDetail,
    CoimTreeReorderPosition,
  } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, "class" | "children"> {
    items: CoimTreeItemData[];
    expandedItems?: string[];
    defaultExpandedItems?: string[];
    selectedItems?: string[];
    defaultSelectedItems?: string[];
    multiSelect?: boolean;
    checkboxSelection?: boolean;
    reorderable?: boolean;
    canMoveItem?: (sourceId: string, targetId: string, position: CoimTreeReorderPosition) => boolean;
    size?: "medium" | "small";
    bordered?: boolean;
    expansionTrigger?: "content" | "iconContainer";
    itemSnippet?: Snippet<[CoimTreeItemData]>;
    onExpandedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onSelectedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onItemExpansionToggle?: (event: Event | null, itemId: string, isExpanded: boolean) => void;
    onItemClick?: (event: Event, itemId: string) => void;
    onItemLabelChange?: (itemId: string, newLabel: string) => void;
    onItemOrderChange?: (nextItems: CoimTreeItemData[], detail: CoimTreeReorderDetail) => void;
    class?: string;
  }

  let {
    items = $bindable<CoimTreeItemData[]>(),
    expandedItems = $bindable<string[]>([]),
    defaultExpandedItems,
    selectedItems = $bindable<string[]>([]),
    defaultSelectedItems,
    multiSelect = false,
    checkboxSelection = false,
    reorderable = false,
    canMoveItem,
    size = "medium",
    bordered = false,
    expansionTrigger = "content",
    itemSnippet,
    onExpandedItemsChange,
    onSelectedItemsChange,
    onItemExpansionToggle,
    onItemClick,
    onItemLabelChange,
    onItemOrderChange,
    class: className = "",
    ...rest
  }: Props = $props();

  function handleMoveItem(sourceId: string, targetId: string, position: CoimTreeReorderPosition) {
    if (!reorderable || sourceId === targetId) return;
    if (canMoveItem && !canMoveItem(sourceId, targetId, position)) return;
    const next = reorderTreeItems(items, sourceId, targetId, position);
    if (next === items) return;
    items = next;
    onItemOrderChange?.(next, { itemId: sourceId, targetId, position });
  }

  function handleReorderByOffset(itemId: string, offset: -1 | 1) {
    if (!reorderable) return;
    const res = moveTreeItemSibling(items, itemId, offset);
    if (!res) return;
    if (canMoveItem && !canMoveItem(res.detail.itemId, res.detail.targetId, res.detail.position)) {
      return;
    }
    items = res.nextItems;
    onItemOrderChange?.(res.nextItems, res.detail);
  }
</script>

{#snippet renderNodes(nodes: CoimTreeItemData[])}
  {#each nodes as node (node.id)}
    <CoimTreeItem
      itemId={node.id}
      label={node.label}
      disabled={node.disabled}
      editable={node.editable}
      icon={node.icon}
      hasChildren={Boolean(node.children && node.children.length > 0)}
    >
      {#snippet labelSnippet()}
        {#if itemSnippet}
          {@render itemSnippet(node)}
        {:else}
          {node.label}
        {/if}
      {/snippet}
      {#if node.children && node.children.length > 0}
        {@render renderNodes(node.children)}
      {/if}
    </CoimTreeItem>
  {/each}
{/snippet}

<CoimSimpleTreeView
  bind:expandedItems
  {defaultExpandedItems}
  bind:selectedItems
  {defaultSelectedItems}
  {multiSelect}
  {checkboxSelection}
  {reorderable}
  {size}
  {bordered}
  {expansionTrigger}
  {onExpandedItemsChange}
  {onSelectedItemsChange}
  {onItemExpansionToggle}
  {onItemClick}
  {onItemLabelChange}
  onMoveItem={handleMoveItem}
  onReorderByOffset={handleReorderByOffset}
  class={className}
  {...rest}
>
  {@render renderNodes(items)}
</CoimSimpleTreeView>
