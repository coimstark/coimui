<script lang="ts">
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
    disableCloseOnTriggerClick?: boolean;
    disabled?: boolean;
    ignoreNonKeyboardFocus?: boolean;
    children?: Snippet;
  }

  let {
    delayDuration = 150,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    disableCloseOnTriggerClick = false,
    disabled = false,
    ignoreNonKeyboardFocus = false,
    children,
  }: Props = $props();
</script>

<Tooltip.Provider
  {delayDuration}
  {skipDelayDuration}
  {disableHoverableContent}
  {disableCloseOnTriggerClick}
  {disabled}
  {ignoreNonKeyboardFocus}
>
  {@render children?.()}
</Tooltip.Provider>
