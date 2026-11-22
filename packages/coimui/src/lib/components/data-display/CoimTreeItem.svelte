<script lang="ts">
  import { tick, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CiCheck from "../../icons/ui/CiCheck.svelte";
  import CiCheckSquare from "../../icons/ui/CiCheckSquare.svelte";
  import CiChevronDownSmall from "../../icons/ui/CiChevronDownSmall.svelte";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../../utilities/utils.js";
  import {
    getTreeDepthContext,
    getTreeViewContext,
    setTreeDepthContext,
  } from "./tree-context.svelte.js";

  interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "class" | "children"> {
    itemId: string;
    label: string;
    disabled?: boolean;
    editable?: boolean;
    hasChildren?: boolean;
    icon?: Snippet;
    labelSnippet?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let {
    itemId,
    label,
    disabled = false,
    editable = false,
    hasChildren: hasChildrenProp,
    icon,
    labelSnippet,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const treeCtx = getTreeViewContext();
  const depth = getTreeDepthContext();
  setTreeDepthContext(depth + 1);

  let itemEl = $state<HTMLLIElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);
  let editing = $state(false);
  let draftLabel = $state("");

  const hasChildren = $derived(Boolean(children) || Boolean(hasChildrenProp));
  const isExpanded = $derived(treeCtx.isExpanded(itemId));
  const isSelected = $derived(treeCtx.isSelected(itemId));
  const isFocused = $derived(treeCtx.focusedId === itemId);

  function getVisibleTreeItems(): HTMLLIElement[] {
    const root = treeCtx.getRootEl();
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLLIElement>('[role="treeitem"]')).filter(
      (el) => !el.closest("[hidden]") && el.getAttribute("aria-disabled") !== "true",
    );
  }

  const isFocusable = $derived(
    !disabled &&
      treeCtx.isFocusable(itemId, () => {
        const root = treeCtx.getRootEl();
        if (!root) return depth === 0;
        const first = getVisibleTreeItems()[0];
        return first === itemEl || (first === undefined && depth === 0);
      }),
  );

  function focusItem(el: HTMLLIElement | null | undefined) {
    if (!el) return;
    const id = el.dataset.itemId ?? null;
    treeCtx.setFocusedId(id);
    el.focus();
  }

  function startEditing() {
    if (!editable || disabled) return;
    draftLabel = label;
    editing = true;
    void tick().then(() => {
      inputEl?.focus();
      inputEl?.select();
    });
  }

  function commitEditing() {
    if (!editing) return;
    editing = false;
    const next = draftLabel.trim();
    if (next && next !== label) {
      treeCtx.notifyLabelChange(itemId, next);
    }
    void tick().then(() => itemEl?.focus());
  }

  function cancelEditing() {
    editing = false;
    draftLabel = label;
    void tick().then(() => itemEl?.focus());
  }

  function handleContentClick(event: MouseEvent) {
    if (disabled || editing) return;
    treeCtx.setFocusedId(itemId);
    itemEl?.focus();
    if (treeCtx.expansionTrigger === "content" && hasChildren) {
      treeCtx.toggleExpanded(itemId, event);
    }
    treeCtx.selectItem(itemId, event);
    treeCtx.notifyItemClick(event, itemId);
  }

  function handleIconClick(event: MouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    treeCtx.setFocusedId(itemId);
    if (hasChildren) {
      treeCtx.toggleExpanded(itemId, event);
    }
  }

  function handleCheckboxClick(event: MouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    treeCtx.setFocusedId(itemId);
    treeCtx.selectItem(itemId, event, { toggle: true });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || editing) return;
    const items = getVisibleTreeItems();
    const index = itemEl ? items.indexOf(itemEl) : -1;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        event.stopPropagation();
        if (index >= 0 && index + 1 < items.length) {
          focusItem(items[index + 1]);
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        event.stopPropagation();
        if (index > 0) {
          focusItem(items[index - 1]);
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        event.stopPropagation();
        if (hasChildren && !isExpanded) {
          treeCtx.setExpanded(itemId, true, event);
        } else if (hasChildren && isExpanded && itemEl) {
          const firstChild = itemEl.querySelector<HTMLLIElement>(
            ':scope > .coim-tree-group > [role="treeitem"]:not([aria-disabled="true"])',
          );
          focusItem(firstChild);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        event.stopPropagation();
        if (hasChildren && isExpanded) {
          treeCtx.setExpanded(itemId, false, event);
        } else if (itemEl) {
          const parentItem = itemEl.parentElement?.closest<HTMLLIElement>('[role="treeitem"]');
          if (parentItem && parentItem.getAttribute("aria-disabled") !== "true") {
            focusItem(parentItem);
          }
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        event.stopPropagation();
        focusItem(items[0]);
        break;
      }
      case "End": {
        event.preventDefault();
        event.stopPropagation();
        focusItem(items[items.length - 1]);
        break;
      }
      case "Enter": {
        event.preventDefault();
        event.stopPropagation();
        treeCtx.selectItem(itemId, event);
        if (hasChildren && treeCtx.expansionTrigger === "content") {
          treeCtx.toggleExpanded(itemId, event);
        }
        treeCtx.notifyItemClick(event, itemId);
        break;
      }
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        treeCtx.selectItem(itemId, event, { toggle: treeCtx.checkboxSelection });
        treeCtx.notifyItemClick(event, itemId);
        break;
      }
      case "F2": {
        if (editable) {
          event.preventDefault();
          event.stopPropagation();
          startEditing();
        }
        break;
      }
      default:
        break;
    }
  }
</script>

<li
  bind:this={itemEl}
  role="treeitem"
  tabindex={isFocusable ? 0 : -1}
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-selected={isSelected}
  aria-disabled={disabled || undefined}
  data-item-id={itemId}
  onfocus={(e) => {
    e.stopPropagation();
    if (!disabled) treeCtx.setFocusedId(itemId);
  }}
  onkeydown={handleKeyDown}
  class={cn("coim-tree-item", className)}
  {...rest}
>
  <div
    role="none"
    class="coim-tree-item-content"
    style={`--coim-tree-depth: ${depth}`}
    data-selected={isSelected ? "true" : undefined}
    data-expanded={hasChildren && isExpanded ? "true" : undefined}
    data-focused={isFocused ? "true" : undefined}
    onclick={handleContentClick}
    ondblclick={(e) => {
      if (!editable) return;
      e.stopPropagation();
      startEditing();
    }}
  >
    {#if hasChildren}
      <button
        type="button"
        tabindex={-1}
        aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
        class="coim-tree-item-icon"
        onclick={handleIconClick}
      >
        {#if isExpanded}
          <CiChevronDownSmall size="small" />
        {:else}
          <CiChevronRightSmall size="small" />
        {/if}
      </button>
    {:else if icon}
      <span class="coim-tree-item-icon" aria-hidden="true">
        {@render icon()}
      </span>
    {:else}
      <span class="coim-tree-item-icon" aria-hidden="true"></span>
    {/if}

    {#if treeCtx.checkboxSelection}
      <button
        type="button"
        tabindex={-1}
        aria-label={`Select ${label}`}
        aria-pressed={isSelected}
        class="coim-tree-item-checkbox"
        onclick={handleCheckboxClick}
      >
        {#if isSelected}
          <CiCheckSquare size="small" variant="contained" />
        {:else}
          <CiCheck size="small" class="opacity-30" />
        {/if}
      </button>
    {/if}

    {#if editing}
      <input
        bind:this={inputEl}
        type="text"
        bind:value={draftLabel}
        aria-label={`Edit ${label}`}
        class="coim-tree-item-input"
        onclick={(e) => e.stopPropagation()}
        onblur={commitEditing}
        onkeydown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            commitEditing();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEditing();
          }
        }}
      />
    {:else if labelSnippet}
      <span class="coim-tree-item-label">
        {@render labelSnippet()}
      </span>
    {:else}
      <span class="coim-tree-item-label">{label}</span>
    {/if}
  </div>

  {#if children}
    <ul role="group" class="coim-tree-group" hidden={!isExpanded}>
      {@render children()}
    </ul>
  {/if}
</li>
