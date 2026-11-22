<script lang="ts">
  import { Tabs } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetTabsContext } from "./context.js";
  import type { CoimTabsSize } from "./types.js";

  interface Props {
    value: string;
    label?: string;
    disabled?: boolean;
    size?: CoimTabsSize;
    icon?: Snippet;
    iconPosition?: "start" | "top";
    class?: string;
    children?: Snippet;
  }

  let {
    value,
    label,
    disabled = false,
    size: sizeProp,
    icon,
    iconPosition = "start",
    class: className = "",
    children,
  }: Props = $props();

  const ctx = tryGetTabsContext();
  const resolvedSize = $derived(sizeProp ?? ctx?.size ?? "medium");
  const iconOnly = $derived(Boolean(icon) && !label && !children);
</script>

<Tabs.Trigger
  {value}
  {disabled}
  class={cn(
    "coim-tab",
    resolvedSize === "small" && "coim-tab-small",
    resolvedSize === "tiny" && "coim-tab-tiny",
    iconOnly && "coim-tab-icon-only",
    iconPosition === "top" && "flex-col",
    className,
  )}
>
  {#if icon}
    <span class="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
      {@render icon()}
    </span>
  {/if}
  {#if children}
    {@render children()}
  {:else if label}
    <span>{label}</span>
  {/if}
</Tabs.Trigger>
