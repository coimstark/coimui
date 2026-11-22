<script lang="ts">
  import { Switch } from "bits-ui";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { tryGetControlLabelContext, tryGetFormControlContext } from "./context.svelte.js";
  import { SWITCH_CHECKED_TRACK_CLASSES } from "./styles.js";
  import type { CoimSelectionSize, CoimSelectionVariant } from "./types.js";

  interface Props {
    id?: string;
    checked?: boolean;
    size?: CoimSelectionSize;
    variant?: CoimSelectionVariant;
    color?: CoimColor;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    label?: string;
    "aria-label"?: string;
    onCheckedChange?: (checked: boolean) => void;
    class?: string;
  }

  let {
    id: idProp,
    checked = $bindable(false),
    size = "medium",
    variant = "filled",
    color = "primary",
    disabled: disabledProp,
    required: requiredProp,
    name,
    value,
    label,
    "aria-label": ariaLabel,
    onCheckedChange,
    class: className = "",
  }: Props = $props();

  const labelCtx = tryGetControlLabelContext();
  const formCtx = tryGetFormControlContext();

  const resolvedId = $derived(idProp ?? labelCtx?.id);
  const isDisabled = $derived(disabledProp ?? labelCtx?.disabled ?? formCtx?.disabled ?? false);
  const isRequired = $derived(requiredProp ?? formCtx?.required ?? false);
</script>

{#snippet switchControl()}
  <Switch.Root
    id={resolvedId}
    bind:checked
    disabled={isDisabled}
    required={isRequired}
    {name}
    {value}
    aria-label={!label && !labelCtx ? ariaLabel : undefined}
    onCheckedChange={(next) => onCheckedChange?.(next)}
    class={cn(
      "coim-switch",
      size === "small" ? "coim-switch-size-small" : "coim-switch-size-medium",
      variant === "outlined" && "coim-switch-outlined",
      `coim-switch-color-${color}`,
      SWITCH_CHECKED_TRACK_CLASSES[color],
      isDisabled && "coim-disabled",
      className,
    )}
  >
    <Switch.Thumb class="coim-switch-thumb" />
  </Switch.Root>
{/snippet}

{#if label}
  <label
    for={resolvedId}
    class={cn(
      "coim-form-control-label coim-label-placement-end gap-2",
      isDisabled && "coim-disabled",
    )}
  >
    {@render switchControl()}
    <span class="coim-form-control-label-text">{label}</span>
  </label>
{:else}
  {@render switchControl()}
{/if}
