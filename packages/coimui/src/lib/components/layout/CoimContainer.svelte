<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimContainerProps, ContainerMaxWidth, LayoutBreakpoint } from "./types.js";

  const MAX_WIDTH_CLASSES: Record<Exclude<ContainerMaxWidth, false>, string> = {
    xs: "max-w-[444px]",
    sm: "max-w-[480px]",
    md: "max-w-[960px]",
    lg: "max-w-[1280px]",
    xl: "max-w-[1440px]",
    "2xl": "max-w-[1640px]",
    "3xl": "max-w-[1900px]",
  };

  const FIXED_ORDER: LayoutBreakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
  const FIXED_STEP_CLASSES: Record<LayoutBreakpoint, string> = {
    xs: "max-w-[444px]",
    sm: "sm:max-w-[480px]",
    md: "md:max-w-[960px]",
    lg: "lg:max-w-[1280px]",
    xl: "xl:max-w-[1440px]",
    "2xl": "2xl:max-w-[1640px]",
    "3xl": "3xl:max-w-[1900px]",
  };

  let {
    maxWidth = "lg",
    fixed = false,
    disableGutters = false,
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimContainerProps = $props();

  const tag = $derived(as ?? component ?? "div");

  const fixedClasses = $derived.by(() => {
    if (!fixed) return "";
    if (maxWidth === false) {
      return FIXED_ORDER.slice(1)
        .map((bp) => FIXED_STEP_CLASSES[bp])
        .join(" ");
    }
    const maxIndex = FIXED_ORDER.indexOf(maxWidth);
    if (maxIndex <= 0) return MAX_WIDTH_CLASSES.xs;
    return FIXED_ORDER.slice(1, maxIndex + 1)
      .map((bp) => FIXED_STEP_CLASSES[bp])
      .join(" ");
  });
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-container mx-auto box-border block w-full",
    !disableGutters && "px-4 sm:px-6",
    !fixed && maxWidth !== false && MAX_WIDTH_CLASSES[maxWidth],
    fixed && fixedClasses,
    className,
  )}
  {style}
  {...rest}
>
  {@render children?.()}
</svelte:element>
