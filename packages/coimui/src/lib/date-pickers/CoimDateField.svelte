<script lang="ts">
  import { DateField } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../utilities/utils.js";
  import type { CoimDateGranularity } from "./types.js";

  interface Props {
    value?: DateValue;
    placeholder?: DateValue;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    granularity?: CoimDateGranularity;
    hourCycle?: 12 | 24;
    locale?: string;
    onValueChange?: (value: DateValue | undefined) => void;
    class?: string;
  }

  let {
    value = $bindable<DateValue | undefined>(undefined),
    placeholder = $bindable<DateValue | undefined>(undefined),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    minValue,
    maxValue,
    granularity,
    hourCycle,
    locale = "en",
    onValueChange,
    class: className = "",
  }: Props = $props();
</script>

<DateField.Root
  bind:value
  bind:placeholder
  {disabled}
  {readonly}
  {required}
  {minValue}
  {maxValue}
  {granularity}
  {hourCycle}
  {locale}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
>
  <div class={cn("coim-date-field-wrap", error && "coim-error", className)}>
    {#if label}
      <DateField.Label class="coim-date-field-label">
        {label}{required ? " *" : ""}
      </DateField.Label>
    {/if}

    <DateField.Input class="coim-date-input">
      {#snippet children({ segments })}
        {#each segments as { part, value: segVal }, idx (`${idx}-${part}`)}
          {#if part === "literal"}
            <span class="text-text-secondary select-none">{segVal}</span>
          {:else}
            <DateField.Segment {part} class="coim-date-segment">
              {segVal}
            </DateField.Segment>
          {/if}
        {/each}
      {/snippet}
    </DateField.Input>

    {#if helperText}
      <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
        {helperText}
      </p>
    {/if}
  </div>
</DateField.Root>
