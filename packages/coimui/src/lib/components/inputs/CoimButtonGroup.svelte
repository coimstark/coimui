<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { setButtonGroupContext } from "./context.svelte.js";
  import type { CoimButtonSize, CoimButtonVariant } from "./types.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: CoimButtonVariant;
    size?: CoimButtonSize;
    color?: CoimColor;
    orientation?: "horizontal" | "vertical";
    fullWidth?: boolean;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "outlined",
    size = "medium",
    color = "primary",
    orientation = "horizontal",
    fullWidth = false,
    disabled = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  setButtonGroupContext({
    get variant() {
      return variant;
    },
    get color() {
      return color;
    },
    get size() {
      return size;
    },
    get disabled() {
      return disabled;
    },
    get orientation() {
      return orientation;
    },
    get fullWidth() {
      return fullWidth;
    },
  });
</script>

<div
  role="group"
  aria-disabled={disabled ? "true" : undefined}
  class={cn(
    "coim-btn-group inline-flex",
    orientation === "vertical" ? "coim-btn-group-vertical flex-col" : "coim-btn-group-horizontal flex-row",
    `coim-btn-group-${variant}`,
    `coim-btn-group-color-${color}`,
    fullWidth && "coim-btn-group-full-width w-full",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
