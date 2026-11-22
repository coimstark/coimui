<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimDividerProps } from "./types.js";

  let {
    orientation = "horizontal",
    variant = "fullWidth",
    size = "medium",
    textAlign = "center",
    flexItem = false,
    component,
    as,
    role = "separator",
    class: className = "",
    children,
    ...rest
  }: CoimDividerProps = $props();

  const tag = $derived(component ?? as ?? (children || orientation === "vertical" ? "div" : "hr"));
  const hasChildren = $derived(Boolean(children));
</script>

<svelte:element
  this={tag}
  {role}
  aria-orientation={role === "separator" && orientation === "vertical" ? "vertical" : undefined}
  class={cn(
    "coim-divider",
    orientation === "vertical" && "coim-divider-vertical",
    variant === "fullWidth" && "coim-divider-full-width",
    variant === "inset" && "coim-divider-inset",
    variant === "middle" && "coim-divider-middle",
    size === "large" && "coim-divider-large large",
    flexItem && "coim-divider-flex-item",
    hasChildren && "coim-divider-with-children",
    hasChildren && textAlign === "left" && "coim-divider-text-left",
    hasChildren && textAlign === "right" && "coim-divider-text-right",
    className,
  )}
  {...rest}
>
  {#if children}
    <span class="coim-divider-wrapper">
      {@render children()}
    </span>
  {/if}
</svelte:element>
