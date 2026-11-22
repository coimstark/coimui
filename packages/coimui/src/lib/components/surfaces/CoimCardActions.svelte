<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimCardActionsProps } from "./types.js";

  let { disableSpacing = false, class: className = "", children, ...rest }: CoimCardActionsProps =
    $props();
</script>

<div
  class={cn("coim-card-actions", !disableSpacing && "coim-card-actions-spacing", className)}
  {...rest}
>
  {@render children?.()}
</div>
