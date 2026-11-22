<script lang="ts">
  import { TimeField } from "bits-ui";
  import type { Time } from "@internationalized/date";
  import type { Snippet } from "svelte";
  import { cn } from "../utilities/utils.js";

  interface Props {
    value?: Time;
    placeholder?: Time;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    hourCycle?: 12 | 24;
    granularity?: "hour" | "minute" | "second";
    locale?: string;
    onValueChange?: (value: Time | undefined) => void;
    endAdornment?: Snippet;
    class?: string;
  }

  let {
    value = $bindable<Time | undefined>(undefined),
    placeholder = $bindable<Time | undefined>(undefined),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    hourCycle = 24,
    granularity = "minute",
    locale = "en",
    onValueChange,
    endAdornment,
    class: className = "",
  }: Props = $props();
</script>

<TimeField.Root
  bind:value
  bind:placeholder
  {disabled}
  {readonly}
  {required}
  {hourCycle}
  {granularity}
  {locale}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
>
  <div class={cn("coim-date-field-wrap", error && "coim-error", className)}>
    {#if label}
      <TimeField.Label class="coim-date-field-label">
        {label}{required ? " *" : ""}
      </TimeField.Label>
    {/if}

    <TimeField.Input class="coim-date-input">
      {#snippet children({ segments })}
        {#each segments as { part, value: segVal }, idx (`${idx}-${part}`)}
          {#if part === "literal"}
            <span class="text-text-secondary select-none">{segVal}</span>
          {:else}
            <TimeField.Segment {part} class="coim-date-segment">
              {segVal}
            </TimeField.Segment>
          {/if}
        {/each}
        {@render endAdornment?.()}
      {/snippet}
    </TimeField.Input>

    {#if helperText}
      <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
        {helperText}
      </p>
    {/if}
  </div>
</TimeField.Root>
