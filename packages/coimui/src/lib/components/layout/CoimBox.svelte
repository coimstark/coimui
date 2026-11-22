<script lang="ts">
  import type { CoimBoxProps } from "./types.js";

  let {
    as,
    component,
    ref = $bindable(null),
    class: className = "",
    style,
    children,
    ...rest
  }: CoimBoxProps = $props();

  const tag = $derived(as ?? component ?? "div");
</script>

<svelte:element this={tag} bind:this={ref} class={className || undefined} {style} {...rest}>
  {@render children?.()}
</svelte:element>
