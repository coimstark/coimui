<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import type { SkeletonAnimation, SkeletonVariant } from "./types.js";

  interface Props {
    variant?: SkeletonVariant;
    animation?: SkeletonAnimation;
    width?: number | string;
    height?: number | string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    variant = "text",
    animation = "pulse",
    width,
    height,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const resolvedWidth = $derived(typeof width === "number" ? `${width}px` : width);
  const resolvedHeight = $derived(typeof height === "number" ? `${height}px` : height);

  const variantClasses = $derived.by(() => {
    switch (variant) {
      case "circular":
        return "coim-skeleton-circular rounded-full";
      case "rectangular":
        return "coim-skeleton-rectangular rounded-sm";
      case "rounded":
        return "coim-skeleton-rounded rounded-sm";
      case "text":
      default:
        return "coim-skeleton-text rounded-[0.375rem]";
    }
  });

  const animationClasses = $derived.by(() => {
    if (animation === false) return "";
    if (animation === "wave") return "coim-skeleton-wave";
    return "coim-skeleton-pulse";
  });
</script>

<span
  aria-busy="true"
  data-variant={variant}
  data-animation={animation === false ? "none" : animation}
  style:width={resolvedWidth}
  style:height={resolvedHeight}
  class={cn(
    "coim-skeleton bg-grey-50 block",
    variantClasses,
    animationClasses,
    children && "coim-skeleton-has-children",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</span>
