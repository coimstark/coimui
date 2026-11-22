<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import CiPlus from "../../icons/ui/CiPlus.svelte";
  import { clickAway } from "../../utilities/click-away/click-away.js";
  import { cn } from "../../utilities/utils.js";
  import { setSpeedDialContext } from "./context.js";

  interface Props {
    open?: boolean;
    ariaLabel?: string;
    direction?: "up" | "down" | "left" | "right";
    disabled?: boolean;
    icon?: Snippet;
    openIcon?: Snippet;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: Snippet;
  }

  const uid = $props.id();

  let {
    open = $bindable(false),
    ariaLabel = "SpeedDial",
    direction = "up",
    disabled = false,
    icon,
    openIcon,
    onOpenChange,
    class: className = "",
    children,
  }: Props = $props();

  const actionsId = `coim-speed-dial-actions-${uid}`;
  let triggerEl = $state<HTMLButtonElement | null>(null);

  function setOpen(next: boolean) {
    if (disabled && next) return;
    if (open === next) return;
    open = next;
    onOpenChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerEl?.focus();
    }
  }

  setSpeedDialContext({
    close: () => setOpen(false),
  });

  const actionsDirectionClass = $derived(
    direction === "up"
      ? "bottom-full mb-3 flex-col-reverse items-center"
      : direction === "down"
        ? "top-full mt-3 flex-col items-center"
        : direction === "left"
          ? "end-full me-3 flex-row-reverse items-center"
          : "start-full ms-3 flex-row items-center",
  );
</script>

<div
  use:clickAway={{ enabled: open, onClickAway: () => setOpen(false) }}
  class={cn("coim-speed-dial relative inline-flex items-center justify-center", className)}
>
  <button
    bind:this={triggerEl}
    type="button"
    {disabled}
    aria-label={ariaLabel}
    aria-expanded={open}
    aria-controls={actionsId}
    onkeydown={handleKeyDown}
    class={cn(
      "coim-fab coim-fab-circular coim-fab-size-medium coim-fab-color-primary",
      disabled && "coim-fab-disabled",
    )}
    onclick={() => setOpen(!open)}
  >
    {#if open && openIcon}
      {@render openIcon()}
    {:else if open}
      <CiCross size="medium" />
    {:else if icon}
      {@render icon()}
    {:else}
      <CiPlus size="medium" />
    {/if}
  </button>

  <div
    id={actionsId}
    role="menu"
    tabindex={-1}
    hidden={!open}
    onkeydown={handleKeyDown}
    class={cn(
      "coim-speed-dial-actions absolute z-40 flex gap-2",
      actionsDirectionClass,
      !open && "pointer-events-none opacity-0",
    )}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
