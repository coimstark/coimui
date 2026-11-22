<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimCardHeaderProps } from "./types.js";

  let { title, subheader, avatar, action, class: className = "", ...rest }: CoimCardHeaderProps =
    $props();
</script>

<div class={cn("coim-card-header", className)} {...rest}>
  {#if avatar}
    <div class="coim-card-header-avatar">
      {@render avatar()}
    </div>
  {/if}

  <div class="coim-card-header-content">
    {#if typeof title === "string"}
      <span class="coim-card-header-title">{title}</span>
    {:else if title}
      <div class="coim-card-header-title">
        {@render title()}
      </div>
    {/if}

    {#if typeof subheader === "string"}
      <span class="coim-card-header-subheader">{subheader}</span>
    {:else if subheader}
      <div class="coim-card-header-subheader">
        {@render subheader()}
      </div>
    {/if}
  </div>

  {#if action}
    <div class="coim-card-header-action">
      {@render action()}
    </div>
  {/if}
</div>
