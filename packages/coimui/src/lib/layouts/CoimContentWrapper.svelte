<script lang="ts">
  import type { Snippet } from "svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { ContentType } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children }: Props = $props();
  const theme = getThemeContext();
</script>

<div
  class={cn(
    "mx-auto w-full px-4 py-4 md:px-6 lg:px-8 lg:py-8",
    theme.content === ContentType.Boxed && "max-w-340",
    className,
  )}
>
  {@render children?.()}
</div>
