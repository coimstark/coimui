<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLTextareaAttributes, "value"> {
    value?: string;
    minRows?: number;
    maxRows?: number;
    ref?: HTMLTextAreaElement | null;
    class?: string;
  }

  let {
    value = $bindable(""),
    minRows = 1,
    maxRows,
    rows,
    ref = $bindable(null),
    class: className = "",
    oninput,
    ...rest
  }: Props = $props();

  function syncHeight() {
    if (typeof window === "undefined" || !ref) return;
    const computed = window.getComputedStyle(ref);
    const lineHeight = parseFloat(computed.lineHeight) || 20;
    const paddingBlock =
      (parseFloat(computed.paddingTop) || 0) + (parseFloat(computed.paddingBottom) || 0);
    const effectiveMinRows = rows ?? minRows;
    const minHeight = lineHeight * effectiveMinRows + paddingBlock;
    const maxHeight = maxRows ? lineHeight * maxRows + paddingBlock : Infinity;

    ref.style.height = "auto";
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, ref.scrollHeight));
    ref.style.height = `${nextHeight}px`;
    ref.style.overflowY = ref.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  onMount(() => {
    syncHeight();
  });

  $effect(() => {
    void value;
    void minRows;
    void maxRows;
    syncHeight();
  });
</script>

<textarea
  bind:this={ref}
  bind:value
  rows={rows ?? minRows}
  oninput={(event) => {
    syncHeight();
    oninput?.(event);
  }}
  class={cn("coim-textarea-autosize coim-input-field", className)}
  {...rest}
></textarea>
