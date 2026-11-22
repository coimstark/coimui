<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setFormControlContext } from "./context.svelte.js";
  import type { CoimInputSize, CoimInputVariant } from "./types.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    id?: string;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    size?: CoimInputSize;
    fullWidth?: boolean;
    fullHeight?: boolean;
    variant?: CoimInputVariant;
    surface?: boolean;
    hasHelperText?: boolean;
    class?: string;
    children?: Snippet;
  }

  const uid = $props.id();

  let {
    id: idProp,
    error = false,
    disabled = false,
    required = false,
    readOnly = false,
    size = "medium",
    fullWidth = false,
    fullHeight = false,
    variant = "outlined",
    surface = false,
    hasHelperText: hasHelperTextProp = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let helperRegistrations = $state(0);

  const controlId = $derived(idProp ?? `coim-field-${uid}`);
  const labelId = $derived(`${controlId}-label`);
  const helperId = $derived(`${controlId}-helper`);
  const hasHelperText = $derived(hasHelperTextProp || helperRegistrations > 0);

  setFormControlContext({
    get id() {
      return controlId;
    },
    get labelId() {
      return labelId;
    },
    get helperId() {
      return helperId;
    },
    get error() {
      return error;
    },
    get disabled() {
      return disabled;
    },
    get required() {
      return required;
    },
    get readOnly() {
      return readOnly;
    },
    get size() {
      return size;
    },
    get fullWidth() {
      return fullWidth;
    },
    get variant() {
      return variant;
    },
    get surface() {
      return surface;
    },
    get hasHelperText() {
      return hasHelperText;
    },
    registerHelperText() {
      untrack(() => {
        helperRegistrations += 1;
      });
      return () => {
        untrack(() => {
          helperRegistrations = Math.max(0, helperRegistrations - 1);
        });
      };
    },
  });
</script>

<div
  class={cn(
    "coim-form-control m-0 mb-4 flex flex-col",
    fullWidth && "coim-form-control-full-width w-full",
    fullHeight && "coim-form-control-full-height flex-1",
    surface && "surface",
    error && "coim-error",
    disabled && "coim-disabled",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
