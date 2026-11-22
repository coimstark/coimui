<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLTableRowElement>, "class" | "children"> {
    hover?: boolean;
    selected?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    hover = false,
    selected = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<tr
  {...rest}
  aria-selected={selected ? "true" : undefined}
  class={cn(
    "coim-table-row",
    hover && "is-hover",
    selected && "is-selected",
    className,
  )}
>
  {@render children?.()}
</tr>
