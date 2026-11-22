<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setTreeDepthContext, setTreeViewContext } from "./tree-context.svelte.js";

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, "class" | "children"> {
    expandedItems?: string[];
    defaultExpandedItems?: string[];
    selectedItems?: string[];
    defaultSelectedItems?: string[];
    multiSelect?: boolean;
    checkboxSelection?: boolean;
    size?: "medium" | "small";
    bordered?: boolean;
    expansionTrigger?: "content" | "iconContainer";
    onExpandedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onSelectedItemsChange?: (event: Event | null, itemIds: string[]) => void;
    onItemExpansionToggle?: (event: Event | null, itemId: string, isExpanded: boolean) => void;
    onItemClick?: (event: Event, itemId: string) => void;
    onItemLabelChange?: (itemId: string, newLabel: string) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    expandedItems = $bindable<string[]>([]),
    defaultExpandedItems,
    selectedItems = $bindable<string[]>([]),
    defaultSelectedItems,
    multiSelect = false,
    checkboxSelection = false,
    size = "medium",
    bordered = false,
    expansionTrigger = "content",
    onExpandedItemsChange,
    onSelectedItemsChange,
    onItemExpansionToggle,
    onItemClick,
    onItemLabelChange,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let initializedDefaults = false;
  $effect.pre(() => {
    if (initializedDefaults) return;
    initializedDefaults = true;
    untrack(() => {
      if (expandedItems.length === 0 && defaultExpandedItems && defaultExpandedItems.length > 0) {
        expandedItems = [...defaultExpandedItems];
      }
      if (selectedItems.length === 0 && defaultSelectedItems && defaultSelectedItems.length > 0) {
        selectedItems = multiSelect ? [...defaultSelectedItems] : [defaultSelectedItems[0]];
      }
    });
  });

  let rootEl = $state<HTMLUListElement | null>(null);
  let focusedId = $state<string | null>(null);

  function setExpandedState(id: string, nextExpanded: boolean, event: Event | null = null) {
    const exists = expandedItems.includes(id);
    if (exists === nextExpanded) return;
    const next = nextExpanded ? [...expandedItems, id] : expandedItems.filter((item) => item !== id);
    expandedItems = next;
    onItemExpansionToggle?.(event, id, nextExpanded);
    onExpandedItemsChange?.(event, next);
  }

  setTreeDepthContext(0);
  setTreeViewContext({
    get multiSelect() {
      return multiSelect;
    },
    get checkboxSelection() {
      return checkboxSelection;
    },
    get expansionTrigger() {
      return expansionTrigger;
    },
    get focusedId() {
      return focusedId;
    },
    getRootEl: () => rootEl,
    isExpanded: (id) => expandedItems.includes(id),
    isSelected: (id) => selectedItems.includes(id),
    isFocusable: (id, firstEligibleFallback) => {
      if (focusedId !== null) return focusedId === id;
      if (selectedItems.length > 0) return selectedItems[0] === id;
      return firstEligibleFallback();
    },
    setFocusedId: (id) => {
      focusedId = id;
    },
    toggleExpanded: (id, event) => {
      const nextExpanded = !expandedItems.includes(id);
      setExpandedState(id, nextExpanded, event ?? null);
    },
    setExpanded: (id, nextExpanded, event) => {
      setExpandedState(id, nextExpanded, event ?? null);
    },
    selectItem: (id, event, options) => {
      const ctrlOrMeta =
        event instanceof MouseEvent || event instanceof KeyboardEvent
          ? event.ctrlKey || event.metaKey
          : false;
      let next: string[];
      if (multiSelect && (checkboxSelection || options?.toggle || ctrlOrMeta)) {
        next = selectedItems.includes(id)
          ? selectedItems.filter((item) => item !== id)
          : [...selectedItems, id];
      } else {
        next = [id];
      }
      selectedItems = next;
      onSelectedItemsChange?.(event ?? null, next);
    },
    notifyItemClick: (event, id) => {
      onItemClick?.(event, id);
    },
    notifyLabelChange: (id, label) => {
      onItemLabelChange?.(id, label);
    },
  });
</script>

<ul
  bind:this={rootEl}
  role="tree"
  aria-multiselectable={multiSelect || undefined}
  class={cn(
    "coim-tree-view",
    size === "small" && "coim-tree-small",
    bordered && "bordered",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</ul>
