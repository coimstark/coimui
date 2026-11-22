<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimCardProps, PaperElevation } from "./types.js";

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
    raised = false,
    elevation: elevationProp,
    variant = "elevation",
    square = false,
    surface = false,
    component,
    as,
    class: className = "",
    children,
    ...rest
  }: CoimCardProps = $props();

  const tag = $derived(as ?? component ?? "div");
  const resolvedElevation = $derived<PaperElevation | undefined>(
    elevationProp ?? (raised ? 4 : undefined),
  );
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-card",
    square ? "coim-paper-square" : "coim-paper-rounded",
    variant === "outlined" ? "coim-card-outlined outlined" : "",
    variant === "elevation" && resolvedElevation !== undefined
      ? ELEVATION_CLASSES[resolvedElevation]
      : "",
    surface && "coim-surface surface",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</svelte:element>
