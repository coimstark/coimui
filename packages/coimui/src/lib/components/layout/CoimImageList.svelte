<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import { setImageListContext } from "./context.js";
  import { mergeInlineStyles } from "./responsive.js";
  import type { CoimImageListProps } from "./types.js";

  let {
    variant = "standard",
    cols = 2,
    gap = 4,
    rowHeight = "auto",
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimImageListProps = $props();

  const tag = $derived(as ?? component ?? "ul");
  const gapCss = $derived(typeof gap === "number" ? `${gap}px` : gap);

  setImageListContext({
    variant: () => variant,
    cols: () => cols,
    gap: () => gapCss,
    rowHeight: () => rowHeight,
  });

  const computedStyle = $derived.by(() => {
    const parts: string[] = [];
    if (variant === "masonry") {
      parts.push(`column-count: ${cols}`);
      parts.push(`column-gap: ${gapCss}`);
    } else {
      parts.push(`grid-template-columns: repeat(${cols}, 1fr)`);
      parts.push(`gap: ${gapCss}`);
      if (typeof rowHeight === "number") {
        parts.push(`grid-auto-rows: ${rowHeight}px`);
      }
    }
    return mergeInlineStyles(parts.join("; "), style);
  });
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-image-list",
    variant === "standard" && "coim-image-list-standard",
    variant === "quilted" && "coim-image-list-quilted",
    variant === "woven" && "coim-image-list-woven",
    variant === "masonry" && "coim-image-list-masonry",
    className,
  )}
  style={computedStyle}
  {...rest}
>
  {@render children?.()}
</svelte:element>
