<script lang="ts">
  import { Tabs } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    value: string;
    noPadding?: boolean;
    class?: string;
    innerClass?: string;
    children?: Snippet;
  }

  let {
    value,
    noPadding = false,
    class: className = "",
    innerClass = "",
    children,
  }: Props = $props();
</script>

<Tabs.Content {value} class={cn("coim-tab-panel", className)}>
  <div class={cn(!noPadding && "coim-tab-panel-inner", innerClass)}>
    {#if children}
      {@render children()}
    {/if}
  </div>
</Tabs.Content>
