<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    orientation?: "horizontal" | "vertical";
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    orientation = "horizontal",
    ariaLabel = "Toolbar",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let toolbarEl = $state<HTMLDivElement | null>(null);

  function getFocusableItems(): HTMLElement[] {
    if (!toolbarEl) return [];
    return Array.from(
      toolbarEl.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), [role="button"]:not([aria-disabled="true"])',
      ),
    ).filter((el) => !el.hidden);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const items = getFocusableItems();
    if (items.length === 0) return;

    const current = document.activeElement as HTMLElement | null;
    const index = current ? items.indexOf(current) : -1;
    const isHorizontal = orientation === "horizontal";

    let nextIndex = -1;
    if ((isHorizontal && event.key === "ArrowRight") || (!isHorizontal && event.key === "ArrowDown")) {
      nextIndex = index >= 0 ? (index + 1) % items.length : 0;
    } else if (
      (isHorizontal && event.key === "ArrowLeft") ||
      (!isHorizontal && event.key === "ArrowUp")
    ) {
      nextIndex = index >= 0 ? (index - 1 + items.length) % items.length : items.length - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex >= 0) {
      event.preventDefault();
      for (let i = 0; i < items.length; i += 1) {
        items[i].tabIndex = i === nextIndex ? 0 : -1;
      }
      items[nextIndex].focus();
    }
  }
</script>

<div
  bind:this={toolbarEl}
  role="toolbar"
  aria-orientation={orientation}
  aria-label={ariaLabel}
  onkeydown={handleKeyDown}
  class={cn(
    "coim-toolbar inline-flex items-center gap-1 rounded-md border border-grey-100 bg-background-paper p-1",
    orientation === "vertical" && "flex-col items-stretch",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
