<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimCardActionAreaProps } from "./types.js";

  let { href, disabled = false, class: className = "", children, ...rest }: CoimCardActionAreaProps =
    $props();
</script>

{#if href}
  <a
    {href}
    aria-disabled={disabled ? "true" : undefined}
    tabindex={disabled ? -1 : undefined}
    class={cn("coim-card-action-area", className)}
    {...rest}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    type="button"
    {disabled}
    class={cn("coim-card-action-area", className)}
    {...rest}
  >
    {@render children?.()}
  </button>
{/if}
