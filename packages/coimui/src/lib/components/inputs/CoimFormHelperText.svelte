<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    id?: string;
    error?: boolean;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    id: idProp,
    error: errorProp,
    disabled: disabledProp,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const ctx = tryGetFormControlContext();

  $effect(() => {
    if (!ctx) return;
    return ctx.registerHelperText();
  });

  const resolvedId = $derived(idProp ?? ctx?.helperId);
  const isError = $derived(errorProp ?? ctx?.error ?? false);
  const isDisabled = $derived(disabledProp ?? ctx?.disabled ?? false);
</script>

<p
  id={resolvedId}
  role={isError ? "alert" : undefined}
  class={cn(
    "coim-form-helper-text font-body text-text-secondary mt-1 text-sm leading-4 font-normal tracking-normal",
    isError && "coim-error text-error",
    isDisabled && "coim-disabled opacity-disabled",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</p>
