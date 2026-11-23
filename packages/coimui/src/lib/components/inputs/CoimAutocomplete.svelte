<script lang="ts">
  import { Combobox } from "bits-ui";
  import CiCheck from "../../icons/ui/CiCheck.svelte";
  import CiChevronDownSmall from "../../icons/ui/CiChevronDownSmall.svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetFormControlContext } from "./context.svelte.js";
  import type {
    CoimAutocompleteOptionItem,
    CoimInputSize,
    CoimInputVariant,
    CoimNormalizedOption,
  } from "./types.js";
  import {
    matchHighlights,
    normalizeAutocompleteOption,
    parseHighlights,
  } from "./utils.js";

  interface Props {
    id?: string;
    options?: CoimAutocompleteOptionItem[];
    value?: string | string[] | null;
    inputValue?: string;
    multiple?: boolean;
    freeSolo?: boolean;
    creatable?: boolean;
    checkboxSelection?: boolean;
    open?: boolean;
    label?: string;
    placeholder?: string;
    noOptionsText?: string;
    loading?: boolean;
    loadingText?: string;
    highlightMatch?: boolean;
    createOptionLabel?: (input: string) => string;
    onCreateOption?: (input: string) => void;
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    fullWidth?: boolean;
    filterOptions?: (opts: CoimNormalizedOption[], query: string) => CoimNormalizedOption[];
    onValueChange?: (value: string | string[] | null) => void;
    onInputChange?: (query: string) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  const uid = $props.id();

  let {
    id: idProp,
    options = [],
    value = $bindable<string | string[] | null>(null),
    inputValue = $bindable(""),
    multiple = false,
    freeSolo = false,
    creatable = false,
    checkboxSelection = false,
    open = $bindable(false),
    label,
    placeholder = "Search...",
    noOptionsText = "No options",
    loading = false,
    loadingText = "Loading...",
    highlightMatch = true,
    createOptionLabel = (q: string) => `Create "${q}"`,
    onCreateOption,
    variant: variantProp,
    size: sizeProp,
    surface: surfaceProp,
    error: errorProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    fullWidth: fullWidthProp,
    filterOptions,
    onValueChange,
    onInputChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const ctx = tryGetFormControlContext();
  const resolvedId = $derived(idProp ?? ctx?.id ?? `coim-autocomplete-${uid}`);
  const resolvedVariant = $derived(variantProp ?? ctx?.variant ?? "outlined");
  const resolvedSize = $derived(sizeProp ?? ctx?.size ?? "medium");
  const isSurface = $derived(surfaceProp ?? ctx?.surface ?? false);
  const isError = $derived(errorProp ?? ctx?.error ?? false);
  const isDisabled = $derived(disabledProp ?? ctx?.disabled ?? false);
  const isReadOnly = $derived(readOnlyProp ?? ctx?.readOnly ?? false);
  const isFullWidth = $derived(fullWidthProp ?? ctx?.fullWidth ?? false);

  const normalizedOptions = $derived(options.map(normalizeAutocompleteOption));

  const filteredOptions = $derived.by(() => {
    const q = inputValue.trim().toLowerCase();
    if (filterOptions) return filterOptions(normalizedOptions, inputValue);
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q),
    );
  });

  const selectedArray = $derived(
    multiple
      ? Array.isArray(value)
        ? value.map(String)
        : value
          ? [String(value)]
          : []
      : [],
  );

  const singleValue = $derived(!multiple && typeof value === "string" ? value : "");

  const groupedOptions = $derived.by(() => {
    const groups: Array<{ group: string | null; items: CoimNormalizedOption[] }> = [];
    const byKey = new Map<string, { group: string | null; items: CoimNormalizedOption[] }>();
    for (const opt of filteredOptions) {
      const grp = opt.group ?? null;
      const key = grp ?? "__ungrouped__";
      let bucket = byKey.get(key);
      if (!bucket) {
        bucket = { group: grp, items: [] };
        byKey.set(key, bucket);
        groups.push(bucket);
      }
      bucket.items.push(opt);
    }
    return groups;
  });

  const canCreateCurrent = $derived.by(() => {
    if (!creatable || isDisabled || isReadOnly) return false;
    const trimmed = inputValue.trim();
    if (!trimmed) return false;
    const lower = trimmed.toLowerCase();
    return !normalizedOptions.some(
      (opt) => opt.label.toLowerCase() === lower || opt.value.toLowerCase() === lower,
    );
  });

  function createCurrentOption() {
    const trimmed = inputValue.trim();
    if (!trimmed || isDisabled || isReadOnly) return;
    onCreateOption?.(trimmed);
    if (multiple) {
      if (!selectedArray.includes(trimmed)) {
        const next = [...selectedArray, trimmed];
        value = next;
        onValueChange?.(next);
      }
      inputValue = "";
    } else {
      value = trimmed;
      inputValue = trimmed;
      onValueChange?.(trimmed);
      open = false;
      onOpenChange?.(false);
    }
  }

  function handleClear() {
    if (isDisabled || isReadOnly) return;
    inputValue = "";
    value = multiple ? [] : null;
    onValueChange?.(value);
    onInputChange?.("");
  }

  function removeTag(tagVal: string, event: Event) {
    event.stopPropagation();
    if (isDisabled || isReadOnly) return;
    const next = selectedArray.filter((v) => v !== tagVal);
    value = next;
    onValueChange?.(next);
  }

  function handleInputKeyDown(e: KeyboardEvent) {
    if (
      (freeSolo || creatable) &&
      e.key === "Enter" &&
      inputValue.trim() &&
      filteredOptions.length === 0
    ) {
      e.preventDefault();
      if (creatable) {
        createCurrentOption();
        return;
      }
      const customVal = inputValue.trim();
      if (multiple) {
        if (!selectedArray.includes(customVal)) {
          const next = [...selectedArray, customVal];
          value = next;
          onValueChange?.(next);
        }
        inputValue = "";
      } else {
        value = customVal;
        onValueChange?.(customVal);
        open = false;
      }
    } else if (
      multiple &&
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedArray.length > 0
    ) {
      const next = selectedArray.slice(0, -1);
      value = next;
      onValueChange?.(next);
    }
  }
