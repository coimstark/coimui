<script lang="ts">
  import { RadioGroup } from "bits-ui";
  import {
    RadiobuttonMediumChecked,
    RadiobuttonMediumEmpty,
    RadiobuttonMediumEmptyOutlined,
    RadiobuttonSmallChecked,
    RadiobuttonSmallEmpty,
    RadiobuttonSmallEmptyOutlined,
  } from "../../icons/form/index.js";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { tryGetControlLabelContext, tryGetRadioGroupContext } from "./context.svelte.js";
  import type { CoimSelectionSize, CoimSelectionVariant } from "./types.js";

  interface Props {
    id?: string;
    value: string;
    size?: CoimSelectionSize;
    variant?: CoimSelectionVariant;
    color?: CoimColor;
    disabled?: boolean;
    label?: string;
    "aria-label"?: string;
    class?: string;
  }

  let {
    id: idProp,
    value,
    size: sizeProp,
    variant: variantProp,
    color: colorProp,
    disabled: disabledProp,
    label,
    "aria-label": ariaLabel,
    class: className = "",
  }: Props = $props();

  const groupCtx = tryGetRadioGroupContext();
  const labelCtx = tryGetControlLabelContext();

  const uid = $props.id();
  const resolvedId = $derived(idProp ?? labelCtx?.id ?? (label ? `coim-radio-${uid}` : undefined));
  const size = $derived(sizeProp ?? groupCtx?.size ?? "small");
  const variant = $derived(variantProp ?? groupCtx?.variant ?? "filled");
  const color = $derived(colorProp ?? groupCtx?.color ?? "primary");
  const isDisabled = $derived(
    disabledProp ?? labelCtx?.disabled ?? groupCtx?.disabled ?? false,
  );
</script>

{#snippet radioItem()}
  <RadioGroup.Item
    id={resolvedId}
    {value}
    disabled={isDisabled}
    aria-label={!label && !labelCtx ? ariaLabel : undefined}
    class={cn(
      "coim-radio",
      `coim-radio-color-${color}`,
      isDisabled && "coim-disabled",
      className,
    )}
  >
    {#snippet children({ checked })}
      <span class={cn("inline-flex items-center justify-center", checked && "coim-radio-checked")}>
        {#if checked}
          {#if size === "medium"}
            <RadiobuttonMediumChecked />
          {:else}
            <RadiobuttonSmallChecked />
          {/if}
        {:else if variant === "outlined"}
          {#if size === "medium"}
            <RadiobuttonMediumEmptyOutlined />
          {:else}
            <RadiobuttonSmallEmptyOutlined />
          {/if}
        {:else if size === "medium"}
          <RadiobuttonMediumEmpty />
        {:else}
          <RadiobuttonSmallEmpty />
        {/if}
      </span>
    {/snippet}
  </RadioGroup.Item>
{/snippet}

{#if label}
  <label
    for={resolvedId}
    class={cn(
      "coim-form-control-label coim-label-placement-end",
      isDisabled && "coim-disabled",
    )}
  >
    {@render radioItem()}
    <span class="coim-form-control-label-text">{label}</span>
  </label>
{:else}
  {@render radioItem()}
{/if}
