<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    label?: string;
    trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
    anchorPosition?: { x: number; y: number } | null;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    outlined?: boolean;
    dense?: boolean;
    dir?: "ltr" | "rtl";
    loop?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    onOpenChange,
    label = "Open menu",
    trigger,
    anchorPosition = null,
    side = "bottom",
    align = "start",
    sideOffset = 4,
    outlined = false,
    dense = false,
    dir = "ltr",
    loop = true,
    class: className = "",
    children,
  }: Props = $props();

  let positionAnchorEl = $state<HTMLDivElement | null>(null);
</script>

{#if anchorPosition}
  <div
    bind:this={positionAnchorEl}
    aria-hidden="true"
    style={`position: fixed; left: ${anchorPosition.x}px; top: ${anchorPosition.y}px; width: 1px; height: 1px; pointer-events: none; z-index: -1;`}
  ></div>
{/if}

<DropdownMenu.Root
  bind:open
  {dir}
  onOpenChange={(next: boolean) => {
    open = next;
    onOpenChange?.(next);
  }}
>
  {#if trigger}
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        {@render trigger({ props, open })}
      {/snippet}
    </DropdownMenu.Trigger>
  {:else if !anchorPosition}
    <DropdownMenu.Trigger class="coim-btn coim-btn-outlined coim-btn-size-medium coim-btn-color-primary">
      {label}
    </DropdownMenu.Trigger>
  {/if}

  <DropdownMenu.Portal>
    <DropdownMenu.Content
      customAnchor={anchorPosition ? (positionAnchorEl ?? undefined) : undefined}
      {side}
      {align}
      sideOffset={anchorPosition ? 0 : sideOffset}
      {loop}
      class={cn(
        "coim-menu-paper",
        outlined && "outlined",
        dense && "coim-menu-dense",
        className,
      )}
    >
      {#if children}
        {@render children()}
      {/if}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
