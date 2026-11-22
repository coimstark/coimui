<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CoimSimpleTreeView from "./CoimSimpleTreeView.svelte";
  import CoimTreeItem from "./CoimTreeItem.svelte";
  import type { CoimTreeItemData } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, "class" | "children"> {
    items: CoimTreeItemData[];
    expandedItems?: string[];
    defaultExpandedItems?: string[];
    selectedItems?: string[];
    defaultSelectedItems?: string[];
    multiSelect?: boolean;
    checkboxSelection?: boolean;
    size?: "medium" | "small";
    bordered?: boolean;
    expansionTrigger?: "content" | "iconContainer";
    itemSnippet?: Snippet<[CoimTreeItemData]>;
    onExpandedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onSelectedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onItemExpansionToggle?: (event: Event | null, itemId: string, isExpanded: boolean) => void;
    onItemClick?: (event: Event, itemId: string) => void;
    onItemLabelChange?: (itemId: string, newLabel: string) => void;
    class?: string;
  }

  let {
    items,
    expandedItems = $bindable<string[]>([]),
    defaultExpandedItems,
    selectedItems = $bindable<string[]>([]),
    defaultSelectedItems,
    multiSelect = false,
    checkboxSelection = false,
    size = "medium",
    bordered = false,
    expansionTrigger = "content",
    itemSnippet,
    onExpandedItemsChange,
    onSelectedItemsChange,
    onItemExpansionToggle,
    onItemClick,
    onItemLabelChange,
    class: className = "",
    ...rest
  }: Props = $props();
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
  {size}
  {bordered}
  {expansionTrigger}
  {onExpandedItemsChange}
  {onSelectedItemsChange}
  {onItemExpansionToggle}
  {onItemClick}
  {onItemLabelChange}
  class={className}
  {...rest}
>
  {@render renderNodes(items)}
</CoimSimpleTreeView>
