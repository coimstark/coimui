<script lang="ts" module>
  export interface SelectGroupEntry {
    group: string | null;
    items: { value: string; label: string; disabled?: boolean }[];
  }
</script>

<script lang="ts">
  import { Select } from "bits-ui";
  import type { Snippet } from "svelte";
  import CiCheck from "../../icons/ui/CiCheck.svelte";
  import CiChevronDownSmall from "../../icons/ui/CiChevronDownSmall.svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";
  import type { CoimInputSize, CoimInputVariant, CoimSelectOption } from "./types.js";

  interface Props {
    id?: string;
    options?: CoimSelectOption[];
    value?: string | string[];
    multiple?: boolean;
    open?: boolean;
    label?: string;
    helperText?: string;
    placeholder?: string;
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    fullWidth?: boolean;
    allowDeselect?: boolean;
    optionSnippet?: Snippet<[{ option: CoimSelectOption; selected: boolean }]>;
    onValueChange?: (value: string | string[]) => void;
    class?: string;
  }

  const uid = $props.id();

  let {
    id: idProp,
    options = [],
    value = $bindable<string | string[]>(""),
    multiple = false,
    open = $bindable(false),
    label,
    helperText,
    placeholder = "Select an option",
    variant: variantProp,
    size: sizeProp,
    surface: surfaceProp,
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    readOnly: readOnlyProp,
    fullWidth: fullWidthProp,
    allowDeselect = false,
    optionSnippet,
    onValueChange,
    class: className = "",
  }: Props = $props();

  const ctx = tryGetFormControlContext();
  const resolvedId = $derived(idProp ?? ctx?.id ?? `coim-select-${uid}`);
  const resolvedVariant = $derived(variantProp ?? ctx?.variant ?? "standard");
  const resolvedSize = $derived(sizeProp ?? ctx?.size ?? "medium");
  const isSurface = $derived(surfaceProp ?? ctx?.surface ?? false);
  const isError = $derived(errorProp ?? ctx?.error ?? false);
  const isDisabled = $derived(disabledProp ?? ctx?.disabled ?? false);
  const isReadOnly = $derived(readOnlyProp ?? ctx?.readOnly ?? false);
  const isRequired = $derived(requiredProp ?? ctx?.required ?? false);
  const isFullWidth = $derived(fullWidthProp ?? ctx?.fullWidth ?? false);

  const normalizedOptions = $derived(
    options.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
      disabled: opt.disabled,
      group: opt.group,
    })),
  );

  const selectedValues = $derived(
    multiple
      ? Array.isArray(value)
        ? value.map(String)
        : value
          ? [String(value)]
          : []
      : [],
  );

  const singleValue = $derived(!multiple && typeof value === "string" ? value : "");

  const selectedLabel = $derived.by(() => {
    if (multiple) return "";
    const match = normalizedOptions.find((o) => o.value === singleValue);
    return match?.label ?? "";
  });

  function handleOpenChange(nextOpen: boolean) {
    if (isReadOnly) return;
    open = nextOpen;
  }

  function removeChip(val: string, event: Event) {
    event.stopPropagation();
    if (isDisabled || isReadOnly) return;
    const next = selectedValues.filter((v) => v !== val);
    value = next;
    onValueChange?.(next);
  }
</script>

