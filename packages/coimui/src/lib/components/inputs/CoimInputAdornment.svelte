<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimInputSize, CoimInputVariant } from "./types.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    position: "start" | "end";
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    disablePointerEvents?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    position,
    variant: variantProp,
    size: sizeProp,
    disablePointerEvents = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const ctx = tryGetFormControlContext();
  const variant = $derived(variantProp ?? ctx?.variant ?? "outlined");
  const size = $derived(sizeProp ?? ctx?.size ?? "medium");
</script>

<div
  class={cn(
    "coim-input-adornment text-text-secondary flex shrink-0 items-center text-base leading-5",
    position === "start" ? "coim-input-adornment-start ms-0 me-2" : "coim-input-adornment-end ms-2 me-0",
    variant === "filled" &&
      (size === "small" ? "mt-4.5 self-start" : "mt-5.5 self-start"),
    disablePointerEvents && "pointer-events-none",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
