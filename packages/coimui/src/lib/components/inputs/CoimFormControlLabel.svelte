<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setControlLabelContext, tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimLabelPlacement, TextOrSnippet } from "./types.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: TextOrSnippet;
    labelPlacement?: CoimLabelPlacement;
    disabled?: boolean;
    required?: boolean;
    for?: string;
    control?: Snippet<[{ id: string; disabled: boolean }]>;
    class?: string;
    children?: Snippet;
  }

  const uid = $props.id();

  let {
    label,
    labelPlacement = "end",
    disabled: disabledProp,
    required: requiredProp,
    for: forProp,
    control,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const formCtx = tryGetFormControlContext();

  const controlId = $derived(forProp ?? `coim-ctrl-${uid}`);
  const labelId = $derived(`${controlId}-label`);
  const isDisabled = $derived(disabledProp ?? formCtx?.disabled ?? false);
  const isRequired = $derived(requiredProp ?? formCtx?.required ?? false);

  setControlLabelContext({
    get id() {
      return controlId;
    },
    get labelId() {
      return labelId;
    },
    get disabled() {
      return isDisabled;
    },
  });

  const placementClass = $derived(
    labelPlacement === "start"
      ? "coim-label-placement-start flex-row-reverse"
      : labelPlacement === "top"
        ? "coim-label-placement-top flex-col-reverse items-center"
        : labelPlacement === "bottom"
          ? "coim-label-placement-bottom flex-col items-center"
          : "coim-label-placement-end flex-row",
  );
</script>

<div
  class={cn(
    "coim-form-control-label inline-flex cursor-pointer items-center select-none",
    placementClass,
    isDisabled && "coim-disabled cursor-default",
    className,
  )}
  {...rest}
>
  {#if control}
    {@render control({ id: controlId, disabled: isDisabled })}
  {:else if children}
    {@render children()}
  {/if}

  <label
    for={controlId}
    id={labelId}
    class={cn(
      "coim-form-control-label-text font-body text-text-primary cursor-pointer text-base leading-5",
      isDisabled && "opacity-disabled cursor-default",
    )}
  >
    {#if typeof label === "string"}
      {label}
    {:else}
      {@render label()}
    {/if}
    {#if isRequired}
      <span aria-hidden="true" class="text-error ms-0.5">*</span>
    {/if}
  </label>
</div>