<div class={cn("flex flex-col", isFullWidth && "w-full", className)}>
  {#if label && !ctx}
    <label
      for={resolvedId}
      class="coim-form-label font-body text-text-primary mb-2 block text-base font-semibold"
    >
      {label}{isRequired ? " *" : ""}
    </label>
  {/if}

  {#if multiple}
    <Select.Root
      type="multiple"
      value={selectedValues}
      onValueChange={(next) => {
        value = next;
        onValueChange?.(next);
      }}
      {open}
      onOpenChange={handleOpenChange}
      disabled={isDisabled}
      required={isRequired}
      items={normalizedOptions}
    >
      <Select.Trigger
        id={resolvedId}
        aria-invalid={isError || undefined}
        class={cn(
          "coim-input-root coim-select-trigger min-h-10 gap-2",
          resolvedVariant === "standard" && "coim-input-standard",
          resolvedVariant === "surface-standard" && "coim-input-surface-standard",
          resolvedVariant === "outlined" && "coim-input-standard-outlined",
          resolvedVariant === "filled" && "coim-input-filled px-4 py-2",
          resolvedSize === "small" && "coim-input-size-small min-h-8",
          isSurface && "surface",
          open && "coim-focused",
          isError && "coim-error",
          isDisabled && "coim-disabled",
          isReadOnly && "coim-select-readonly",
        )}
      >
        <div class="flex flex-1 flex-wrap items-center gap-1 text-start">
          {#if selectedValues.length === 0}
            <span class="opacity-disabled text-text-primary">{placeholder}</span>
          {:else}
            {#each selectedValues as chipVal (chipVal)}
              {@const match = normalizedOptions.find((o) => o.value === chipVal)}
              <span class="coim-select-chip">
                <span>{match?.label ?? chipVal}</span>
                <span
                  role="button"
                  tabindex={-1}
                  aria-label="Remove {match?.label ?? chipVal}"
                  onclick={(e) => removeChip(chipVal, e)}
                  onkeydown={(e) => e.key === "Enter" && removeChip(chipVal, e)}
                  class="hover:text-error inline-flex cursor-pointer items-center"
                >
                  <CiCross size={12} />
                </span>
              </span>
            {/each}
          {/if}
        </div>
        <CiChevronDownSmall
          size="small"
          class={cn("coim-select-icon", open && "rotate-180")}
        />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          sideOffset={4}
          class={cn(
            "coim-select-content min-w-[var(--bits-select-anchor-width)]",
            resolvedVariant === "outlined" && "outlined",
          )}
        >
          {#each normalizedOptions as opt (opt.value)}
            {@const isSelected = selectedValues.includes(opt.value)}
            <Select.Item
              value={opt.value}
              label={opt.label}
              disabled={opt.disabled}
              class="coim-select-item"
            >
              {#if optionSnippet}
                {@render optionSnippet({ option: opt, selected: isSelected })}
              {:else}
                <span>{opt.label}</span>
              {/if}
              {#if isSelected}
                <CiCheck size="small" class="text-primary shrink-0" />
              {/if}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  {:else}
    <Select.Root
      type="single"
      value={singleValue}
      onValueChange={(next) => {
        value = next;
        onValueChange?.(next);
      }}
      {open}
      onOpenChange={handleOpenChange}
      disabled={isDisabled}
      required={isRequired}
      {allowDeselect}
      items={normalizedOptions}
    >
      <Select.Trigger
        id={resolvedId}
        aria-invalid={isError || undefined}
        class={cn(
          "coim-input-root coim-select-trigger min-h-10 gap-2",
          resolvedVariant === "standard" && "coim-input-standard",
          resolvedVariant === "surface-standard" && "coim-input-surface-standard",
          resolvedVariant === "outlined" && "coim-input-standard-outlined",
          resolvedVariant === "filled" && "coim-input-filled px-4 py-2",
          resolvedSize === "small" && "coim-input-size-small min-h-8",
          isSurface && "surface",
          open && "coim-focused",
          isError && "coim-error",
          isDisabled && "coim-disabled",
          isReadOnly && "coim-select-readonly",
        )}
      >
        <span class={cn("truncate", !selectedLabel && "opacity-disabled text-text-primary")}>
          {selectedLabel || placeholder}
        </span>
        <CiChevronDownSmall
          size="small"
          class={cn("coim-select-icon", open && "rotate-180")}
        />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          sideOffset={4}
          class={cn(
            "coim-select-content min-w-[var(--bits-select-anchor-width)]",
            resolvedVariant === "outlined" && "outlined",
          )}
        >
          {#each normalizedOptions as opt (opt.value)}
            {@const isSelected = singleValue === opt.value}
            <Select.Item
              value={opt.value}
              label={opt.label}
              disabled={opt.disabled}
              class="coim-select-item"
            >
              {#if optionSnippet}
                {@render optionSnippet({ option: opt, selected: isSelected })}
              {:else}
                <span>{opt.label}</span>
              {/if}
              {#if isSelected}
                <CiCheck size="small" class="text-primary shrink-0" />
              {/if}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  {/if}

  {#if helperText}
    <p class={cn("coim-form-helper-text", isError && "coim-error text-error")}>
      {helperText}
    </p>
  {/if}
</div>
