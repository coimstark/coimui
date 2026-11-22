<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimPaperProps, PaperElevation } from "./types.js";

  const ELEVATION_CLASSES: Record<PaperElevation, string> = {
    0: "coim-paper-elevation-0",
    1: "coim-paper-elevation-1",
    2: "coim-paper-elevation-2",
    3: "coim-paper-elevation-3",
    4: "coim-paper-elevation-4",
    5: "coim-paper-elevation-5",
    6: "coim-paper-elevation-6",
  };

  let {
    elevation = 1,
    variant = "elevation",
    square = false,
    surface = false,
    component,
    as,
    class: className = "",
    children,
    ...rest
  }: CoimPaperProps = $props();

  const tag = $derived(as ?? component ?? "div");
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-paper",
    square ? "coim-paper-square" : "coim-paper-rounded",
    variant === "outlined"
      ? "coim-paper-outlined outlined"
      : ELEVATION_CLASSES[elevation],
    surface && "coim-surface surface",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</svelte:element>
