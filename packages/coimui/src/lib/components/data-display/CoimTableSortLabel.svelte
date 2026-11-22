<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import CiArrowUp from "../../icons/ui/CiArrowUp.svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetTableCellSortContext } from "./table-context.svelte.js";

  interface Props extends Omit<HTMLButtonAttributes, "class" | "children"> {
    active?: boolean;
    direction?: "asc" | "desc";
    hideSortIcon?: boolean;
    icon?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let {
    active = false,
    direction = "asc",
    hideSortIcon = false,
    icon,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const cellSortCtx = tryGetTableCellSortContext();

  $effect(() => {
    if (!cellSortCtx) return;
    cellSortCtx.setSortDirection(
      active ? (direction === "desc" ? "descending" : "ascending") : undefined,
    );
    return () => {
      cellSortCtx.setSortDirection(undefined);
    };
  });
</script>

<button
  {...rest}
  type="button"
  data-active={active ? "true" : undefined}
  data-direction={active ? direction : undefined}
  class={cn("coim-table-sort-button", active && "is-active", className)}
>
  <span>{@render children?.()}</span>
  {#if !hideSortIcon}
    <span class="coim-table-sort-icon" aria-hidden="true">
      {#if icon}
        {@render icon()}
      {:else}
        <CiArrowUp size="small" aria-hidden="true" />
      {/if}
    </span>
  {/if}
</button>
