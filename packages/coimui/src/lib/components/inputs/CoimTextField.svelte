<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FullAutoFill, HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import CoimFormControl from "./CoimFormControl.svelte";
  import CoimFormHelperText from "./CoimFormHelperText.svelte";
  import CoimFormLabel from "./CoimFormLabel.svelte";
  import CoimInput from "./CoimInput.svelte";
  import type { CoimInputSize, CoimInputVariant, CoimMaskOptions } from "./types.js";

  interface Props {
    id?: string;
    name?: string;
    type?: HTMLInputTypeAttribute;
    value?: string;
    label?: string;
    helperText?: string;
    placeholder?: string;
    variant?: CoimInputVariant;
    standardOutlined?: boolean;
    floatingLabel?: boolean;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    multiline?: boolean;
    rows?: number;
    minRows?: number;
    maxRows?: number;
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
    startAdornment?: Snippet;
    endAdornment?: Snippet;
    helperSnippet?: Snippet;
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
    [key: `data-${string}`]: unknown;
  }

  const uid = $props.id();

  let {
    id: idProp,
    name,
    type = "text",
    value = $bindable(""),
    label,
    helperText,
    placeholder,
    variant = "outlined",
    standardOutlined = false,
    floatingLabel: floatingLabelProp,
    size = "medium",
    surface = false,
    error = false,
    disabled = false,
    readOnly = false,
    required = false,
    fullWidth = false,
    fullHeight = false,
    multiline = false,
    rows,
    minRows = 3,
    maxRows,
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
    startAdornment,
    endAdornment,
    helperSnippet,
    inputRef = $bindable(null),
    textareaRef = $bindable(null),
    inputProps,
    class: className = "",
    inputClass = "",
    onValueChange,
    onfocus: onFocusProp,
    onblur: onBlurProp,
    oninput,
    onchange,
    onkeydown,
    onkeyup,
    ...rest
  }: Props = $props();

  let focused = $state(false);

  const fieldId = $derived(idProp ?? `coim-textfield-${uid}`);
  const useFloating = $derived(
    floatingLabelProp ?? (variant === "outlined" || variant === "filled"),
  );
  const isShrunk = $derived(
    focused || String(value ?? "").length > 0 || Boolean(placeholder) || Boolean(startAdornment),
  );
</script>

<CoimFormControl
  id={fieldId}
  {error}
  {disabled}
  {required}
  {readOnly}
  {size}
  {fullWidth}
  {fullHeight}
  {variant}
  {surface}
  class={className}
>
  {#if label && !useFloating}
    <CoimFormLabel>{label}</CoimFormLabel>
  {/if}

  <div class="coim-input-wrapper">
    {#if label && useFloating}
      <label
        for={fieldId}
        class={cn(
          "coim-input-label-animated",
          variant === "outlined" ? "coim-input-label-outlined" : "coim-input-label-filled",
          size === "small" && "coim-input-label-size-small",
          isShrunk && "coim-input-label-shrink",
          focused && "coim-focused",
          error && "coim-error",
          disabled && "coim-disabled",
        )}
      >
        {label}{required ? " *" : ""}
      </label>
    {/if}

    <CoimInput
      id={fieldId}
      {name}
      {type}
      bind:value
      bind:inputRef
      bind:textareaRef
      {variant}
      {standardOutlined}
      {size}
      {surface}
      {error}
      {disabled}
      {readOnly}
      {required}
      {fullWidth}
      {multiline}
      {rows}
      {minRows}
      {maxRows}
      {label}
      floatingLabel={useFloating}
      shrunk={isShrunk}
      {placeholder}
      {mask}
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
      {startAdornment}
      {endAdornment}
      {onValueChange}
      {oninput}
      {onchange}
      {onkeydown}
      {onkeyup}
      onfocus={(e) => {
        focused = true;
        onFocusProp?.(e);
      }}
      onblur={(e) => {
        focused = false;
        onBlurProp?.(e);
      }}
      {inputProps}
      class={inputClass}
      {...rest}
    />
  </div>

  {#if helperSnippet}
    <CoimFormHelperText>{@render helperSnippet()}</CoimFormHelperText>
  {:else if helperText}
    <CoimFormHelperText>{helperText}</CoimFormHelperText>
  {/if}
</CoimFormControl>
