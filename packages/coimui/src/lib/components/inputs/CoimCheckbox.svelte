<script lang="ts">
  import { Checkbox } from "bits-ui";
  import {
    CheckboxMediumChecked,
    CheckboxMediumEmpty,
    CheckboxMediumEmptyOutlined,
    CheckboxMediumIndeterminate,
    CheckboxSmallChecked,
    CheckboxSmallEmpty,
    CheckboxSmallEmptyOutlined,
    CheckboxSmallIndeterminate,
  } from "../../icons/form/index.js";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { tryGetControlLabelContext, tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimSelectionSize, CoimSelectionVariant } from "./types.js";

  interface Props {
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    size?: CoimSelectionSize;
    variant?: CoimSelectionVariant;
    color?: CoimColor;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    label?: string;
    "aria-label"?: string;
    onCheckedChange?: (checked: boolean) => void;
    onIndeterminateChange?: (indeterminate: boolean) => void;
    class?: string;
  }

  let {
    id: idProp,
    checked = $bindable(false),
    indeterminate = $bindable(false),
    size = "small",
    variant = "filled",
    color = "primary",
    disabled: disabledProp,
    readonly: readonlyProp,
    required: requiredProp,
    name,
    value,
    label,
    "aria-label": ariaLabel,
    onCheckedChange,
    onIndeterminateChange,
    class: className = "",
  }: Props = $props();

  const labelCtx = tryGetControlLabelContext();
  const formCtx = tryGetFormControlContext();

  const resolvedId = $derived(idProp ?? labelCtx?.id);
  const isDisabled = $derived(disabledProp ?? labelCtx?.disabled ?? formCtx?.disabled ?? false);
  const isReadOnly = $derived(readonlyProp ?? formCtx?.readOnly ?? false);
  const isRequired = $derived(requiredProp ?? formCtx?.required ?? false);
</script>

{#snippet checkboxControl()}
  <Checkbox.Root
    id={resolvedId}
    bind:checked
    bind:indeterminate
    disabled={isDisabled}
    readonly={isReadOnly}
    required={isRequired}
    {name}
    {value}
    aria-label={!label && !labelCtx ? ariaLabel : undefined}
    onCheckedChange={(next) => {
      onCheckedChange?.(next);
    }}
    onIndeterminateChange={(next) => {
      onIndeterminateChange?.(next);
    }}
    class={cn(
      "coim-checkbox",
      `coim-checkbox-color-${color}`,
      checked && "coim-checkbox-checked",
      indeterminate && "coim-checkbox-indeterminate",
      isDisabled && "coim-disabled",
      className,
    )}
  >
    {#snippet children({ checked: isChecked, indeterminate: isIndet })}
      {#if isIndet}
        {#if size === "medium"}
          <CheckboxMediumIndeterminate />
        {:else}
          <CheckboxSmallIndeterminate />
        {/if}
      {:else if isChecked}
        {#if size === "medium"}
          <CheckboxMediumChecked />
        {:else}
          <CheckboxSmallChecked />
        {/if}
      {:else if variant === "outlined"}
        {#if size === "medium"}
          <CheckboxMediumEmptyOutlined />
        {:else}
          <CheckboxSmallEmptyOutlined />
        {/if}
      {:else if size === "medium"}
        <CheckboxMediumEmpty />
      {:else}
        <CheckboxSmallEmpty />
      {/if}
    {/snippet}
  </Checkbox.Root>
{/snippet}

{#if label}
  <label
    for={resolvedId}
    class={cn(
      "coim-form-control-label coim-label-placement-end",
      isDisabled && "coim-disabled",
    )}
  >
    {@render checkboxControl()}
    <span class="coim-form-control-label-text">{label}</span>
  </label>
{:else}
  {@render checkboxControl()}
{/if}
