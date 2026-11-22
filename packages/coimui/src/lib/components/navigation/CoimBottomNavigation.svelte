<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setBottomNavigationContext } from "./context.js";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    value?: string | number;
    showLabels?: boolean;
    onValueChange?: (value: string | number, event: Event) => void;
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    value = $bindable<string | number>(0),
    showLabels = true,
    onValueChange,
    ariaLabel = "Bottom navigation",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let actionCounter = 0;

  setBottomNavigationContext({
    get value() {
      return value;
    },
    get showLabels() {
      return showLabels;
    },
    assignIndex: () => actionCounter++,
    select: (nextValue, event) => {
      value = nextValue;
      onValueChange?.(nextValue, event);
    },
  });
</script>

<nav aria-label={ariaLabel} class={cn("coim-bottom-navigation", className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</nav>
