<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";

  interface Props extends HTMLAttributes<HTMLElement> {
    for?: string;
    id?: string;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    component?: "label" | "legend" | "span";
    class?: string;
    children?: Snippet;
  }

  let {
    for: forProp,
    id: idProp,
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    component = "label",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const ctx = tryGetFormControlContext();

  const resolvedFor = $derived(forProp ?? ctx?.id);
  const resolvedId = $derived(idProp ?? ctx?.labelId);
  const isError = $derived(errorProp ?? ctx?.error ?? false);
  const isDisabled = $derived(disabledProp ?? ctx?.disabled ?? false);
  const isRequired = $derived(requiredProp ?? ctx?.required ?? false);

  const labelClass = $derived(
    cn(
      "coim-form-label font-body text-text-primary mb-2 block text-base font-semibold",
      isDisabled && "coim-disabled opacity-disabled",
      isError && "coim-error",
      className,
    ),
  );
</script>

{#if component === "legend"}
  <legend id={resolvedId} class={labelClass} {...rest}>
    {#if children}{@render children()}{/if}
    {#if isRequired}
      <span aria-hidden="true" class="text-error ms-0.5">*</span>
    {/if}
  </legend>
{:else if component === "span"}
  <span id={resolvedId} class={labelClass} {...rest}>
    {#if children}{@render children()}{/if}
    {#if isRequired}
      <span aria-hidden="true" class="text-error ms-0.5">*</span>
    {/if}
  </span>
{:else}
  <label for={resolvedFor} id={resolvedId} class={labelClass} {...rest}>
    {#if children}{@render children()}{/if}
    {#if isRequired}
      <span aria-hidden="true" class="text-error ms-0.5">*</span>
    {/if}
  </label>
{/if}
