<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import { getImageListContext } from "./context.js";
  import { mergeInlineStyles } from "./responsive.js";
  import type { CoimImageListItemProps } from "./types.js";

  let {
    cols = 1,
    rows = 1,
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimImageListItemProps = $props();

  const tag = $derived(as ?? component ?? "li");
  const ctx = getImageListContext();

  const computedStyle = $derived.by(() => {
    const parts: string[] = [];
    const variant = ctx?.variant() ?? "standard";
    const rowHeight = ctx?.rowHeight() ?? "auto";
    const gap = ctx?.gap() ?? "4px";

    if (variant === "masonry") {
      parts.push(`margin-bottom: ${gap}`);
    } else {
      if (cols > 1) parts.push(`grid-column-end: span ${cols}`);
      if (rows > 1) parts.push(`grid-row-end: span ${rows}`);
      if (typeof rowHeight === "number") {
        parts.push(`height: ${variant === "quilted" ? rows * rowHeight : rowHeight}px`);
      }
    }
    return mergeInlineStyles(parts.join("; "), style);
  });
</script>

<svelte:element
  this={tag}
  class={cn("coim-image-list-item", className)}
  style={computedStyle}
  {...rest}
>
  {@render children?.()}
</svelte:element>
