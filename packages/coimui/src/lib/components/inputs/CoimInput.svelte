<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FullAutoFill, HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimInputSize, CoimInputVariant, CoimMaskOptions } from "./types.js";
  import { applyInputMask } from "./utils.js";
  import CoimTextareaAutosize from "./CoimTextareaAutosize.svelte";

  interface Props {
    id?: string;
    name?: string;
    type?: HTMLInputTypeAttribute;
    value?: string;
    variant?: CoimInputVariant;
    standardOutlined?: boolean;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number;
    minRows?: number;
    maxRows?: number;
    label?: string;
    floatingLabel?: boolean;
    shrunk?: boolean;
    placeholder?: string;
    mask?: string | CoimMaskOptions;
    autocomplete?: FullAutoFill | null;
    inputmode?: HTMLInputAttributes["inputmode"];
    maxlength?: number;
    minlength?: number;
    pattern?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    tabindex?: number;
    form?: string;
    title?: string;
    startAdornment?: Snippet;
    endAdornment?: Snippet;
    inputRef?: HTMLInputElement | null;
    textareaRef?: HTMLTextAreaElement | null;
    inputProps?: Partial<HTMLInputAttributes>;
    class?: string;
    inputClass?: string;
    onValueChange?: (value: string) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onkeydown?: (event: KeyboardEvent) => void;
    onkeyup?: (event: KeyboardEvent) => void;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-labelledby"?: string;
    [key: `data-${string}`]: unknown;
  }

  let {
    id: idProp,
    name,
    type = "text",
    value = $bindable(""),
    variant: variantProp,
    standardOutlined = false,
    size: sizeProp,
    surface: surfaceProp,
    error: errorProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    required: requiredProp,
    fullWidth: fullWidthProp,
    multiline = false,
    rows,
    minRows = 3,
    maxRows,
    label,
    floatingLabel = false,
    shrunk,
    placeholder,
    mask,
    autocomplete,
    inputmode,
    maxlength,
    minlength,
    pattern,
    min,
    max,
    step,
    tabindex,
    form,
    title,
    startAdornment,
    endAdornment,
    inputRef = $bindable(null),
    textareaRef = $bindable(null),
    inputProps,
    class: className = "",
    inputClass = "",
    onValueChange,
    oninput,
    onchange,
    onkeydown,
    onkeyup,
    onfocus,
    onblur,
    ...rest
  }: Props = $props();

  const ctx = tryGetFormControlContext();

  let focused = $state(false);

  const resolvedId = $derived(idProp ?? ctx?.id);
  const resolvedVariant = $derived(variantProp ?? ctx?.variant ?? "standard");
  const resolvedSize = $derived(sizeProp ?? ctx?.size ?? "medium");
  const isSurface = $derived(surfaceProp ?? ctx?.surface ?? false);
  const isError = $derived(errorProp ?? ctx?.error ?? false);
  const isDisabled = $derived(disabledProp ?? ctx?.disabled ?? false);
  const isReadOnly = $derived(readOnlyProp ?? ctx?.readOnly ?? false);
  const isRequired = $derived(requiredProp ?? ctx?.required ?? false);
  const isFullWidth = $derived(fullWidthProp ?? ctx?.fullWidth ?? false);

  const hasValue = $derived(String(value ?? "").length > 0);
  const isShrunk = $derived(
    shrunk ??
      (focused || hasValue || Boolean(placeholder) || Boolean(startAdornment)),
  );
  const describedBy = $derived(
    (rest["aria-describedby"] as string | undefined) ??
      (ctx?.hasHelperText ? ctx.helperId : undefined),
  );

  function handleInput(raw: string) {
    const formatted = mask ? applyInputMask(raw, mask) : raw;
    value = formatted;
    if (inputRef && inputRef.value !== formatted) {
      inputRef.value = formatted;
    }
    onValueChange?.(formatted);
  }
</script>

<div
  class={cn(
    "coim-input-root",
    resolvedVariant === "standard" && !standardOutlined && "coim-input-standard",
    resolvedVariant === "standard" && standardOutlined && "coim-input-standard-outlined",
    resolvedVariant === "surface-standard" && "coim-input-surface-standard",
    resolvedVariant === "outlined" && "coim-input-outlined",
    resolvedVariant === "filled" && "coim-input-filled",
    resolvedSize === "small" && "coim-input-size-small",
    isSurface && "surface",
    isFullWidth && "w-full",
    focused && "coim-focused",
    isError && "coim-error",
    isDisabled && "coim-disabled",
    isReadOnly && "coim-readonly",
    startAdornment && "coim-input-adorned-start",
    endAdornment && "coim-input-adorned-end",
    className,
  )}
>
  {#if startAdornment}
    <div class="coim-input-adornment coim-input-adornment-start">
      {@render startAdornment()}
    </div>
  {/if}

  {#if multiline}
    <CoimTextareaAutosize
      id={resolvedId}
      {name}
      bind:ref={textareaRef}
      bind:value
      {rows}
      {minRows}
      {maxRows}
      disabled={isDisabled}
      readonly={isReadOnly}
      required={isRequired}
      {placeholder}
      {maxlength}
      {minlength}
      {tabindex}
      {form}
      {title}
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-labelledby"]}
      aria-invalid={isError || undefined}
      aria-describedby={describedBy}
      {onchange}
      {onkeydown}
      {onkeyup}
      onfocus={(e) => {
        focused = true;
        onfocus?.(e);
      }}
      onblur={(e) => {
        focused = false;
        onblur?.(e);
      }}
      oninput={(e) => {
        handleInput((e.currentTarget as HTMLTextAreaElement).value);
        oninput?.(e);
      }}
      class={inputClass}
    />
  {:else}
    <input
      bind:this={inputRef}
      id={resolvedId}
      {name}
      {type}
      value={value}
      disabled={isDisabled}
      readonly={isReadOnly}
      required={isRequired}
      {placeholder}
      {autocomplete}
      {inputmode}
      {maxlength}
      {minlength}
      {pattern}
      {min}
      {max}
      {step}
      {tabindex}
      {form}
      {title}
      aria-invalid={isError || undefined}
      aria-describedby={describedBy}
      {onchange}
      {onkeydown}
      {onkeyup}
      onfocus={(e) => {
        focused = true;
        onfocus?.(e);
      }}
      onblur={(e) => {
        focused = false;
        onblur?.(e);
      }}
      oninput={(e) => {
        handleInput((e.currentTarget as HTMLInputElement).value);
        oninput?.(e);
      }}
      class={cn("coim-input-field", inputClass)}
      {...inputProps}
      {...rest}
    />
  {/if}

  {#if endAdornment}
    <div class="coim-input-adornment coim-input-adornment-end">
      {@render endAdornment()}
    </div>
  {/if}

  {#if resolvedVariant === "outlined"}
    <fieldset
      aria-hidden="true"
      class={cn(
        "coim-input-notched-outline",
        floatingLabel && isShrunk && "coim-notched-shrunk",
      )}
    >
      <legend>
        {#if floatingLabel && label}
          <span>{label}{isRequired ? " *" : ""}</span>
        {:else}
          <span class="notranslate" aria-hidden="true">&#8203;</span>
        {/if}
      </legend>
    </fieldset>
  {/if}
</div>
