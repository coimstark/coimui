<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTableAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import {
    setTableContext,
    type TablePadding,
    type TableSize,
  } from "./table-context.svelte.js";

  interface Props extends Omit<HTMLTableAttributes, "class" | "children"> {
    stickyHeader?: boolean;
    size?: TableSize;
    padding?: TablePadding;
    noLeftPadding?: boolean;
    noRightPadding?: boolean;
    ariaLabel?: string;
    caption?: string | Snippet;
    captionId?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    stickyHeader = false,
    size = "medium",
    padding = "normal",
    noLeftPadding = false,
    noRightPadding = false,
    ariaLabel,
    caption,
    captionId,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  setTableContext({
    get size() {
      return size;
    },
    get stickyHeader() {
      return stickyHeader;
    },
    get padding() {
      return padding;
    },
  });
</script>

<table
  aria-label={ariaLabel}
  {...rest}
  class={cn(
    "coim-table w-full border-separate border-spacing-0",
    size === "small" && "coim-table-size-small",
    stickyHeader && "coim-table-sticky-header",
    noLeftPadding && "coim-table-no-left-padding",
    noRightPadding && "coim-table-no-right-padding",
    className,
  )}
>
  {#if caption !== undefined}
    <caption id={captionId} class="coim-visually-hidden">
      {#if typeof caption === "function"}
        {@render caption()}
      {:else}
        {caption}
      {/if}
    </caption>
  {/if}
  {@render children?.()}
</table>
