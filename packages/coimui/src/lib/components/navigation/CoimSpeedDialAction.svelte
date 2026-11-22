<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetSpeedDialContext } from "./context.js";

  interface Props {
    icon?: Snippet;
    tooltipTitle: string;
    disabled?: boolean;
    closeOnClick?: boolean;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    icon,
    tooltipTitle,
    disabled = false,
    closeOnClick = true,
    onclick,
    class: className = "",
    children,
  }: Props = $props();

  const dialCtx = tryGetSpeedDialContext();
</script>

<button
  type="button"
  role="menuitem"
  {disabled}
  aria-label={tooltipTitle}
  title={tooltipTitle}
  class={cn(
    "coim-speed-dial-action bg-background-paper text-text-primary shadow-darker-xs hover:bg-grey-50 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-grey-100 transition-all",
    disabled && "opacity-disabled pointer-events-none",
    className,
  )}
  onclick={(e) => {
    if (disabled) return;
    onclick?.(e);
    if (closeOnClick) {
      dialCtx?.close();
    }
  }}
>
  {#if icon}
    {@render icon()}
  {:else if children}
    {@render children()}
  {/if}
</button>
