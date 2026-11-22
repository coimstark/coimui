<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../utilities/utils.js";

  interface Props {
    currentPath?: string;
    class?: string;
    children?: Snippet;
  }

  let { currentPath = "", class: className = "", children }: Props = $props();

  $effect(() => {
    void currentPath;
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
  });
</script>

<div class={cn("min-h-screen w-full", className)}>
  {@render children?.()}
</div>
