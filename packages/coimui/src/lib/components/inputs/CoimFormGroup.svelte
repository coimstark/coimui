<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFieldsetAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import type { TextOrSnippet } from "./types.js";

  interface Props extends HTMLFieldsetAttributes {
    row?: boolean;
    legend?: TextOrSnippet;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    row = false,
    legend,
    disabled = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<fieldset
  {disabled}
  class={cn(
    "coim-form-group m-0 mb-4 flex flex-col border-0 p-0",
    row && "coim-form-group-row flex-row flex-wrap",
    className,
  )}
  {...rest}
>
  {#if legend}
    <legend class="coim-form-label font-body text-text-primary mb-2 block text-base font-semibold">
      {#if typeof legend === "string"}
        {legend}
      {:else}
        {@render legend()}
      {/if}
    </legend>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</fieldset>
