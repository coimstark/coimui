<script lang="ts">
  import CiMinus from "../../icons/ui/CiMinus.svelte";
  import CiPlus from "../../icons/ui/CiPlus.svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimInputSize, CoimInputVariant } from "./types.js";

  interface Props {
    id?: string;
    value?: number | null;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    label?: string;
    onValueChange?: (value: number | null) => void;
    class?: string;
  }

  let {
    id: idProp,
    value = $bindable<number | null>(0),
    min,
    max,
    step = 1,
    precision,
    variant: variantProp,
    size: sizeProp,
    surface: surfaceProp,
    error: errorProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    required: requiredProp,
    fullWidth: fullWidthProp,
    placeholder,
    label,
    onValueChange,
    class: className = "",
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

  function clampAndRound(next: number): number {
    let v = next;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    if (precision !== undefined) {
      const factor = 10 ** precision;
      v = Math.round(v * factor) / factor;
    }
    return v;
  }

  function stepBy(delta: number) {
    if (isDisabled || isReadOnly) return;
    const base = value ?? 0;
    const next = clampAndRound(base + delta);
    value = next;
    onValueChange?.(next);
  }

  function handleInputChange(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      value = null;
      onValueChange?.(null);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed)) {
      const next = clampAndRound(parsed);
      value = next;
      onValueChange?.(next);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepBy(step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      stepBy(-step);
    }
  }
</script>

<div
  class={cn(
    "coim-number-field inline-flex flex-col",
    isFullWidth && "w-full",
    className,
  )}
>
  <div
    class={cn(
      "coim-input-root justify-between gap-1",
      resolvedVariant === "standard" && "coim-input-standard",
      resolvedVariant === "surface-standard" && "coim-input-surface-standard",
      resolvedVariant === "outlined" && "coim-input-standard-outlined",
      resolvedVariant === "filled" && "coim-input-filled",
      resolvedSize === "small" && "coim-input-size-small",
      isSurface && "surface",
      focused && "coim-focused",
      isError && "coim-error",
      isDisabled && "coim-disabled",
      isReadOnly && "coim-readonly",
    )}
  >
    <button
      type="button"
      aria-label="Decrease value"
      disabled={isDisabled || isReadOnly || (min !== undefined && (value ?? 0) <= min)}
      onclick={() => stepBy(-step)}
      class="text-text-secondary hover:text-primary inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent transition-colors disabled:pointer-events-none disabled:opacity-40"
    >
      <CiMinus size="small" />
    </button>

    <input
      id={resolvedId}
      type="number"
      inputmode="decimal"
      value={value ?? ""}
      {min}
      {max}
      {step}
      {placeholder}
      disabled={isDisabled}
      readonly={isReadOnly}
      required={isRequired}
      aria-label={label}
      aria-invalid={isError || undefined}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      onkeydown={handleKeyDown}
      oninput={(e) => handleInputChange((e.currentTarget as HTMLInputElement).value)}
      class="coim-input-field text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />

    <button
      type="button"
      aria-label="Increase value"
      disabled={isDisabled || isReadOnly || (max !== undefined && (value ?? 0) >= max)}
      onclick={() => stepBy(step)}
      class="text-text-secondary hover:text-primary inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent transition-colors disabled:pointer-events-none disabled:opacity-40"
    >
      <CiPlus size="small" />
    </button>
  </div>
</div>
