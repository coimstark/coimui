<script lang="ts">
  import { DateRangePicker, Portal, type DateRange } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import CiCalendar from "../icons/ui/CiCalendar.svelte";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimDateRangePreset } from "./types.js";
  import { getPresetDateRanges } from "./utils.js";

  interface Props {
    value?: DateRange;
    placeholder?: DateValue;
    open?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    numberOfMonths?: number;
    presets?: CoimDateRangePreset[];
    showPresets?: boolean;
    locale?: string;
    onValueChange?: (value: DateRange) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<DateRange>({ start: undefined, end: undefined }),
    placeholder = $bindable<DateValue | undefined>(undefined),
    open = $bindable(false),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    minValue,
    maxValue,
    numberOfMonths = 2,
    presets,
    showPresets = true,
    locale = "en",
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const resolvedPresets = $derived(presets ?? (showPresets ? getPresetDateRanges() : []));
</script>

<DateRangePicker.Root
  bind:value
  bind:placeholder
  {open}
  onOpenChange={(next) => {
    open = next;
    onOpenChange?.(next);
  }}
  {disabled}
  {readonly}
  {required}
  {minValue}
  {maxValue}
  {numberOfMonths}
  {locale}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
>
  <div class={cn("coim-date-field-wrap", error && "coim-error", className)}>
    {#if label}
      <DateRangePicker.Label class="coim-date-field-label">
        {label}{required ? " *" : ""}
      </DateRangePicker.Label>
    {/if}

    <div class="coim-date-input">
      <DateRangePicker.Input type="start" class="inline-flex items-center">
        {#snippet children({ segments })}
          {#each segments as { part, value: segVal }, idx (`s-${idx}-${part}`)}
            {#if part === "literal"}
              <span class="text-text-secondary select-none">{segVal}</span>
            {:else}
              <DateRangePicker.Segment {part} class="coim-date-segment">
                {segVal}
              </DateRangePicker.Segment>
            {/if}
          {/each}
        {/snippet}
      </DateRangePicker.Input>

      <span class="text-text-secondary px-1 select-none">→</span>

      <DateRangePicker.Input type="end" class="inline-flex items-center">
        {#snippet children({ segments })}
          {#each segments as { part, value: segVal }, idx (`e-${idx}-${part}`)}
            {#if part === "literal"}
              <span class="text-text-secondary select-none">{segVal}</span>
            {:else}
              <DateRangePicker.Segment {part} class="coim-date-segment">
                {segVal}
              </DateRangePicker.Segment>
            {/if}
          {/each}
        {/snippet}
      </DateRangePicker.Input>

      <DateRangePicker.Trigger aria-label="Open date range calendar" class="coim-date-trigger">
        <CiCalendar size="small" />
      </DateRangePicker.Trigger>
    </div>

    {#if helperText}
      <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
        {helperText}
      </p>
    {/if}
  </div>

  <Portal>
    <DateRangePicker.Content sideOffset={6} class="z-50 outline-none">
      <div class="coim-calendar-card flex flex-col gap-3 md:flex-row">
        {#if resolvedPresets.length > 0}
          <div class="border-grey-100 flex flex-row flex-wrap gap-1 border-b pb-2 md:w-36 md:flex-col md:border-e md:border-b-0 md:pe-3 md:pb-0">
            {#each resolvedPresets as preset (preset.id)}
              <button
                type="button"
                class="hover:bg-grey-50 text-text-primary rounded-md px-2.5 py-1.5 text-start text-xs font-medium"
                onclick={() => {
                  value = preset.range;
                  onValueChange?.(preset.range);
                  open = false;
                  onOpenChange?.(false);
                }}
              >
                {preset.label}
              </button>
            {/each}
          </div>
        {/if}

        <DateRangePicker.Calendar>
          {#snippet children({ months, weekdays })}
            <DateRangePicker.Header class="coim-calendar-header">
              <DateRangePicker.PrevButton aria-label="Previous month" class="coim-calendar-nav-btn">
                <CiChevronLeftSmall size="small" />
              </DateRangePicker.PrevButton>
              <DateRangePicker.Heading class="coim-calendar-heading" />
              <DateRangePicker.NextButton aria-label="Next month" class="coim-calendar-nav-btn">
                <CiChevronRightSmall size="small" />
              </DateRangePicker.NextButton>
            </DateRangePicker.Header>

            <div class="flex flex-col gap-4 sm:flex-row">
              {#each months as month (month.value.toString())}
                <DateRangePicker.Grid class="coim-calendar-grid">
                  <DateRangePicker.GridHead>
                    <DateRangePicker.GridRow>
                      {#each weekdays as day, idx (idx)}
                        <DateRangePicker.HeadCell class="coim-calendar-head-cell">
                          {day.slice(0, 2)}
                        </DateRangePicker.HeadCell>
                      {/each}
                    </DateRangePicker.GridRow>
                  </DateRangePicker.GridHead>
                  <DateRangePicker.GridBody>
                    {#each month.weeks as weekDates, wi (wi)}
                      <DateRangePicker.GridRow>
                        {#each weekDates as date (date.toString())}
                          <DateRangePicker.Cell {date} month={month.value} class="coim-calendar-cell">
                            <DateRangePicker.Day class="coim-calendar-day" />
                          </DateRangePicker.Cell>
                        {/each}
                      </DateRangePicker.GridRow>
                    {/each}
                  </DateRangePicker.GridBody>
                </DateRangePicker.Grid>
              {/each}
            </div>
          {/snippet}
        </DateRangePicker.Calendar>
      </div>
    </DateRangePicker.Content>
  </Portal>
</DateRangePicker.Root>
