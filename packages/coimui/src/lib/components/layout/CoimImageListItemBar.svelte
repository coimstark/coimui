<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimImageListItemBarProps } from "./types.js";

  let {
    title,
    subtitle,
    actionIcon,
    actionPosition = "right",
    position = "bottom",
    class: className = "",
    ...rest
  }: CoimImageListItemBarProps = $props();
</script>

<div
  class={cn(
    "coim-image-list-item-bar",
    position === "top" && "coim-image-list-item-bar-top",
    position === "bottom" && "coim-image-list-item-bar-bottom",
    position === "below" && "coim-image-list-item-bar-below",
    actionPosition === "left" && "flex-row-reverse",
    className,
  )}
  {...rest}
>
  <div
    class={cn(
      "coim-image-list-item-bar-title-wrap",
      position === "bottom" && "coim-image-list-item-bar-title-wrap-bottom",
    )}
  >
    {#if typeof title === "string"}
      <div class="coim-image-list-item-bar-title">{title}</div>
    {:else if title}
      <div class="coim-image-list-item-bar-title">{@render title()}</div>
    {/if}

    {#if typeof subtitle === "string"}
      <div class="coim-image-list-item-bar-subtitle">{subtitle}</div>
    {:else if subtitle}
      <div class="coim-image-list-item-bar-subtitle">{@render subtitle()}</div>
    {/if}
  </div>

  {#if actionIcon}
    <div class="coim-image-list-item-bar-action px-2">
      {@render actionIcon()}
    </div>
  {/if}
</div>
