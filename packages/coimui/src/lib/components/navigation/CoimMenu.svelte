<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    label?: string;
    trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
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
</script>

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
  {:else}
    <DropdownMenu.Trigger class="coim-btn coim-btn-outlined coim-btn-size-medium coim-btn-color-primary">
      {label}
    </DropdownMenu.Trigger>
  {/if}

  <DropdownMenu.Portal>
    <DropdownMenu.Content
      {side}
      {align}
      {sideOffset}
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
