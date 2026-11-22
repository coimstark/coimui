<script lang="ts">
  import type { Snippet } from "svelte";
  import { RadioGroup } from "bits-ui";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { setRadioGroupContext, tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimSelectionSize, CoimSelectionVariant } from "./types.js";

  interface Props {
    value?: string;
    name?: string;
    label?: string;
    color?: CoimColor;
    size?: CoimSelectionSize;
    variant?: CoimSelectionVariant;
    row?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    loop?: boolean;
    onValueChange?: (value: string) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    value = $bindable(""),
    name,
    label,
    color = "primary",
    size = "small",
    variant = "filled",
    row = false,
    disabled: disabledProp,
    readonly: readonlyProp,
    required: requiredProp,
    loop = true,
    onValueChange,
    class: className = "",
    children,
  }: Props = $props();

  const formCtx = tryGetFormControlContext();
  const isDisabled = $derived(disabledProp ?? formCtx?.disabled ?? false);
  const isReadOnly = $derived(readonlyProp ?? formCtx?.readOnly ?? false);
  const isRequired = $derived(requiredProp ?? formCtx?.required ?? false);

  setRadioGroupContext({
    get color() {
      return color;
    },
    get size() {
      return size;
    },
    get variant() {
      return variant;
    },
    get disabled() {
      return isDisabled;
    },
    get readOnly() {
      return isReadOnly;
    },
    get row() {
      return row;
    },
  });
</script>

<fieldset class="coim-radio-group-fieldset">
  {#if label}
    <legend class="coim-form-label font-body text-text-primary mb-2 block text-base font-semibold">
      {label}{isRequired ? " *" : ""}
    </legend>
  {/if}

  <RadioGroup.Root
    bind:value
    {name}
    disabled={isDisabled}
    readonly={isReadOnly}
    required={isRequired}
    {loop}
    orientation={row ? "horizontal" : "vertical"}
    onValueChange={(next) => onValueChange?.(next)}
    class={cn("coim-radio-group", row && "coim-radio-group-row", className)}
  >
    {@render children?.()}
  </RadioGroup.Root>
</fieldset>
