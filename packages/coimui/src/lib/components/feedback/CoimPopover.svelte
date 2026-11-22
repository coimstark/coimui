<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import type { PopoverAnchorOrigin } from "./types.js";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    anchorEl?: HTMLElement | null;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    anchorOrigin?: PopoverAnchorOrigin;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    openOnHover?: boolean;
    openDelay?: number;
    closeDelay?: number;
    disablePortal?: boolean;
    arrow?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = $bindable(false),
    onOpenChange,
    onClose,
    anchorEl = null,
    trigger,
    anchorOrigin,
    side,
    align,
    sideOffset = 6,
    alignOffset = 0,
    openOnHover = false,
    openDelay,
    closeDelay,
    disablePortal = false,
    arrow = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const resolvedSide = $derived.by(() => {
    if (side) return side;
    if (anchorOrigin?.vertical === "top") return "top";
    return "bottom";
  });

  const resolvedAlign = $derived.by(() => {
    if (align) return align;
    if (anchorOrigin?.horizontal === "right") return "end";
    if (anchorOrigin?.horizontal === "center") return "center";
    return "start";
  });

  function handleOpenChange(next: boolean) {
    open = next;
    onOpenChange?.(next);
    if (!next) {
      onClose?.();
    }
  }

  const contentClass = $derived(
    cn(
      "coim-popover bg-background-paper border-grey-100 text-text-primary shadow-darker-sm z-100 rounded-lg border border-solid p-4 outline-none",
      className,
    ),
  );
</script>

<Popover.Root bind:open onOpenChange={handleOpenChange}>
  {#if trigger}
    <Popover.Trigger {openOnHover} {openDelay} {closeDelay}>
      {#snippet child({ props })}
        {@render trigger({ props })}
      {/snippet}
    </Popover.Trigger>
  {/if}

  {#if disablePortal}
    <Popover.Content
      customAnchor={trigger ? undefined : (anchorEl ?? undefined)}
      side={resolvedSide}
      align={resolvedAlign}
      {sideOffset}
      {alignOffset}
      class={contentClass}
      {...rest}
    >
      {#if arrow}
        <Popover.Arrow class="text-background-paper fill-current" />
      {/if}
      {@render children?.()}
    </Popover.Content>
  {:else}
    <Popover.Portal>
      <Popover.Content
        customAnchor={trigger ? undefined : (anchorEl ?? undefined)}
        side={resolvedSide}
        align={resolvedAlign}
        {sideOffset}
        {alignOffset}
        class={contentClass}
        {...rest}
      >
        {#if arrow}
          <Popover.Arrow class="text-background-paper fill-current" />
        {/if}
        {@render children?.()}
      </Popover.Content>
    </Popover.Portal>
  {/if}
</Popover.Root>