</script>

{#snippet renderDropdownContent(isMulti: boolean)}
  {#if loading}
    <div class="coim-autocomplete-loading">{loadingText}</div>
  {:else if filteredOptions.length === 0 && !canCreateCurrent}
    <div class="coim-autocomplete-no-options">{noOptionsText}</div>
  {:else}
    {#each groupedOptions as bucket (bucket.group ?? "__ungrouped__")}
      {#if bucket.group}
        <div
          role="presentation"
          class="text-text-secondary px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
        >
          {bucket.group}
        </div>
      {/if}
      {#each bucket.items as opt (opt.value)}
        {@const isSel = isMulti ? selectedArray.includes(opt.value) : singleValue === opt.value}
        {@const parts = highlightMatch
          ? parseHighlights(opt.label, matchHighlights(opt.label, inputValue))
          : [{ text: opt.label, highlight: false }]}
        <Combobox.Item
          value={opt.value}
          label={opt.label}
          disabled={opt.disabled}
          class="coim-autocomplete-option justify-between"
        >
          <span class="flex min-w-0 items-center gap-2">
            {#if isMulti && checkboxSelection}
              <span
                aria-hidden="true"
                class={cn(
                  "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  isSel
                    ? "border-primary bg-primary text-primary-contrast"
                    : "border-grey-300 bg-background-paper",
                )}
              >
                {#if isSel}
                  <CiCheck size={12} />
                {/if}
              </span>
            {/if}
            <span class="truncate">
              {#each parts as part, idx (idx)}
                {#if part.highlight}
                  <strong class="text-primary-fg font-bold">{part.text}</strong>
                {:else}
                  {part.text}
                {/if}
              {/each}
            </span>
          </span>
          {#if isSel && !(isMulti && checkboxSelection)}
            <CiCheck size="small" class="text-primary-fg shrink-0" />
          {/if}
        </Combobox.Item>
      {/each}
    {/each}

    {#if canCreateCurrent}
      <button
        type="button"
        class="coim-autocomplete-option text-primary-fg hover:bg-grey-25 w-full justify-start font-medium"
        onclick={createCurrentOption}
      >
        {createOptionLabel(inputValue.trim())}
      </button>
    {/if}
  {/if}
{/snippet}

<div
  class={cn(
    "coim-autocomplete-root",
    resolvedSize === "small" && "coim-autocomplete-size-small",
    isFullWidth && "w-full",
    className,
  )}
>
  {#if label && !ctx}
    <label
      for={resolvedId}
      class="coim-form-label font-body text-text-primary mb-2 block text-base font-semibold"
    >
      {label}
    </label>
  {/if}

  {#if multiple}
    <Combobox.Root
      type="multiple"
      value={selectedArray}
      onValueChange={(next) => {
        value = next;
        inputValue = "";
        onValueChange?.(next);
      }}
      {open}
      onOpenChange={(next) => {
        if (!isReadOnly) {
          open = next;
          onOpenChange?.(next);
        }
      }}
      disabled={isDisabled}
      {inputValue}
    >
      <div
        class={cn(
          "coim-input-root min-h-10 gap-2 px-3 py-1.5",
          resolvedVariant === "standard" && "coim-input-standard",
          resolvedVariant === "surface-standard" && "coim-input-surface-standard",
          resolvedVariant === "outlined" && "coim-input-standard-outlined",
          resolvedVariant === "filled" && "coim-input-filled",
          resolvedSize === "small" && "coim-input-size-small min-h-8",
          isSurface && "surface",
          open && "coim-focused",
          isError && "coim-error",
          isDisabled && "coim-disabled",
        )}
      >
        <div class="coim-autocomplete-input-wrap">
          {#each selectedArray as tagVal (tagVal)}
            {@const found = normalizedOptions.find((o) => o.value === tagVal)}
            <span class="coim-autocomplete-chip">
              <span>{found?.label ?? tagVal}</span>
              <button
                type="button"
                aria-label="Remove {found?.label ?? tagVal}"
                onclick={(e) => removeTag(tagVal, e)}
                class="coim-autocomplete-chip-delete"
              >
                <CiCross size={10} />
              </button>
            </span>
          {/each}

          <Combobox.Input
            id={resolvedId}
            placeholder={selectedArray.length === 0 ? placeholder : ""}
            readonly={isReadOnly}
            aria-label={label ?? placeholder}
            aria-invalid={isError || undefined}
            oninput={(e) => {
              const q = (e.currentTarget as HTMLInputElement).value;
              inputValue = q;
              open = true;
              onInputChange?.(q);
            }}
            onkeydown={handleInputKeyDown}
            class="coim-autocomplete-input"
          />
        </div>

        <div class="flex shrink-0 items-center gap-1">
          {#if selectedArray.length > 0 || inputValue}
            <button
              type="button"
              aria-label="Clear"
              onclick={handleClear}
              class="coim-autocomplete-clear"
            >
              <CiCross size="tiny" />
            </button>
          {/if}
          <Combobox.Trigger class="coim-autocomplete-popup" aria-label="Toggle options">
            <CiChevronDownSmall size="small" class={cn(open && "rotate-180")} />
          </Combobox.Trigger>
        </div>
      </div>

      <Combobox.Portal>
        <Combobox.Content
          sideOffset={4}
          class={cn(
            "coim-autocomplete-paper min-w-[var(--bits-combobox-anchor-width)]",
            resolvedVariant === "outlined" && "outlined",
          )}
        >
          {@render renderDropdownContent(true)}
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  {:else}
    <Combobox.Root
      type="single"
      value={singleValue}
      onValueChange={(next) => {
        value = next || null;
        const found = normalizedOptions.find((o) => o.value === next);
        inputValue = found?.label ?? next ?? "";
        onValueChange?.(value);
      }}
      {open}
      onOpenChange={(next) => {
        if (!isReadOnly) {
          open = next;
          onOpenChange?.(next);
        }
      }}
      disabled={isDisabled}
      {inputValue}
    >
      <div
        class={cn(
          "coim-input-root min-h-10 gap-2 px-3 py-1.5",
          resolvedVariant === "standard" && "coim-input-standard",
          resolvedVariant === "surface-standard" && "coim-input-surface-standard",
          resolvedVariant === "outlined" && "coim-input-standard-outlined",
          resolvedVariant === "filled" && "coim-input-filled",
          resolvedSize === "small" && "coim-input-size-small min-h-8",
          isSurface && "surface",
          open && "coim-focused",
          isError && "coim-error",
          isDisabled && "coim-disabled",
        )}
      >
        <div class="coim-autocomplete-input-wrap">
          <Combobox.Input
            id={resolvedId}
            {placeholder}
            readonly={isReadOnly}
            aria-label={label ?? placeholder}
            aria-invalid={isError || undefined}
            oninput={(e) => {
              const q = (e.currentTarget as HTMLInputElement).value;
              inputValue = q;
              open = true;
              onInputChange?.(q);
            }}
            onkeydown={handleInputKeyDown}
            class="coim-autocomplete-input"
          />
        </div>

        <div class="flex shrink-0 items-center gap-1">
          {#if singleValue || inputValue}
            <button
              type="button"
              aria-label="Clear"
              onclick={handleClear}
              class="coim-autocomplete-clear"
            >
              <CiCross size="tiny" />
            </button>
          {/if}
          <Combobox.Trigger class="coim-autocomplete-popup" aria-label="Toggle options">
            <CiChevronDownSmall size="small" class={cn(open && "rotate-180")} />
          </Combobox.Trigger>
        </div>
      </div>

      <Combobox.Portal>
        <Combobox.Content
          sideOffset={4}
          class={cn(
            "coim-autocomplete-paper min-w-[var(--bits-combobox-anchor-width)]",
            resolvedVariant === "outlined" && "outlined",
          )}
        >
          {@render renderDropdownContent(false)}
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  {/if}
</div>
