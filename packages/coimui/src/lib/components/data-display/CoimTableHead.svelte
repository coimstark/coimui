<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setTableSectionContext } from "./table-context.svelte.js";

  interface Props extends Omit<HTMLAttributes<HTMLTableSectionElement>, "class" | "children"> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children, ...rest }: Props = $props();

  setTableSectionContext("head");
</script>

<thead {...rest} class={cn("coim-table-head", className)}>
  {@render children?.()}
</thead>
