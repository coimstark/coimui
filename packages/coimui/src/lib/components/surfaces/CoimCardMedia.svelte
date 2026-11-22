<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimCardMediaProps } from "./types.js";

  let {
    component = "div",
    image,
    src,
    alt = "",
    height,
    class: className = "",
    style = "",
    children,
    ...rest
  }: CoimCardMediaProps = $props();

  const mediaSrc = $derived(src ?? image);
  const isMediaElement = $derived(component === "img" || component === "video" || component === "iframe");

  const mergedStyle = $derived.by(() => {
    const parts: string[] = [];
    if (!isMediaElement && mediaSrc) {
      parts.push(`background-image: url("${mediaSrc}")`);
    }
    if (height !== undefined) {
      parts.push(`height: ${typeof height === "number" ? `${height}px` : height}`);
    }
    if (style) parts.push(style);
    return parts.join("; ") || undefined;
  });
</script>

{#if component === "img"}
  <img
    src={mediaSrc}
    {alt}
    class={cn("coim-card-media coim-card-media-img", className)}
    style={mergedStyle}
    {...rest}
  />
{:else if isMediaElement}
  <svelte:element
    this={component}
    src={mediaSrc}
    class={cn("coim-card-media", className)}
    style={mergedStyle}
    {...rest}
  >
    {@render children?.()}
  </svelte:element>
{:else}
  <svelte:element
    this={component}
    role={mediaSrc && alt ? "img" : undefined}
    aria-label={mediaSrc && alt ? alt : undefined}
    class={cn("coim-card-media", className)}
    style={mergedStyle}
    {...rest}
  >
    {@render children?.()}
  </svelte:element>
{/if}
